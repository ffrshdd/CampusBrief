export default function KeyInfoGrid({ venue, fee, eligibility, onViewSource }) {
  const rows = [
    { label: 'Venue', field: venue },
    { label: 'Fee', field: fee },
    { label: 'Eligibility', field: eligibility },
  ]

  return (
    <div className="rounded-2xl border border-line bg-white p-6">
      <p className="font-display text-lg mb-4">Key information</p>
      <dl className="divide-y divide-line">
        {rows.map((row) => {
          const hasValue = Boolean(row.field && row.field.value)
          return (
            <div key={row.label} className="py-3 flex items-start justify-between gap-4 first:pt-0 last:pb-0">
              <dt className="text-sm text-ink-soft shrink-0 w-28">{row.label}</dt>
              <dd className="text-sm text-right flex-1">
                {hasValue ? (
                  <>
                    <span>{row.field.value}</span>
                    {row.field.source_excerpt && (
                      <button
                        onClick={() => onViewSource(row.field)}
                        className="block text-xs text-accent hover:underline underline-offset-4 mt-0.5 ml-auto"
                      >
                        {row.field.source_page ? `Page ${row.field.source_page} · ` : ''}View evidence
                      </button>
                    )}
                  </>
                ) : (
                  <span className="text-ink-soft italic">Not specified</span>
                )}
              </dd>
            </div>
          )
        })}
      </dl>
    </div>
  )
}
