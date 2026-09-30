import { useState } from 'react'
import DeadlineBlock from './DeadlineBlock'
import ActionChecklist from './ActionChecklist'
import KeyInfoGrid from './KeyInfoGrid'
import BriefCard from './BriefCard'
import LanguageSelector from './LanguageSelector'
import AskNotice from './AskNotice'
import SourceModal from './SourceModal'
import OriginalNotice from './OriginalNotice'
import QuickActions from './QuickActions'

import ThemeToggle from './ThemeToggle'

export default function ResultScreen({
  notice,
  isDemo,
  onTranslate,
  onAsk,
  onReset,
  onBack,
  theme,
  onToggleTheme,
}) {
  const [lang, setLang] = useState('en')
  const [translating, setTranslating] = useState(false)
  const [translateError, setTranslateError] = useState(null)
  const [summary, setSummary] = useState(notice.summary)
  const [points, setPoints] = useState(notice.important_points)
  const [sourceField, setSourceField] = useState(null)
  const [showOriginal, setShowOriginal] = useState(false)

  async function handleLangChange(code) {
    setLang(code)
    setTranslateError(null)
    if (code === 'en') {
      setSummary(notice.summary)
      setPoints(notice.important_points)
      return
    }
    setTranslating(true)
    try {
      const result = await onTranslate(code)
      setSummary(result.summary)
      setPoints(result.important_points ?? notice.important_points)
    } catch (err) {
      setTranslateError(err.message || 'Translation is temporarily unavailable. Please try again shortly.')
      setSummary(notice.summary)
      setPoints(notice.important_points)
    } finally {
      setTranslating(false)
    }
  }

  return (
    <div className="min-h-screen">
      <header className="px-6 sm:px-10 py-5 flex items-center justify-between border-b border-line">
        <div className="flex items-center gap-3">
          <button onClick={onReset} className="font-display text-lg tracking-tight hover:opacity-80">
            CampusBrief
          </button>
          {onBack && (
            <button
              onClick={onBack}
              className="text-xs text-accent hover:underline underline-offset-4 border-l border-line pl-3 btn-hover"
            >
              ← Back to Notices
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isDemo && (
            <span className="text-xs font-medium bg-accent-soft text-accent rounded-full px-3 py-1">
              Sample notice
            </span>
          )}
          {onToggleTheme && <ThemeToggle theme={theme} onToggle={onToggleTheme} />}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10 space-y-6">
        <div className="animate-rise">
          <p className="text-xs text-ink-soft mb-1">{notice.category}</p>
          <h1 className="font-display text-3xl leading-tight">{notice.title}</h1>
        </div>

        <div className="animate-rise" style={{ animationDelay: '60ms' }}>
          <DeadlineBlock deadline={notice.deadline} onViewSource={() => setSourceField(notice.deadline)} />
        </div>

        <div className="animate-rise" style={{ animationDelay: '110ms' }}>
          <ActionChecklist items={notice.action_items} />
        </div>

        <div className="animate-rise" style={{ animationDelay: '160ms' }}>
          <KeyInfoGrid
            venue={notice.venue}
            fee={notice.fee}
            eligibility={notice.eligibility}
            onViewSource={setSourceField}
          />
        </div>

        <div className="animate-rise flex justify-end" style={{ animationDelay: '190ms' }}>
          <LanguageSelector value={lang} onChange={handleLangChange} />
        </div>

        {translateError && (
          <div className="rounded-lg bg-urgent-soft border border-urgent/20 px-4 py-2.5 text-xs text-urgent flex items-center justify-between">
            <span>{translateError}</span>
            <button onClick={() => setTranslateError(null)} className="font-semibold ml-2 hover:opacity-80">✕</button>
          </div>
        )}

        <div className="animate-rise" style={{ animationDelay: '220ms' }}>
          <BriefCard summary={summary} points={points} activeLang={lang !== 'en' ? lang : null} translating={translating} />
        </div>

        <div className="animate-rise" style={{ animationDelay: '270ms' }}>
          <AskNotice onAsk={onAsk} isDemo={isDemo} />
        </div>

        <div className="animate-rise" style={{ animationDelay: '320ms' }}>
          <QuickActions notice={notice} onViewOriginal={() => setShowOriginal(true)} />
        </div>
      </main>

      <SourceModal field={sourceField} onClose={() => setSourceField(null)} />
      {showOriginal && <OriginalNotice text={notice.full_text} onClose={() => setShowOriginal(false)} />}
    </div>
  )
}
