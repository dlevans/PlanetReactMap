import { useEffect } from 'react'

// Fixed panel on the right showing whichever booth was last clicked.
// `data` is { booth, roomId, roomLabel } or null when nothing's selected.
export default function BoothPanel({ data, onClose }) {
  useEffect(() => {
    if (!data) return
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [data, onClose])

  if (!data) return null
  const { booth, roomLabel } = data
  const hasSocials = Array.isArray(booth.socials) && booth.socials.length > 0

  return (
    <div className="booth-panel">
      <button className="booth-panel-close" onClick={onClose} aria-label="Close">×</button>

      <div className="booth-panel-eyebrow">
        {roomLabel}{booth.id ? ' · Booth ' + booth.id : ''}
      </div>
      <h3 className="booth-panel-title">{booth.label || booth.id}</h3>

      {booth.description
        ? <p className="booth-panel-desc">{booth.description}</p>
        : <p className="booth-panel-empty">No description yet.</p>}

      {hasSocials && (
        <div className="booth-panel-socials">
          {booth.socials.map((s, i) => (
            <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="booth-social-link">
              {s.platform || s.url}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
