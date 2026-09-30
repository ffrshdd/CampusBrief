# CampusBrief

> **Read less. Miss less. Act faster.**

From campus circulars to clear, actionable decisions.
Built by **Team Algo Arena** for **Cipher Hack 2K26**.

---

## 🎯 The Problem & Our Approach

Campus notices aren't difficult because they're long — they're difficult because critical information is buried under administrative boilerplate.

CampusBrief doesn't just summarize; it understands what a notice means for the student:
```text
Document → Understanding → Decision → Action
```
Drop a circular and immediately get:
- **The Deadline** (prominent, with countdown and urgency indicator)
- **Action Checklist** (interactive, step-by-step tasks)
- **Key Information** (Fee, Venue, Eligibility — with direct evidence excerpts)
- **Multilingual Brief** (read in Tamil, Hindi, Malayalam, Telugu, Kannada, or English)
- **Ask This Notice** (grounded Q&A against the document with evidence verification)
- **Calendar Export & Action Copy** (one-click `.ics` and clipboard export)

---

## ⚡ Tech Stack

- **Frontend**: React 19, Tailwind CSS v4, Vite
- **Backend**: FastAPI, Python 3.13, Uvicorn
- **AI Core**: **Google Gemini Developer API** (`gemini-3.6-flash`) via `google-genai`
- **Document Processing**:
  - `pdfplumber` (native digital PDFs)
  - `python-docx` (DOCX documents)
  - UTF-8 decoding (TXT files)
  - **Gemini Multimodal Vision** (automatic fallback for scanned/image PDFs)
- **Demo Mode**: 100% offline sample notice and intelligent Q&A for guaranteed presentation reliability.

---

## 🚀 Getting Started

### 1. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
# source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
copy .env.example .env   # On macOS/Linux: cp .env.example .env
# Add your GEMINI_API_KEY in .env

# Run FastAPI server
uvicorn main:app --reload --port 8000
```

Backend health check: `http://127.0.0.1:8000/health` → `{"status": "ok"}`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies (on Windows PowerShell, use npm.cmd if npm.ps1 is restricted)
npm install
# or: npm.cmd install

# Start development server
npm run dev
# or: npm.cmd run dev
```

Open `http://localhost:5173/` in your browser.

> **Tip for Judges & Presentations**: Click **"Try a sample notice"** on the upload screen to run in **Demo Mode**. It simulates the complete end-to-end pipeline with zero external network or quota dependencies.

---

## 🏛️ Pipeline Architecture

```text
Document (PDF / DOCX / TXT)
       │
       ▼
Extract text (pdfplumber / python-docx / utf-8)
       │
   Text long enough?
   ├── YES ──► Send structured extraction prompt to Gemini (gemini-3.6-flash)
   └── NO  ──► Multimodal vision fallback (raw PDF pages sent directly to Gemini)
       │
       ▼
Clean & normalize schema fields (strip placeholders, enforce strict deadlines)
       │
       ▼
Return structured JSON:
   • Deadline, display date & countdown
   • Action checklist
   • Venue, Fee, Eligibility + Evidence quotes & page numbers
   • Plain-language summary & important points
       │
       ├──► /translate (multilingual regional language localization)
       └──► /ask (grounded document Q&A with evidence citation)
```

---

## 🛡️ Hackathon Reliability & Architecture Decisions

- **In-Memory Store**: Notices are stored in memory (`NOTICES` dict) during the session. Deliberate hackathon-scope design — no external database setup required.
- **Strict Grounding**: System prompts explicitly prevent hallucinating commencement/event dates as deadlines, and enforce "Not specified" when fees or venues are absent.
- **Graceful Degradation**: Clear, polite notifications on rate limits (429) or transient provider outages (503), with immediate one-click access to Demo Mode.
- **Offline Demo Mode**: Self-contained sample dataset with instant multilingual translations and context-aware Q&A that survives Wi-Fi or API quota limits.

---

## 👥 Team

**Algo Arena** — Cipher Hack 2K26
- Submission Date: September 11, 2026
