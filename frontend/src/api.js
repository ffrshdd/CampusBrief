const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

function normalizeErrorMessage(detail, status) {
  const text = String(detail || '')
  const upper = text.toUpperCase()

  if (status === 429 || upper.includes('429') || upper.includes('RESOURCE_EXHAUSTED') || upper.includes('QUOTA')) {
    return 'AI service limit reached for now. Demo Mode is available.'
  }
  if (status === 503 || upper.includes('503') || upper.includes('UNAVAILABLE') || upper.includes('BUSY')) {
    return 'AI service is temporarily busy. Please try again shortly.'
  }
  if (upper.includes('JSON') || upper.includes('TRACEBACK') || upper.includes('SYNTAXERROR') || text.startsWith('{')) {
    return 'Service temporarily unavailable. Please try again shortly.'
  }
  return text || 'Something went wrong while processing that notice.'
}

async function handle(res) {
  if (!res.ok) {
    let detail = ''
    try {
      const body = await res.json()
      detail = body.detail || ''
    } catch {
      // response wasn't JSON
    }
    throw new Error(normalizeErrorMessage(detail, res.status))
  }
  return res.json()
}

export async function analyzeNotice(file) {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(`${API_BASE}/analyze`, { method: 'POST', body: form })
  return handle(res)
}

export async function translateBrief(noticeId, targetLang) {
  const res = await fetch(`${API_BASE}/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ notice_id: noticeId, target_lang: targetLang }),
  })
  return handle(res)
}

export async function askNotice(noticeId, question) {
  const res = await fetch(`${API_BASE}/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ notice_id: noticeId, question }),
  })
  return handle(res)
}
