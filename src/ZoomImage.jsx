import { useEffect, useRef, useState } from 'react'

const BASE_HEIGHT = 400 // fallback "fit" height for gallery cards that don't specify a width
const MIN_ZOOM = 50
const MAX_ZOOM = 400
const ZOOM_STEP = 25

// Real zoom + pan, replacing the old hover-magnifier. The image and the
// booth-pin overlay live inside the same scaled canvas, so pins always
// track the image correctly at any zoom level -- no separate lens/background
// sync required, which is what made pins invisible in the magnifier before.
//
// `initialWidth` lets callers (like the Great Hall puzzle grid) pin the
// unzoomed size to an exact pixel width so tiled cells still line up;
// omit it to fall back to a fixed-height "fit" card (used by the Bartle
// Hall strip).
export default function ZoomImage({ src, alt = '', booths, imageWidth, imageHeight, initialWidth }) {
  const viewportRef = useRef(null)
  const [naturalSize, setNaturalSize] = useState(null)
  const [zoomPct, setZoomPct] = useState(100)
  const dragState = useRef(null)

  useEffect(() => {
    setZoomPct(100)
    if (viewportRef.current) { viewportRef.current.scrollLeft = 0; viewportRef.current.scrollTop = 0 }
  }, [src])

  function handleImgLoad(e) {
    setNaturalSize({ w: e.target.naturalWidth, h: e.target.naturalHeight })
  }

  const aspect = naturalSize ? naturalSize.w / naturalSize.h : 1
  const baseWidth = initialWidth || (BASE_HEIGHT * aspect)
  const baseHeight = initialWidth ? (initialWidth / aspect) : BASE_HEIGHT
  const dispWidth = baseWidth * zoomPct / 100
  const dispHeight = baseHeight * zoomPct / 100

  function startDrag(e) {
    const vp = viewportRef.current
    dragState.current = { startX: e.clientX, startY: e.clientY, left: vp.scrollLeft, top: vp.scrollTop }
    vp.classList.add('dragging')
    window.addEventListener('mousemove', onDrag)
    window.addEventListener('mouseup', endDrag)
  }
  function onDrag(e) {
    if (!dragState.current) return
    const vp = viewportRef.current
    vp.scrollLeft = dragState.current.left - (e.clientX - dragState.current.startX)
    vp.scrollTop = dragState.current.top - (e.clientY - dragState.current.startY)
  }
  function endDrag() {
    dragState.current = null
    viewportRef.current?.classList.remove('dragging')
    window.removeEventListener('mousemove', onDrag)
    window.removeEventListener('mouseup', endDrag)
  }

  const hasPins = Array.isArray(booths) && booths.length > 0 && imageWidth && imageHeight

  return (
    <div className="zoom-widget">
      <div
        className="zoom-viewport"
        ref={viewportRef}
        style={{ width: baseWidth + 'px', height: baseHeight + 'px' }}
        onMouseDown={startDrag}
      >
        <div className="zoom-canvas" style={{ width: dispWidth + 'px', height: dispHeight + 'px' }}>
          <img className="zoom-img" src={src} alt={alt} onLoad={handleImgLoad} draggable={false} />
          {hasPins && (
            <div className="pins-overlay">
              {booths.map(booth => (
                <div
                  key={booth.id}
                  className="booth-pin"
                  style={{ left: (booth.x / imageWidth * 100) + '%', top: (booth.y / imageHeight * 100) + '%' }}
                  onMouseDown={e => e.stopPropagation()}
                >
                  <span className="pin-num">{booth.id}</span>
                  <span className="pin-tag">{booth.id}{booth.label ? ' — ' + booth.label : ''}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="zoom-controls">
        <button type="button" onClick={() => setZoomPct(z => Math.max(MIN_ZOOM, z - ZOOM_STEP))}>−</button>
        <input
          type="range" min={MIN_ZOOM} max={MAX_ZOOM} step={ZOOM_STEP}
          value={zoomPct} onChange={e => setZoomPct(Number(e.target.value))}
        />
        <button type="button" onClick={() => setZoomPct(z => Math.min(MAX_ZOOM, z + ZOOM_STEP))}>+</button>
        <span className="zoom-pct">{zoomPct}%</span>
        <button type="button" className="zoom-reset" onClick={() => {
          setZoomPct(100)
          if (viewportRef.current) { viewportRef.current.scrollLeft = 0; viewportRef.current.scrollTop = 0 }
        }}>Reset</button>
      </div>
    </div>
  )
}
