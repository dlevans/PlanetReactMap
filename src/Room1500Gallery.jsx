import ZoomPanViewport from './ZoomPanViewport.jsx'
import BoothPin from './BoothPin.jsx'

// Room 1500: Three-section gallery (A, B, C)
// Each section is independently toggleable like the Bartle halls.
// Caps at top and bottom, three room sections in between (A, B, C), single vertical layout.
const ROOM_1500_SECTIONS = [
  { id: 'panel-room-1500A', cellIndex: 1, src: '1500_02.png' },
  { id: 'panel-room-1500B', cellIndex: 2, src: '1500_03.png' },
  { id: 'panel-room-1500C', cellIndex: 3, src: '1500_04.png' },
]

const ROOM_1500_CELLS = [
  { cap: true, src: '1500_01.png' },
  { src: '1500_02.png' },
  { src: '1500_03.png' },
  { src: '1500_04.png' },
  { cap: true, src: '1500_05.png' },
]

export default function Room1500Gallery({ checked, rooms, onSelectBooth, selectedKey }) {
  const anyChecked = ROOM_1500_SECTIONS.some(section => checked[section.id])
  if (!anyChecked) return null

  return (
    <div className="room-1500-gallery-wrap">
      <ZoomPanViewport>
        <div className="room-1500-grid">
          {ROOM_1500_CELLS.map((cell, i) => (
            <div
              className={'puzzle-piece' + (cell.cap ? ' room-1500-cap' : '')}
              key={i}
            >
              {cell.cap ? (
                <img className="puzzle-image" src={`/images/top_down/room_1500/${cell.src}`} alt={`cap-${i}`} draggable={false} />
              ) : (
                <PuzzleImage
                  cellIndex={i}
                  src={`/images/top_down/room_1500/${cell.src}`}
                  alt={cell.src}
                  sections={ROOM_1500_SECTIONS}
                  checked={checked}
                  rooms={rooms}
                  onSelectBooth={onSelectBooth}
                  selectedKey={selectedKey}
                />
              )}
            </div>
          ))}
        </div>
      </ZoomPanViewport>
    </div>
  )
}

function PuzzleImage({ cellIndex, src, alt, sections, checked, rooms, onSelectBooth, selectedKey }) {
  // Find the section that corresponds to this cell index
  const section = sections.find(s => s.cellIndex === cellIndex)
  if (!section || !checked[section.id]) return <img className="puzzle-image" src={src} alt={alt} draggable={false} />

  const room = rooms?.[section.id]
  const items = room?.items
  const imageWidth = room?.imageWidth
  const imageHeight = room?.imageHeight
  const hasItems = Array.isArray(items) && items.length > 0 && imageWidth && imageHeight

  return (
    <div className="puzzle-image-wrap">
      <img className="puzzle-image" src={src} alt={alt} draggable={false} />
      {hasItems && (
        <div className="pins-overlay">
          {items.map(b => (
            <BoothPin
              key={b.id}
              booth={b}
              xPct={b.x / imageWidth * 100}
              yPct={b.y / imageHeight * 100}
              selected={selectedKey === section.id + '::' + b.id}
              onClick={() => onSelectBooth?.(b, section.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}