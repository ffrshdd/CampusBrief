export default function BriefCard({ summary, points, activeLang, translating }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-6">
      <p className="font-display text-lg mb-3">
        Brief{activeLang && activeLang !== 'en' ? ` · ${activeLang}` : ''}
      </p>
      {translating ? (
        <p className="text-sm text-ink-soft italic">Translating…</p>
      ) : (
        <>
          <p className="text-sm leading-relaxed mb-4">{summary}</p>
          {points?.length > 0 && (
            <ul className="space-y-2 border-t border-line pt-4">
              {points.map((p, i) => (
                <li key={i} className="text-sm">
                  <span className="font-medium">{p.label}.</span>{' '}
                  <span className="text-ink-soft">{p.detail}</span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}
