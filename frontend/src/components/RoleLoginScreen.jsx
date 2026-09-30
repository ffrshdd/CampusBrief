import ThemeToggle from './ThemeToggle'

export default function RoleLoginScreen({ onSelectRole, theme, onToggleTheme }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 sm:px-10 py-6 flex items-center justify-between border-b border-line">
        <div className="flex items-center gap-3">
          <span className="font-display text-lg tracking-tight">CampusBrief</span>
          <span className="text-xs text-ink-soft hidden sm:inline-block border-l border-line pl-3">
            Algo Arena · Cipher Hack 2K26
          </span>
        </div>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl animate-rise">
          <div className="text-center mb-10">
            <h1 className="font-display text-4xl sm:text-5xl leading-tight mb-3">
              Campus Notice Portal
            </h1>
            <p className="text-ink-soft text-base sm:text-lg max-w-lg mx-auto">
              Drop administrative boilerplate. Deliver clear, targeted deadlines and actions directly to students.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mb-8">
            {/* Student Login Card */}
            <div
              onClick={() => onSelectRole('student')}
              className="rounded-2xl border border-line bg-white p-6 cursor-pointer card-hover flex flex-col justify-between text-left group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-good bg-good-soft px-2.5 py-1 rounded-full">
                    Student Profile
                  </span>
                  <span className="text-xs text-ink-soft">Batch of 2027</span>
                </div>
                <h2 className="font-display text-2xl mb-1 group-hover:text-accent transition-colors">
                  Arun Kumar
                </h2>
                <p className="text-xs text-accent font-medium mb-3">2nd Year · B.Sc Computer Science</p>
                <p className="text-xs text-ink-soft leading-relaxed">
                  View circulars tailored strictly to your year and department. Never miss an exam or lab deadline.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-line flex items-center justify-between">
                <span className="text-xs font-semibold text-accent group-hover:underline underline-offset-4">
                  Open Student Feed
                </span>
                <span className="text-sm text-accent group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>

            {/* Admin Login Card */}
            <div
              onClick={() => onSelectRole('admin')}
              className="rounded-2xl border border-line bg-white p-6 cursor-pointer card-hover flex flex-col justify-between text-left group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-accent bg-accent-soft px-2.5 py-1 rounded-full">
                    Administration
                  </span>
                  <span className="text-xs text-ink-soft">Academic Cell</span>
                </div>
                <h2 className="font-display text-2xl mb-1 group-hover:text-accent transition-colors">
                  Notice Officer
                </h2>
                <p className="text-xs text-ink-soft font-medium mb-3">Dean &amp; Controller of Examinations</p>
                <p className="text-xs text-ink-soft leading-relaxed">
                  Publish campus circulars with targeted audience segmentation (All Students, 2nd Year, B.Sc CS).
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-line flex items-center justify-between">
                <span className="text-xs font-semibold text-accent group-hover:underline underline-offset-4">
                  Open Admin Dashboard
                </span>
                <span className="text-sm text-accent group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => onSelectRole('analyzer')}
              className="text-xs text-ink-soft hover:text-ink hover:underline underline-offset-4 transition-colors"
            >
              Or drop an unlisted circular directly via Instant Document Analyzer →
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
