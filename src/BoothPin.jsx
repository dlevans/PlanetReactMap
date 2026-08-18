import { useContext } from 'react'
import { ZoomContext } from './ZoomPanViewport.jsx'

// A pin shows just the booth number -- clicking it opens the full detail
// panel (name, description, socials), so there's no need to also cram
// that into the pin itself or a hover tooltip.
//
// Pins live inside the same `transform: scale()` canvas as the image
// (that's what keeps them correctly positioned at any zoom level), but
// that also means their size would balloon right along with the zoom.
// We counter-scale by 1/zoom here so the badge stays a fixed, readable
// size on screen no matter how far you've zoomed in.
export default function BoothPin({ booth, xPct, yPct, selected, onClick }) {
  const zoomPct = useContext(ZoomContext)
  const inverseScale = 100 / (zoomPct || 100)

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
