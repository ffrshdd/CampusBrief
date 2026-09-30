export function daysRemaining(isoDate) {
  if (!isoDate) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(isoDate)
  if (Number.isNaN(due.getTime())) return null
  due.setHours(0, 0, 0, 0)
  const diffMs = due - today
  return Math.round(diffMs / (1000 * 60 * 60 * 24))
}

export function urgencyLabel(days) {
  if (days === null) return { text: 'No deadline detected', tone: 'neutral' }
  if (days < 0) return { text: 'Deadline passed', tone: 'urgent' }
  if (days === 0) return { text: 'Due today', tone: 'urgent' }
  if (days <= 3) return { text: `${days} day${days === 1 ? '' : 's'} left`, tone: 'urgent' }
  if (days <= 10) return { text: `${days} days remaining`, tone: 'warn' }
  return { text: `${days} days remaining`, tone: 'good' }
}
