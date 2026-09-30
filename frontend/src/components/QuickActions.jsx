import { useState } from 'react'

function buildIcs(notice) {
  const dt = notice.deadline?.date?.replace(/-/g, '') || ''
  const uid = `campusbrief-${Date.now()}@algoarena`
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTART;VALUE=DATE:${dt}`,
    `SUMMARY:${notice.title}`,
    `DESCRIPTION:${notice.summary?.replace(/\n/g, '\\n') || ''}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

export default function QuickActions({ notice, onViewOriginal }) {
  const [copied, setCopied] = useState(false)
  const [calendarAdded, setCalendarAdded] = useState(false)

  function addToCalendar() {
    const blob = new Blob([buildIcs(notice)], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${notice.title.replace(/\s+/g, '_')}.ics`
    a.click()
    URL.revokeObjectURL(url)

    setCalendarAdded(true)
    setTimeout(() => setCalendarAdded(false), 2200)
  }

  function copyActions() {
    const text = notice.action_items?.map((a) => `• ${a}`).join('\n') || ''
    navigator.clipboard?.writeText(text)

    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={addToCalendar}
        className="text-sm font-medium border border-line rounded-lg px-4 py-2 hover:border-ink-soft btn-hover cursor-pointer"
      >
        {calendarAdded ? '✓ Added to calendar' : 'Add to calendar'}
      </button>
      <button
        onClick={copyActions}
        className="text-sm font-medium border border-line rounded-lg px-4 py-2 hover:border-ink-soft btn-hover cursor-pointer"
      >
        {copied ? '✓ Copied!' : 'Copy action items'}
      </button>
      <button
        onClick={onViewOriginal}
        className="text-sm font-medium border border-line rounded-lg px-4 py-2 hover:border-ink-soft btn-hover cursor-pointer"
      >
        View extracted text
      </button>
    </div>
  )
}
