export default function OriginalNotice({ text, onClose }) {
  return (
    <div className="fixed inset-0 bg-ink/40 flex items-center justify-center p-6 z-50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6 animate-rise"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <p className="font-display text-lg">Extracted text</p>
          <button onClick={onClose} className="text-sm text-ink-soft hover:text-ink">Close</button>
        </div>
        <p className="text-xs text-ink-soft mb-3">
          Text pulled from your uploaded document — not a rendering of the original file.
        </p>
        <pre className="text-sm whitespace-pre-wrap font-sans leading-relaxed text-ink-soft">{text}</pre>
      </div>
    </div>
  )
}
