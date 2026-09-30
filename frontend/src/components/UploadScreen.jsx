import { useRef, useState } from 'react'
import ThemeToggle from './ThemeToggle'

export default function UploadScreen({ onFile, onDemo, error, onNavigate, theme, onToggleTheme }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) onFile(file)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 sm:px-10 py-6 flex items-center justify-between border-b border-line">
        <div className="flex items-center gap-3">
          {onNavigate ? (
            <button
              onClick={() => onNavigate('portal')}
              className="font-display text-lg tracking-tight hover:opacity-80 transition-opacity"
            >
              CampusBrief
            </button>
          ) : (
            <span className="font-display text-lg tracking-tight">CampusBrief</span>
          )}
          {onNavigate && (
            <button
              onClick={() => onNavigate('portal')}
              className="text-xs text-accent hover:underline underline-offset-4 border-l border-line pl-3 btn-hover"
            >
              ← Role Portals
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-ink-soft hidden sm:block">Algo Arena · Cipher Hack 2K26</span>
          {onToggleTheme && <ThemeToggle theme={theme} onToggle={onToggleTheme} />}
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-xl">
          <div className="animate-rise">
            <h1 className="font-display text-4xl sm:text-5xl leading-[1.1] mb-4">
              From campus notices<br />to clear action.
            </h1>
            <p className="text-ink-soft text-lg mb-10 max-w-md">
              Drop a circular. Get the deadline, the fee, the venue, and exactly
              what to do next — in the language you're comfortable with.
            </p>
          </div>

          <label
            htmlFor="file-input"
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`animate-rise block cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-colors
              ${dragging ? 'border-accent bg-accent-soft' : 'border-line bg-white hover:border-ink-soft'}`}
            style={{ animationDelay: '80ms' }}
          >
            <p className="font-display text-xl mb-1">Drop your notice here</p>
            <p className="text-sm text-ink-soft mb-4">PDF · DOCX · TXT</p>
            <span className="inline-block text-sm font-medium text-accent underline underline-offset-4">
              or browse files
            </span>
            <input
              id="file-input"
              ref={inputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
            />
          </label>

          {error && (
            <div className="animate-rise mt-4 rounded-lg bg-urgent-soft border border-urgent/20 px-4 py-3 text-sm text-urgent flex items-center justify-between gap-3">
              <span>{error}</span>
              {error.includes('Demo Mode') && (
                <button
                  type="button"
                  onClick={onDemo}
                  className="font-medium underline underline-offset-2 shrink-0 hover:opacity-80"
                >
                  Open Demo Mode
                </button>
              )}
            </div>
          )}

          <div className="animate-rise mt-6 flex items-center justify-between text-sm" style={{ animationDelay: '140ms' }}>
            <span className="text-ink-soft">Usually processed in seconds</span>
            <button
              onClick={onDemo}
              className="font-medium text-accent hover:underline underline-offset-4"
            >
              Try a sample notice
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
