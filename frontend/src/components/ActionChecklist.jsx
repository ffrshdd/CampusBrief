import { useState } from 'react'

export default function ActionChecklist({ items }) {
  const [checked, setChecked] = useState(() => new Set())

  function toggle(i) {
    setChecked((prev) => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  if (!items?.length) return null

  return (
    <div className="rounded-2xl border border-line bg-white p-6">
      <p className="font-display text-lg mb-4">What you need to do</p>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i}>
            <button
              onClick={() => toggle(i)}
              className="flex items-start gap-3 text-left w-full group"
            >
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border text-[11px]
                  ${checked.has(i) ? 'bg-accent border-accent text-white' : 'border-line group-hover:border-ink-soft'}`}
              >
                {checked.has(i) ? '✓' : ''}
              </span>
              <span className={`text-sm ${checked.has(i) ? 'text-ink-soft line-through' : 'text-ink'}`}>
                {item}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
