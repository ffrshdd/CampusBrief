import { useState } from 'react'
import ThemeToggle from './ThemeToggle'
import { DEMO_STUDENT_PROFILE, matchesStudent } from '../demoData'

export default function StudentDashboard({
  circulars,
  onSelectCircular,
  onNavigate,
  theme,
  onToggleTheme,
}) {
  const [filterMode, setFilterMode] = useState('relevant') // 'relevant' | 'all'

  const relevantCirculars = circulars.filter((c) =>
    matchesStudent(c.audience, DEMO_STUDENT_PROFILE)
  )

  const displayedCirculars = filterMode === 'relevant' ? relevantCirculars : circulars

  return (
    <div className="min-h-screen pb-16">
      <header className="px-6 sm:px-10 py-5 flex items-center justify-between border-b border-line">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('portal')}
            className="font-display text-lg tracking-tight hover:opacity-80 transition-opacity"
          >
            CampusBrief
          </button>
          <span className="text-xs bg-good-soft text-good font-medium px-2.5 py-0.5 rounded-full">
            Student Feed
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('admin')}
            className="text-xs font-medium text-accent hover:underline underline-offset-4 btn-hover"
          >
            Admin View →
          </button>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 pt-8 space-y-6 animate-rise">
        {/* Student Profile Bar */}
        <div className="rounded-2xl border border-line bg-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-accent-soft text-accent flex items-center justify-center font-display text-base font-bold shrink-0">
              AK
            </div>
            <div>
              <p className="font-display text-base leading-snug">{DEMO_STUDENT_PROFILE.name}</p>
              <p className="text-xs text-ink-soft">
                {DEMO_STUDENT_PROFILE.year} · {DEMO_STUDENT_PROFILE.dept}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-line">
            <span className="text-xs text-ink-soft">Show:</span>
            <div className="flex rounded-lg border border-line p-0.5 bg-paper-dim">
              <button
                type="button"
                onClick={() => setFilterMode('relevant')}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                  filterMode === 'relevant'
                    ? 'bg-white text-ink shadow-sm'
                    : 'text-ink-soft hover:text-ink'
                }`}
              >
                Tailored ({relevantCirculars.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('all')}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                  filterMode === 'all'
                    ? 'bg-white text-ink shadow-sm'
                    : 'text-ink-soft hover:text-ink'
                }`}
              >
                All ({circulars.length})
              </button>
            </div>
          </div>
        </div>

        {/* Headline */}
        <div>
          <h1 className="font-display text-3xl">Actionable Notices</h1>
          <p className="text-xs text-ink-soft mt-1">
            {filterMode === 'relevant'
              ? `Filtered for 2nd Year B.Sc Computer Science. ${relevantCirculars.length} notice${
                  relevantCirculars.length === 1 ? '' : 's'
                } require your attention.`
              : `Showing all ${circulars.length} active campus circulars.`}
          </p>
        </div>

        {/* Notices Cards Grid */}
        <div className="space-y-4">
          {displayedCirculars.map((c) => {
            const hasDeadline = Boolean(c.notice?.deadline?.display_date)
            const urgency = c.notice?.urgency || 'medium'
            const isUrgent = urgency === 'high'

            return (
              <div
                key={c.id}
                onClick={() => onSelectCircular(c.notice)}
                className="rounded-2xl border border-line bg-white p-6 cursor-pointer card-hover group text-left flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-accent-soft text-accent">
                        {c.audience}
                      </span>
                      <span className="text-xs text-ink-soft">{c.category}</span>
                    </div>

                    {hasDeadline && (
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                          isUrgent
                            ? 'bg-urgent-soft text-urgent'
                            : 'bg-paper-dim text-ink-soft'
                        }`}
                      >
                        {c.notice.deadline.display_date}
                      </span>
                    )}
                  </div>

                  <h2 className="font-display text-xl leading-snug mb-2 group-hover:text-accent transition-colors">
                    {c.title}
                  </h2>

                  <p className="text-xs text-ink-soft line-clamp-2 leading-relaxed mb-4">
                    {c.notice?.summary || 'Tap to view structured action brief, fees, and requirements.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-line flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 text-ink-soft">
                    {c.notice?.action_items?.length > 0 && (
                      <span>✓ {c.notice.action_items.length} action steps</span>
                    )}
                    {c.notice?.fee?.value && <span>• Fee: {c.notice.fee.value}</span>}
                  </div>

                  <span className="font-semibold text-accent group-hover:underline underline-offset-4 flex items-center gap-1">
                    Read Brief <span>→</span>
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        <div className="pt-4 text-center">
          <button
            onClick={() => onNavigate('analyzer')}
            className="text-xs text-ink-soft hover:text-ink hover:underline underline-offset-4 transition-colors"
          >
            Have a circular from WhatsApp or Email? Analyze a new file directly →
          </button>
        </div>
      </main>
    </div>
  )
}
