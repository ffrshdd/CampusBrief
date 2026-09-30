import { daysRemaining, urgencyLabel } from '../deadline'

const TONE_STYLES = {
  urgent: 'text-urgent',
  warn: 'text-[#9A6B1E]',
  good: 'text-good',
  neutral: 'text-ink-soft',
}

export default function DeadlineBlock({ deadline, onViewSource }) {
  if (!deadline) {
    return (
      <div className="rounded-2xl border border-line bg-white p-6">
        <p className="text-sm text-ink-soft">No deadline was found in this notice.</p>
      </div>
    )
  }

  const days = daysRemaining(deadline.date)
  const urgency = urgencyLabel(days)

  return (
    <div className="rounded-2xl border border-line bg-white p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="h-2 w-2 rounded-full bg-urgent" />
        <span className="text-xs font-semibold tracking-wide text-urgent">ACTION REQUIRED</span>
      </div>

      <p className="text-sm text-ink-soft mb-1">Deadline</p>
      <p className="font-display text-5xl sm:text-6xl leading-none mb-2">{deadline.display_date}</p>
      {deadline.time && <p className="text-sm text-ink-soft mb-3">{deadline.time}</p>}

      <p className={`text-sm font-medium ${TONE_STYLES[urgency.tone]}`}>{urgency.text}</p>

      {deadline.source_excerpt && (
        <button
          onClick={onViewSource}
          className="mt-4 text-xs text-accent hover:underline underline-offset-4"
        >
          {deadline.source_page ? `Detected on page ${deadline.source_page} · ` : 'Detected in notice · '}
          {deadline.confidence && deadline.confidence > 0
            ? `AI confidence ${Math.round(deadline.confidence * 100)}%`
            : 'AI analyzed'}{' '}
          · View evidence
        </button>
      )}
    </div>
  )
}
