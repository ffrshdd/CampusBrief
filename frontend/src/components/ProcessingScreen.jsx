import { useEffect, useState } from 'react'

const STAGES = [
  'Reading document',
  'Finding important information',
  'Understanding requirements',
  'Preparing your brief',
]

// Purely cosmetic staged progress — the real work happens in one API call,
// but a single spinner communicates nothing about what the system is doing.
export default function ProcessingScreen() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (active >= STAGES.length - 1) return
    const t = setTimeout(() => setActive((n) => n + 1), 700)
    return () => clearTimeout(t)
  }, [active])

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="font-display text-2xl mb-8">CampusBrief</p>
        <ul className="space-y-3">
          {STAGES.map((stage, i) => (
            <li key={stage} className="flex items-center gap-3 text-sm">
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px]
                  ${i < active ? 'bg-accent border-accent text-white' : ''}
                  ${i === active ? 'border-accent text-accent' : ''}
                  ${i > active ? 'border-line text-line' : ''}`}
              >
                {i < active ? '✓' : i === active ? '●' : '○'}
              </span>
              <span className={i <= active ? 'text-ink' : 'text-ink-soft'}>{stage}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
