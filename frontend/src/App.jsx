import { useEffect, useState } from 'react'
import UploadScreen from './components/UploadScreen'
import ProcessingScreen from './components/ProcessingScreen'
import ResultScreen from './components/ResultScreen'
import RoleLoginScreen from './components/RoleLoginScreen'
import AdminDashboard from './components/AdminDashboard'
import StudentDashboard from './components/StudentDashboard'
import {
  DEMO_NOTICE,
  DEMO_TRANSLATIONS,
  DEMO_TRANSLATED_POINTS,
  DEMO_DEADLINE_DISPLAY,
  INITIAL_CIRCULARS,
} from './demoData'
import { analyzeNotice, translateBrief, askNotice } from './api'

export default function App() {
  const [view, setView] = useState('portal') // 'portal' | 'student' | 'admin' | 'analyzer'
  const [returnView, setReturnView] = useState('portal')
  const [stage, setStage] = useState('idle') // 'idle' | 'processing' | 'result'
  const [notice, setNotice] = useState(null)
  const [noticeId, setNoticeId] = useState(null)
  const [isDemo, setIsDemo] = useState(false)
  const [error, setError] = useState(null)
  const [circulars, setCirculars] = useState(() => INITIAL_CIRCULARS)

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('campusbrief_theme') || 'light'
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('campusbrief_theme', theme)
  }, [theme])

  function toggleTheme() {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  function reset() {
    setStage('idle')
    setNotice(null)
    setNoticeId(null)
    setIsDemo(false)
    setError(null)
  }

  function handleBackToDashboard() {
    reset()
    setView(returnView || 'student')
  }

  async function handleFile(file) {
    setError(null)
    setIsDemo(false)
    setReturnView('analyzer')
    setStage('processing')
    try {
      const result = await analyzeNotice(file)
      setNotice(result.notice)
      setNoticeId(result.notice_id)
      setStage('result')
    } catch (err) {
      setError(err.message || 'Could not process that file. Try a clearer copy or a different format.')
      setStage('idle')
    }
  }

  function handleDemo() {
    setError(null)
    setIsDemo(true)
    setReturnView('analyzer')
    setStage('processing')
    setTimeout(() => {
      setNotice(DEMO_NOTICE)
      setNoticeId('demo')
      setStage('result')
    }, 1800)
  }

  function handleSelectCircular(selectedNotice) {
    setError(null)
    setIsDemo(true)
    setReturnView(view)
    setNotice(selectedNotice)
    setNoticeId('demo')
    setStage('result')
  }

  function handlePublishCircular(newCircular) {
    setCirculars((prev) => [newCircular, ...prev])
  }

  async function handleTranslate(langCode) {
    if (isDemo) {
      return {
        summary: DEMO_TRANSLATIONS[langCode] || notice.summary,
        important_points: DEMO_TRANSLATED_POINTS[langCode] || notice.important_points,
      }
    }
    return translateBrief(noticeId, langCode)
  }

  async function handleAsk(question) {
    if (isDemo) {
      const q = question.toLowerCase()
      if (
        q.includes('fee') ||
        q.includes('cost') ||
        q.includes('pay') ||
        q.includes('price') ||
        q.includes('amount') ||
        q.includes('money') ||
        q.includes('₹') ||
        q.includes('rs')
      ) {
        return {
          answer: notice.fee?.value
            ? `The fee is ${notice.fee.value}.`
            : 'No fee is specified in this circular.',
          source: notice.fee?.source_excerpt || 'Fee details from circular',
        }
      }
      if (
        q.includes('deadline') ||
        q.includes('date') ||
        q.includes('last') ||
        q.includes('when') ||
        q.includes('time')
      ) {
        return {
          answer: notice.deadline?.display_date
            ? `The deadline is ${notice.deadline.display_date}${
                notice.deadline.time ? ` at ${notice.deadline.time}` : ''
              }.`
            : 'No deadline was found in this notice.',
          source: notice.deadline?.source_excerpt || 'Deadline details from circular',
        }
      }
      if (
        q.includes('where') ||
        q.includes('venue') ||
        q.includes('room') ||
        q.includes('office') ||
        q.includes('block') ||
        q.includes('submit') ||
        q.includes('place')
      ) {
        return {
          answer: notice.venue?.value
            ? `Location / Venue: ${notice.venue.value}.`
            : 'Venue not specified in this circular.',
          source: notice.venue?.source_excerpt || 'Venue details from circular',
        }
      }
      if (
        q.includes('who') ||
        q.includes('eligible') ||
        q.includes('year') ||
        q.includes('student') ||
        q.includes('criteria') ||
        q.includes('apply')
      ) {
        return {
          answer: notice.eligibility?.value
            ? `Eligibility: ${notice.eligibility.value}.`
            : 'Eligibility criteria not specified in this circular.',
          source: notice.eligibility?.source_excerpt || 'Eligibility details from circular',
        }
      }
      return {
        answer: notice.summary || 'Answer grounded in circular contents.',
        source: notice.title || 'Official Campus Notice',
      }
    }
    return askNotice(noticeId, question)
  }

  // Active view router
  if (stage === 'processing') return <ProcessingScreen />

  if (stage === 'result' && notice) {
    return (
      <ResultScreen
        notice={notice}
        isDemo={isDemo}
        onTranslate={handleTranslate}
        onAsk={handleAsk}
        onReset={reset}
        onBack={handleBackToDashboard}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    )
  }

  if (view === 'student') {
    return (
      <StudentDashboard
        circulars={circulars}
        onSelectCircular={handleSelectCircular}
        onNavigate={setView}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    )
  }

  if (view === 'admin') {
    return (
      <AdminDashboard
        circulars={circulars}
        onPublish={handlePublishCircular}
        onSelectCircular={handleSelectCircular}
        onNavigate={setView}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    )
  }

  if (view === 'analyzer') {
    return (
      <UploadScreen
        onFile={handleFile}
        onDemo={handleDemo}
        error={error}
        onNavigate={setView}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    )
  }

  // Default: Landing / Role Login Screen
  return (
    <RoleLoginScreen
      onSelectRole={setView}
      theme={theme}
      onToggleTheme={toggleTheme}
    />
  )
}
