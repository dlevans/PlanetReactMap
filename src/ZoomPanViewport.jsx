import { createContext, useEffect, useLayoutEffect, useRef, useState } from 'react'

const MIN_ZOOM = 50
const MAX_ZOOM = 400
const ZOOM_STEP = 25
const DOUBLE_CLICK_STEP = 100   // how far each double-click zooms in

// Lets anything nested inside the scaled canvas (like booth pins) read the
// current zoom percentage, so it can counter-scale itself back to a fixed
// on-screen size instead of ballooning along with the zoomed image.
export const ZoomContext = createContext(100)

// Wraps arbitrary content (an image strip, a puzzle grid, whatever) in a
// single shared zoom + pan surface. Content is laid out at its NATURAL
// size using ordinary CSS (flex row / CSS grid) -- exactly like the
// original pre-React version -- so images stitch together edge-to-edge
// correctly. Zooming is one `transform: scale()` on the whole assembled
// canvas, so every image (and every booth pin nested inside it) scales
// and pans together as a single rigid unit; nothing can drift out of
// alignment relative to anything else.
//
// Zoom controls: +/- buttons, a slider, Ctrl/Cmd+scroll wheel, and
// pinch-to-zoom on touch devices. Panning: click-drag, or one-finger
// touch-drag.
export default function ZoomPanViewport({ children }) {
  const viewportRef = useRef(null)
  const canvasRef = useRef(null)
  const [zoomPct, setZoomPct] = useState(100)
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 })
  const dragState = useRef(null)
  const pinchState = useRef(null)
  const pendingScroll = useRef(null)

  function clamp(z) { return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z)) }

  // Applies a scroll position queued by zoomAt() once the DOM has actually
  // resized for the new zoomPct -- setting scrollLeft/Top before that would
  // just get clamped back by the browser since the scrollable area is still
  // the old (smaller) size at that point.
  useLayoutEffect(() => {
    if (pendingScroll.current && viewportRef.current) {
      viewportRef.current.scrollLeft = pendingScroll.current.left
      viewportRef.current.scrollTop = pendingScroll.current.top
      pendingScroll.current = null
    }
  }, [zoomPct])

  // Set up non-passive wheel and touch listeners once on mount
  // (React's synthetic events default to passive for perf, but we need to prevent defaults)
  useEffect(() => {
    const vp = viewportRef.current
    if (!vp) return

    function onWheelEvent(e) {
      if (!e.ctrlKey && !e.metaKey) return
      e.preventDefault()
      setZoomPct(z => clamp(z - Math.sign(e.deltaY) * ZOOM_STEP))
    }

    function onTouchMoveEvent(e) {
      if (e.touches.length === 2 && pinchState.current) {
        e.preventDefault()
        const ratio = touchDist(e.touches) / pinchState.current.dist
        setZoomPct(clamp(pinchState.current.zoom * ratio))
      } else if (e.touches.length === 1 && dragState.current) {
        e.preventDefault()
        const t = e.touches[0]
        const vp = viewportRef.current
        vp.scrollLeft = dragState.current.left - (t.clientX - dragState.current.x)
        vp.scrollTop = dragState.current.top - (t.clientY - dragState.current.y)
      }
    }

    vp.addEventListener('wheel', onWheelEvent, { passive: false })
    vp.addEventListener('touchmove', onTouchMoveEvent, { passive: false })
    return () => {
      vp.removeEventListener('wheel', onWheelEvent)
      vp.removeEventListener('touchmove', onTouchMoveEvent)
    }
  }, [])

  // Zooms to newZoom while keeping the content under (viewportX, viewportY)
  // -- coordinates relative to the viewport's own box -- stationary on screen.
  function zoomAt(newZoom, viewportX, viewportY) {
    const vp = viewportRef.current
    const oldScale = zoomPct / 100
    const naturalX = (vp.scrollLeft + viewportX) / oldScale
    const naturalY = (vp.scrollTop + viewportY) / oldScale
    const newScale = newZoom / 100
    pendingScroll.current = {
      left: naturalX * newScale - viewportX,
      top: naturalY * newScale - viewportY,
    }
    setZoomPct(newZoom)
  }

  function onDoubleClick(e) {
    e.preventDefault()
    const rect = viewportRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    zoomAt(clamp(zoomPct + DOUBLE_CLICK_STEP), x, y)
  }

  // Track the canvas's *unscaled* layout size (offsetWidth/Height ignore
  // CSS transforms) so the outer sizer box can be told the true visual
  // footprint at the current zoom -- that's what makes overflow/scrolling
  // work correctly once zoomed content exceeds the viewport.
  useEffect(() => {
    if (!canvasRef.current) return
    const el = canvasRef.current
    const measure = () => setNaturalSize({ w: el.offsetWidth, h: el.offsetHeight })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  function resetView() {
    setZoomPct(100)
    if (viewportRef.current) { viewportRef.current.scrollLeft = 0; viewportRef.current.scrollTop = 0 }
  }

  // --- Mouse drag to pan ---
  function onMouseDown(e) {
    if (e.button !== 0) return
    const vp = viewportRef.current
    dragState.current = { x: e.clientX, y: e.clientY, left: vp.scrollLeft, top: vp.scrollTop }
    vp.classList.add('dragging')
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }
  function onMouseMove(e) {
    if (!dragState.current) return
    const vp = viewportRef.current
    vp.scrollLeft = dragState.current.left - (e.clientX - dragState.current.x)
    vp.scrollTop = dragState.current.top - (e.clientY - dragState.current.y)
  }
  function onMouseUp() {
    dragState.current = null
    viewportRef.current?.classList.remove('dragging')
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }



  // --- Touch: one finger pans, two fingers pinch-zoom ---
  function touchDist(touches) {
    const [a, b] = touches
    return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
  }
  function onTouchStart(e) {
    const vp = viewportRef.current
    if (e.touches.length === 2) {
      pinchState.current = { dist: touchDist(e.touches), zoom: zoomPct }
      dragState.current = null
    } else if (e.touches.length === 1) {
      const t = e.touches[0]
      dragState.current = { x: t.clientX, y: t.clientY, left: vp.scrollLeft, top: vp.scrollTop }
      pinchState.current = null
    }
  }
  function onTouchEnd(e) {
    if (e.touches.length < 2) pinchState.current = null
    if (e.touches.length < 1) dragState.current = null
  }

  const scaledW = naturalSize.w * zoomPct / 100
  const scaledH = naturalSize.h * zoomPct / 100

  return (
    <div className="zoom-widget">
      <div
        className="zoom-viewport"
        ref={viewportRef}
        onMouseDown={onMouseDown}
        onDoubleClick={onDoubleClick}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="zoom-sizer" style={{ width: scaledW || undefined, height: scaledH || undefined }}>
          <div
            className="zoom-canvas"
            ref={canvasRef}
            style={{ transform: `scale(${zoomPct / 100})` }}
          >
            <ZoomContext.Provider value={zoomPct}>
              {children}
            </ZoomContext.Provider>
          </div>
        </div>
      </div>

      <div className="zoom-controls">
        <button type="button" onClick={() => setZoomPct(z => clamp(z - ZOOM_STEP))}>−</button>
        <input
          type="range" min={MIN_ZOOM} max={MAX_ZOOM} step={ZOOM_STEP}
          value={zoomPct} onChange={e => setZoomPct(clamp(Number(e.target.value)))}
        />
        <button type="button" onClick={() => setZoomPct(z => clamp(z + ZOOM_STEP))}>+</button>
        <span className="zoom-pct">{zoomPct}%</span>
        <button type="button" className="zoom-reset" onClick={resetView}>Reset</button>
        <span className="zoom-hint">Double-click, Ctrl+scroll, or pinch to zoom &middot; drag to pan</span>
      </div>
    </div>
  )
}