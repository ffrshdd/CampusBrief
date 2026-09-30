export default function SourceModal({ field, onClose }) {
  if (!field) return null

  const pageText = field.source_page ? `Page ${field.source_page}` : 'Notice excerpt'
  const confidenceText =
    field.confidence && field.confidence > 0
      ? `AI confidence ${Math.round(field.confidence * 100)}%`
      : 'AI analyzed'

  return (
    <div
      className="fixed inset-0 bg-ink/40 flex items-center justify-center p-6 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full p-6 animate-rise"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-display text-base mb-1">Evidence</p>
        <p className="text-xs text-ink-soft mb-3">
          {pageText} · {confidenceText}
        </p>
        <blockquote className="text-sm leading-relaxed border-l-2 border-accent pl-3 text-ink">
          {field.source_excerpt
            ? `"${field.source_excerpt}"`
            : 'No exact excerpt was captured for this field — check the extracted text for the surrounding context.'}
        </blockquote>
        <button
          onClick={onClose}
          className="mt-5 text-sm font-medium text-accent hover:underline underline-offset-4"
        >
          Close
        </button>
      </div>
    </div>
  )
}
