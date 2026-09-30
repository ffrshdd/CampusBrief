export default function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      onClick={onToggle}
      type="button"
      title={theme === 'dark' ? 'Switch to Paper (Light) theme' : 'Switch to Dark theme'}
      className="text-xs font-medium px-2.5 py-1 rounded-full border border-line bg-paper-dim hover:border-ink-soft transition-colors flex items-center gap-1.5 cursor-pointer btn-hover"
    >
      <span className="text-xs">{theme === 'dark' ? '🌙' : '☀️'}</span>
      <span className="capitalize text-ink-soft">{theme === 'dark' ? 'Dark' : 'Paper'}</span>
    </button>
  )
}
