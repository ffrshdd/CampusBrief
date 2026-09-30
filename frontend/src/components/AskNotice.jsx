import { useState } from 'react'

export default function AskNotice({ onAsk, isDemo }) {
  const [question, setQuestion] = useState('')
  const [thread, setThread] = useState([])
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    const q = question.trim()
    if (!q || loading) return
    setQuestion('')
    setThread((t) => [...t, { role: 'user', text: q }])
    setLoading(true)
    try {
      const answer = await onAsk(q)
      setThread((t) => [...t, { role: 'assistant', text: answer.answer, source: answer.source }])
    } catch (err) {
      const fallback = 'Ask This Notice is temporarily unavailable. Please try again shortly.'
      setThread((t) => [...t, { role: 'assistant', text: err?.message || fallback, error: true }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-white p-6">
      <p className="font-display text-lg mb-1">Ask about this notice</p>
      <p className="text-xs text-ink-soft mb-4">
        Answers come only from the uploaded document{isDemo ? ' (sample data)' : ''}.
      </p>

      {thread.length > 0 && (
        <div className="space-y-3 mb-4">
          {thread.map((m, i) => (
            <div key={i} className={m.role === 'user' ? 'text-sm' : 'text-sm bg-paper-dim rounded-lg p-3'}>
              {m.role === 'user' ? (
                <p className="font-medium">{m.text}</p>
              ) : (
                <>
                  <p className={m.error ? 'text-urgent' : ''}>{m.text}</p>
                  {m.source && <p className="text-xs text-accent mt-1">Evidence: {m.source}</p>}
                </>
              )}
            </div>
          ))}
          {loading && <p className="text-sm text-ink-soft italic">Thinking…</p>}
        </div>
      )}

      <form onSubmit={submit} className="flex gap-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. Can second-year students apply?"
          className="flex-1 text-sm border border-line rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
        <button
          type="submit"
          disabled={loading}
          className="text-sm font-medium bg-ink text-white rounded-lg px-4 py-2 disabled:opacity-50"
        >
          Ask
        </button>
      </form>
    </div>
  )
}
