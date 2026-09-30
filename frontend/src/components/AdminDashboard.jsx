import { useState } from 'react'
import ThemeToggle from './ThemeToggle'
import { AUDIENCE_OPTIONS } from '../demoData'

export default function AdminDashboard({
  circulars,
  onPublish,
  onSelectCircular,
  onNavigate,
  theme,
  onToggleTheme,
}) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Academic')
  const [audience, setAudience] = useState('2nd Year B.Sc CS')
  const [deadlineDisplay, setDeadlineDisplay] = useState('25 Sep 2026')
  const [deadlineTime, setDeadlineTime] = useState('05:00 PM')
  const [venue, setVenue] = useState('Lab 201, CS Department')
  const [fee, setFee] = useState('')
  const [eligibility, setEligibility] = useState('2nd Year B.Sc CS students')
  const [summary, setSummary] = useState('')
  const [actionItemInput, setActionItemInput] = useState('')
  const [actionItems, setActionItems] = useState([
    'Register on the departmental portal',
    'Submit project proposal to course faculty',
  ])
  const [publishing, setPublishing] = useState(false)
  const [publishFeedback, setPublishFeedback] = useState(null)

  function handleFillSample() {
    setTitle('Special Seminar on High-Performance Graph Analytics')
    setCategory('Academic')
    setAudience('2nd Year B.Sc CS')
    setDeadlineDisplay('22 Sep 2026')
    setDeadlineTime('04:30 PM')
    setVenue('Seminar Hall B, Block 3')
    setFee('Free')
    setEligibility('2nd Year B.Sc Computer Science')
    setSummary('A specialized lecture by visiting scientists on graph algorithms and parallel architectures. Attendance is mandatory for all 2nd year B.Sc CS students.')
    setActionItems([
      'Sign up via the departmental register by Sep 20',
      'Review Graph Theory Chapter 4 before the session',
      'Report to Seminar Hall B by 4:15 PM sharp',
    ])
  }

  function handleAddActionItem(e) {
    e.preventDefault()
    if (!actionItemInput.trim()) return
    setActionItems((prev) => [...prev, actionItemInput.trim()])
    setActionItemInput('')
  }

  function handleRemoveActionItem(idx) {
    setActionItems((prev) => prev.filter((_, i) => i !== idx))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return

    setPublishing(true)
    // Micro-interaction delay
    await new Promise((r) => setTimeout(r, 600))

    const newCircular = {
      id: `circ-${Date.now()}`,
      audience,
      title: title.trim(),
      category,
      postedAt: 'Just now',
      notice: {
        filename: `${title.replace(/\s+/g, '_')}.pdf`,
        title: title.trim(),
        category,
        urgency: 'medium',
        deadline: deadlineDisplay.trim()
          ? {
              date: '2026-09-22',
              display_date: deadlineDisplay.trim(),
              time: deadlineTime.trim() || '11:59 PM',
              confidence: 0.94,
              source_page: 1,
              source_excerpt: `Official submission deadline: ${deadlineDisplay.trim()} at ${deadlineTime.trim() || '11:59 PM'}.`,
            }
          : null,
        venue: venue.trim()
          ? { value: venue.trim(), source_page: 1, source_excerpt: `Location: ${venue.trim()}.` }
          : null,
        fee: fee.trim()
          ? { value: fee.trim(), source_page: 1, source_excerpt: `Fee: ${fee.trim()}.` }
          : null,
        eligibility: eligibility.trim()
          ? { value: eligibility.trim(), source_page: 1, source_excerpt: `Eligibility: ${eligibility.trim()}.` }
          : null,
        summary:
          summary.trim() ||
          `Official departmental circular regarding ${title.trim()} published for ${audience}.`,
        action_items:
          actionItems.length > 0
            ? actionItems
            : ['Check requirements and adhere to specified timeline'],
        important_points: [
          { label: 'Target Audience', detail: audience },
          { label: 'Published By', detail: 'Office of Departmental Administration' },
        ],
        full_text: `CIRCULAR: ${title.toUpperCase()}\nTarget Audience: ${audience}\nCategory: ${category}\n\n${summary || title}`,
      },
    }

    onPublish(newCircular)
    setPublishing(false)
    setPublishFeedback('Circular published successfully! It is now visible in the Student Feed.')

    // Reset fields
    setTitle('')
    setSummary('')
    setTimeout(() => setPublishFeedback(null), 4000)
  }

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
          <span className="text-xs bg-accent-soft text-accent font-medium px-2.5 py-0.5 rounded-full">
            Admin Portal
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('student')}
            className="text-xs font-medium text-accent hover:underline underline-offset-4 btn-hover"
          >
            Switch to Student Feed →
          </button>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pt-8 space-y-8 animate-rise">
        {/* Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-line">
          <div>
            <h1 className="font-display text-3xl">Notice Administration</h1>
            <p className="text-xs text-ink-soft mt-1">
              Publish structured campus circulars with targeted student segmentation.
            </p>
          </div>
          <button
            type="button"
            onClick={handleFillSample}
            className="text-xs font-medium border border-line bg-paper-dim px-3 py-1.5 rounded-lg hover:border-ink-soft transition-colors self-start sm:self-auto btn-hover"
          >
            ⚡ Auto-Fill Sample Circular
          </button>
        </div>

        {publishFeedback && (
          <div className="rounded-xl bg-good-soft border border-good/20 p-4 text-xs font-medium text-good flex items-center justify-between animate-rise">
            <span>✓ {publishFeedback}</span>
            <button
              onClick={() => onNavigate('student')}
              className="underline underline-offset-2 ml-4 hover:opacity-80"
            >
              View in Student Feed →
            </button>
          </div>
        )}

        {/* Publish Form Card */}
        <div className="rounded-2xl border border-line bg-white p-6 sm:p-8">
          <h2 className="font-display text-xl mb-4">Post a New Circular</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">
                Notice Title *
              </label>
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Schedule for Phase-1 Mini-Project Review"
                className="w-full text-sm border border-line rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>

            {/* Audience Selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">
                Target Audience (Segmentation) *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {AUDIENCE_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setAudience(opt)}
                    className={`text-xs py-2 px-3 rounded-lg border text-center font-medium transition-all cursor-pointer btn-hover
                      ${audience === opt
                        ? 'border-accent bg-accent text-white shadow-sm'
                        : 'border-line bg-paper-dim hover:border-ink-soft text-ink'
                      }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Category & Deadline */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-sm border border-line rounded-lg px-3 py-2 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/30"
                >
                  <option value="Academic">Academic</option>
                  <option value="Examination">Examination</option>
                  <option value="Fees">Fees</option>
                  <option value="Event">Event</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">
                  Deadline Date
                </label>
                <input
                  value={deadlineDisplay}
                  onChange={(e) => setDeadlineDisplay(e.target.value)}
                  placeholder="e.g. 20 Sep 2026"
                  className="w-full text-sm border border-line rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">
                  Deadline Time
                </label>
                <input
                  value={deadlineTime}
                  onChange={(e) => setDeadlineTime(e.target.value)}
                  placeholder="e.g. 05:00 PM"
                  className="w-full text-sm border border-line rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/30"
                />
              </div>
            </div>

            {/* Venue, Fee, Eligibility */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">
                  Venue / Location
                </label>
                <input
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="e.g. Room 302, Block B"
                  className="w-full text-sm border border-line rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/30"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">
                  Fee (if any)
                </label>
                <input
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  placeholder="e.g. ₹500 or Free"
                  className="w-full text-sm border border-line rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/30"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">
                  Eligibility
                </label>
                <input
                  value={eligibility}
                  onChange={(e) => setEligibility(e.target.value)}
                  placeholder="e.g. 2nd Year Students"
                  className="w-full text-sm border border-line rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/30"
                />
              </div>
            </div>

            {/* Plain Summary */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">
                Plain-Language Brief / Summary
              </label>
              <textarea
                rows={2}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="2-3 sentence overview of what students need to understand."
                className="w-full text-sm border border-line rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent/30 leading-relaxed"
              />
            </div>

            {/* Action Checklist */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">
                Action Checklist
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  value={actionItemInput}
                  onChange={(e) => setActionItemInput(e.target.value)}
                  placeholder="Add an actionable step for students..."
                  className="flex-1 text-sm border border-line rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-accent/30"
                />
                <button
                  type="button"
                  onClick={handleAddActionItem}
                  className="text-xs font-medium border border-line rounded-lg px-3 py-1.5 hover:border-ink-soft btn-hover"
                >
                  + Add
                </button>
              </div>

              {actionItems.length > 0 && (
                <ul className="space-y-1.5 mt-2">
                  {actionItems.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-xs flex items-center justify-between bg-paper-dim rounded-md px-2.5 py-1.5"
                    >
                      <span className="text-ink truncate mr-2">• {item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveActionItem(idx)}
                        className="text-urgent hover:opacity-80 text-xs px-1"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={publishing}
                className="w-full sm:w-auto text-sm font-semibold bg-ink text-white rounded-lg px-6 py-2.5 disabled:opacity-50 btn-hover"
              >
                {publishing ? 'Publishing Circular…' : 'Publish Circular →'}
              </button>
            </div>
          </form>
        </div>

        {/* Existing Published Notices List */}
        <div>
          <h2 className="font-display text-xl mb-3">Published Circulars ({circulars.length})</h2>
          <div className="space-y-3">
            {circulars.map((c) => (
              <div
                key={c.id}
                onClick={() => onSelectCircular(c.notice)}
                className="rounded-xl border border-line bg-white p-4 cursor-pointer card-hover flex items-center justify-between gap-4 group"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded bg-accent-soft text-accent">
                      {c.audience}
                    </span>
                    <span className="text-[11px] text-ink-soft">{c.category}</span>
                    <span className="text-[11px] text-ink-soft">· {c.postedAt}</span>
                  </div>
                  <h3 className="font-display text-base truncate group-hover:text-accent transition-colors">
                    {c.title}
                  </h3>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <span className="text-xs text-ink-soft group-hover:text-accent group-hover:underline underline-offset-4">
                    View Brief →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
