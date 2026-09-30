"""
CampusBrief backend.

Pipeline: document -> text extraction -> (vision fallback if text is thin)
-> single structured LLM call -> JSON result the frontend renders directly.

Deliberately lightweight: no vector DB, no local model inference, no queue.
In-memory store only â€” fine for a hackathon demo, not for production.
"""
import base64
import io
import os
from dotenv import load_dotenv
load_dotenv()
import uuid
from datetime import date

import pdfplumber
from google import genai
from google.genai import types
from docx import Document
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

MODEL = "gemini-3.6-flash"
MIN_TEXT_LENGTH = 50  # below this, a PDF is treated as scanned/image-based
MAX_VISION_PDF_BYTES = 15 * 1024 * 1024  # ~15MB; stay well under API upload limits

app = FastAPI(title="CampusBrief API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten before shipping past the hackathon
    allow_methods=["*"],
    allow_headers=["*"],
)

# notice_id -> {"structured": {...}, "full_text": str, "filename": str}
NOTICES: dict[str, dict] = {}


def get_client():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="Server is missing GEMINI_API_KEY. Set it in the backend environment.",
        )
    return genai.Client(api_key=api_key)


# ---------- text extraction ----------

def extract_pdf_text(raw: bytes) -> str:
    text_parts = []
    with pdfplumber.open(io.BytesIO(raw)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text() or ""
            text_parts.append(page_text)
    return "\n".join(text_parts).strip()


def extract_docx_text(raw: bytes) -> str:
    doc = Document(io.BytesIO(raw))
    return "\n".join(p.text for p in doc.paragraphs).strip()


def extract_text(filename: str, raw: bytes) -> tuple[str, bool]:
    """Returns (text, needs_vision_fallback)."""
    lower = filename.lower()
    if lower.endswith(".pdf"):
        text = extract_pdf_text(raw)
        return text, len(text) < MIN_TEXT_LENGTH
    if lower.endswith(".docx"):
        return extract_docx_text(raw), False
    if lower.endswith(".txt"):
        return raw.decode("utf-8", errors="ignore").strip(), False
    raise HTTPException(status_code=400, detail="Unsupported file type. Use PDF, DOCX or TXT.")


# ---------- LLM analysis ----------

EXTRACTION_TOOL = {
    "name": "record_notice_analysis",
    "description": "Record the structured analysis of a campus notice.",
    "input_schema": {
        "type": "object",
        "properties": {
            "title": {"type": "string"},
            "category": {
                "type": "string",
                "enum": ["Academic", "Fees", "Examination", "Event", "General", "Urgent"],
            },
            "urgency": {"type": "string", "enum": ["low", "medium", "high"]},
            "deadline_date": {
                "type": "string",
                "description": "ISO date YYYY-MM-DD, or null if no deadline is stated.",
            },
            "deadline_display": {"type": "string", "description": "e.g. '08 Sep 2026'"},
            "deadline_time": {"type": "string"},
            "deadline_confidence": {"type": "number"},
            "deadline_source_page": {"type": "integer"},
            "deadline_source_excerpt": {"type": "string"},
            "venue": {"type": "string"},
            "venue_source_page": {"type": "integer"},
            "venue_source_excerpt": {"type": "string"},
            "fee": {"type": "string"},
            "fee_source_page": {"type": "integer"},
            "fee_source_excerpt": {"type": "string"},
            "eligibility": {"type": "string"},
            "eligibility_source_page": {"type": "integer"},
            "eligibility_source_excerpt": {"type": "string"},
            "summary": {"type": "string", "description": "2-3 sentence plain-language summary."},
            "action_items": {"type": "array", "items": {"type": "string"}},
            "important_points": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {"label": {"type": "string"}, "detail": {"type": "string"}},
                    "required": ["label", "detail"],
                },
            },
        },
        "required": ["title", "category", "urgency", "summary", "action_items", "important_points"],
    },
}

SYSTEM_PROMPT = (
    "You extract structured, actionable information from campus notices/circulars "
    "for Indian college students. Only use information explicitly present in the document. "
    "Never infer, calculate, or invent missing values. "
    "IMPORTANT: A commencement date, issue date, publication date, event date, or general "
    "date is NOT a deadline unless the document explicitly states that something must be "
    "completed, submitted, paid, registered, reported, or done by that date/time. "
    "If there is no explicit deadline, deadline_date, deadline_display, deadline_time, "
    "deadline_source_page, and deadline_source_excerpt must be empty strings. "
    "If no fee is explicitly stated, fee must be an empty string. "
    "If no venue is explicitly stated, venue must be an empty string. "
    "If no eligibility is explicitly stated, eligibility must be an empty string. "
    "Do not convert missing values into 0, placeholder names, or guessed values. "
    "Source excerpts must be short verbatim quotes from the document. "
    "Today's date is "
    f"{date.today().isoformat()}, use it only to judge urgency when an explicit deadline exists."
)


def handle_ai_error(exc: Exception, action_name: str = "AI analysis") -> HTTPException:
    msg = str(exc)
    msg_upper = msg.upper()
    if "429" in msg or "RESOURCE_EXHAUSTED" in msg_upper or "QUOTA" in msg_upper:
        return HTTPException(
            status_code=429,
            detail="AI service limit reached for now. Demo Mode is available.",
        )
    if "503" in msg or "UNAVAILABLE" in msg_upper or "OVERLOADED" in msg_upper:
        return HTTPException(
            status_code=503,
            detail="AI service is temporarily busy. Please try again shortly.",
        )
    if "TRANSLATION" in action_name.upper():
        return HTTPException(
            status_code=502,
            detail="Translation is temporarily unavailable. Please try again shortly.",
        )
    if "ASK" in action_name.upper():
        return HTTPException(
            status_code=502,
            detail="Ask This Notice is temporarily unavailable. Please try again shortly.",
        )
    return HTTPException(
        status_code=502,
        detail=f"{action_name} is temporarily unavailable. Please try again shortly.",
    )


def analyze_text(client, text: str) -> dict:
    try:
        response = client.models.generate_content(
            model=MODEL,
            contents=f"Analyze this campus notice:\n\n{text}",
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                response_mime_type="application/json",
                response_schema=EXTRACTION_TOOL["input_schema"],
                temperature=0.1,
            ),
        )
        return response.parsed or __import__("json").loads(response.text)
    except Exception as exc:
        raise handle_ai_error(exc, "AI analysis")


def analyze_pdf_with_vision(client, raw: bytes) -> dict:
    """Fallback for scanned/image PDFs."""

    if len(raw) > MAX_VISION_PDF_BYTES:
        raise HTTPException(
            status_code=413,
            detail="This scanned document is too large to process reliably. Try a smaller file or a text-based PDF.",
        )

    try:
        pdf_part = types.Part.from_bytes(
            data=raw,
            mime_type="application/pdf",
        )

        response = client.models.generate_content(
            model=MODEL,
            contents=[
                pdf_part,
                "This notice may be a scanned image. Read the entire document visually and analyze it. "
                "Only use information actually present in the document. "
                "If something is not stated, return null rather than guessing.",
            ],
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                response_mime_type="application/json",
                response_schema=EXTRACTION_TOOL["input_schema"],
                temperature=0.1,
            ),
        )

        return response.parsed or __import__("json").loads(response.text)

    except Exception as exc:
        raise handle_ai_error(exc, "AI analysis")

def clean_structured_fields(structured: dict) -> dict:
    """Remove schema placeholder values accidentally returned by the model."""
    placeholder_values = {
        "deadline_display_value",
        "deadline_time_value",
        "fee_value",
        "venue_value",
        "eligibility_value",
        "null",
        "none",
        "n/a",
        "not specified",
        "not mentioned",
        "not provided",
    }

    cleaned = dict(structured)

    for key in [
        "deadline_date",
        "deadline_display",
        "deadline_time",
        "deadline_source_page",
        "deadline_source_excerpt",
        "venue",
        "venue_source_page",
        "venue_source_excerpt",
        "fee",
        "fee_source_page",
        "fee_source_excerpt",
        "eligibility",
        "eligibility_source_page",
        "eligibility_source_excerpt",
    ]:
        value = cleaned.get(key)

        if isinstance(value, str) and value.strip().lower() in placeholder_values:
            cleaned[key] = None

    fee_val = cleaned.get("fee")
    if fee_val in (0, "0", 0.0, "0.0", "Rs 0", "Rs. 0", "₹0"):
        cleaned["fee"] = None

    confidence = cleaned.get("deadline_confidence")
    if not isinstance(confidence, (int, float)) or confidence <= 0:
        cleaned["deadline_confidence"] = None

    return cleaned

def to_frontend_notice(structured: dict, full_text: str) -> dict:
    structured = clean_structured_fields(structured)
    def field(value_key, page_key, excerpt_key):
        value = structured.get(value_key)
        if not value:
            return None
        return {
            "value": value,
            "source_page": structured.get(page_key),
            "source_excerpt": structured.get(excerpt_key),
        }

    deadline = None
    if structured.get("deadline_date") or structured.get("deadline_display"):
        deadline = {
            "date": structured.get("deadline_date"),
            "display_date": structured.get("deadline_display") or structured.get("deadline_date"),
            "time": structured.get("deadline_time"),
            "confidence": structured.get("deadline_confidence"),
            "source_page": structured.get("deadline_source_page"),
            "source_excerpt": structured.get("deadline_source_excerpt"),
        }

    return {
        "title": structured["title"],
        "category": structured["category"],
        "urgency": structured["urgency"],
        "deadline": deadline,
        "venue": field("venue", "venue_source_page", "venue_source_excerpt"),
        "fee": field("fee", "fee_source_page", "fee_source_excerpt"),
        "eligibility": field("eligibility", "eligibility_source_page", "eligibility_source_excerpt"),
        "summary": structured["summary"],
        "action_items": structured.get("action_items", []),
        "important_points": structured.get("important_points", []),
        "full_text": full_text,
    }


# ---------- routes ----------

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    raw = await file.read()
    if not raw:
        raise HTTPException(status_code=400, detail="The uploaded file is empty.")

    text, needs_vision = extract_text(file.filename, raw)

    client = get_client()
    if needs_vision:
        if not file.filename.lower().endswith(".pdf"):
            raise HTTPException(
                status_code=422,
                detail="This document has no readable text. Try a clearer copy.",
            )
        structured = analyze_pdf_with_vision(client, raw)
        full_text = text or "(scanned document â€” original text not extracted)"
    else:
        if len(text) < 20:
            raise HTTPException(
                status_code=422,
                detail="This document has no readable text. Try a clearer copy.",
            )
        structured = analyze_text(client, text)
        full_text = text

    notice = to_frontend_notice(structured, full_text)
    notice_id = str(uuid.uuid4())
    NOTICES[notice_id] = {
    "structured": structured,
    "full_text": full_text,
    "filename": file.filename,
    "raw": raw,
    }

    return {"notice_id": notice_id, "notice": notice}


class TranslateRequest(BaseModel):
    notice_id: str
    target_lang: str


LANG_NAMES = {
    "ta": "Tamil", "hi": "Hindi", "ml": "Malayalam",
    "te": "Telugu", "kn": "Kannada", "bn": "Bengali", "mr": "Marathi",
}

TRANSLATE_TOOL = {
    "name": "record_translation",
    "description": "Record the translated brief.",
    "input_schema": {
        "type": "object",
        "properties": {
            "summary": {"type": "string"},
            "important_points": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {"label": {"type": "string"}, "detail": {"type": "string"}},
                    "required": ["label", "detail"],
                },
            },
        },
        "required": ["summary", "important_points"],
    },
}


@app.post("/translate")
def translate(req: TranslateRequest):
    entry = NOTICES.get(req.notice_id)
    if not entry:
        raise HTTPException(
            status_code=404,
            detail="Notice not found. Upload it again.",
        )

    lang_name = LANG_NAMES.get(req.target_lang, req.target_lang)
    structured = entry["structured"]
    client = get_client()

    translation_input = {
        "summary": structured.get("summary", ""),
        "important_points": structured.get("important_points", []),
    }

    try:
        response = client.models.generate_content(
            model=MODEL,
            contents=(
                f"Translate the following campus notice brief into {lang_name}.\n"
                "Translate ALL user-facing text. Do not leave English text unchanged "
                "unless it is a proper noun, number, date, or unavoidable official name. "
                "Keep the meaning exactly the same. Do not add information.\n\n"
                f"{__import__('json').dumps(translation_input, ensure_ascii=False)}"
            ),
            config=types.GenerateContentConfig(
                system_instruction=(
                    "You are a precise multilingual translator for college notices. "
                    "Return only the requested JSON structure. "
                    "The summary and every label/detail in important_points must be translated."
                ),
                response_mime_type="application/json",
                response_schema=TRANSLATE_TOOL["input_schema"],
                temperature=0.1,
            ),
        )

        result = response.parsed or __import__("json").loads(response.text)

        if not result or not result.get("summary"):
            raise ValueError("Translation returned an empty result.")

        return result

    except Exception as exc:
        raise handle_ai_error(exc, "Translation")

class AskRequest(BaseModel):
    notice_id: str
    question: str


ASK_TOOL = {
    "name": "record_answer",
    "description": "Record the answer to a student's question about a notice.",
    "input_schema": {
        "type": "object",
        "properties": {
            "answer": {"type": "string", "description": "Brief, direct answer."},
            "answered_from_document": {
                "type": "boolean",
                "description": "False if the notice doesn't actually contain the answer.",
            },
            "source_excerpt": {
                "type": "string",
                "description": "Verbatim short quote supporting the answer, or null if not found.",
            },
        },
        "required": ["answer", "answered_from_document"],
    },
}


@app.post("/ask")
def ask(req: AskRequest):
    entry = NOTICES.get(req.notice_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Notice not found. Upload it again.")

    client = get_client()

    try:
        system_instruction = (
            "Answer the student's question using ONLY the uploaded notice. "
            "If the answer isn't in the notice, set answered_from_document to false "
            "and say so plainly rather than guessing. "
            "If you use information from the notice, provide a short verbatim "
            "source excerpt when possible."
        )

        contents = [req.question]

        # Scanned PDFs have no useful extracted text, so send the original PDF
        # to Gemini again for multimodal question answering.
        raw = entry.get("raw")
        filename = entry.get("filename", "")

        if raw and filename.lower().endswith(".pdf") and entry["full_text"].startswith(
            "(scanned document"
        ):
            contents = [
                types.Part.from_bytes(data=raw, mime_type="application/pdf"),
                req.question,
            ]
        else:
            contents = [
                f"NOTICE TEXT:\n{entry['full_text']}\n\nQUESTION:\n{req.question}"
            ]

        response = client.models.generate_content(
            model=MODEL,
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                response_mime_type="application/json",
                response_schema=ASK_TOOL["input_schema"],
                temperature=0.1,
            ),
        )

        result = response.parsed or __import__("json").loads(response.text)

        return {
            "answer": result["answer"],
            "source": result.get("source_excerpt"),
        }

    except Exception as exc:
        raise handle_ai_error(exc, "Ask")


@app.get("/health")
def health():
    return {"status": "ok"}




