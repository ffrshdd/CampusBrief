import { SUPPORTED_LANGUAGES } from '../demoData'

export default function LanguageSelector({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-ink-soft">Read in</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm font-medium border border-line rounded-lg px-3 py-1.5 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/30"
      >
        {SUPPORTED_LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>{l.label}</option>
        ))}
      </select>
    </div>
  )
}
