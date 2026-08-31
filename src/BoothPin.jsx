import { useContext } from 'react'
import { ZoomContext } from './ZoomPanViewport.jsx'

// A pin shows just the booth/signage ID -- clicking it opens the full detail
// panel (name, description, image), so there's no need to also cram
// that into the pin itself or a hover tooltip.
//
// Pins live inside the same `transform: scale()` canvas as the image
// (that's what keeps them correctly positioned at any zoom level), but
// that also means their size would balloon right along with the zoom.
// We counter-scale by 1/zoom here so the badge stays a fixed, readable
// size on screen no matter how far you've zoomed in.
//
// Booths and signage: show clickable badges
// Tables and chairs: show colored blocks only, no badges, not clickable
export default function BoothPin({ booth, xPct, yPct, selected, onClick }) {
  const zoomPct = useContext(ZoomContext)
  const inverseScale = 100 / (zoomPct || 100)

  // Booths and signage: render clickable badge
  if (booth.type === 'booth' || booth.type === 'signage') {
    return (
      <div
        className={'booth-pin' + (selected ? ' selected' : '')}
        style={{
          left: xPct + '%',
          top: yPct + '%',
          transform: `translate(-50%, -50%) scale(${inverseScale})`,
        }}
        onMouseDown={e => e.stopPropagation()}
        onClick={onClick}
      >
        <span className="pin-badge">{booth.id}</span>
      </div>
    )
  }

  // Tables and chairs: render visual block, not clickable, no badge
  if (booth.type === 'table' || booth.type === 'chair') {
    const getBlockColor = () => {
      if (booth.type === 'table') return '#d4af37'  // Gold
      if (booth.type === 'chair') return '#e5e7eb'  // Light gray
      return '#9ca3af'
    }

    return (
      <div
        style={{
          position: 'absolute',
          left: xPct + '%',
          top: yPct + '%',
          transform: `translate(-50%, -50%) scale(${inverseScale})`,
          width: '20px',
          height: '20px',
          backgroundColor: getBlockColor(),
          border: '1px solid rgba(0,0,0,0.2)',
          borderRadius: '2px',
          pointerEvents: 'none',  // Not clickable
          cursor: 'default',
        }}
      />
    )
  }

  // Other item types: don't render
  return null
}