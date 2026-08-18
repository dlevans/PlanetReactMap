import ZoomPanViewport from './ZoomPanViewport.jsx'
import BoothPin from './BoothPin.jsx'

// Room 1500 puzzle grid layout: caps at top and bottom always visible,
// three room sections (A, B, C) that toggle independently. Single column
// vertical layout.
const ROOM_1500_CELLS = [
  { cap: true, src: '1500_01.png' },
  { id: '1500-a', src: '1500_02.png' },
  { id: '1500-b', src: '1500_03.png' },
  { id: '1500-c', src: '1500_04.png' },
  { cap: true, src: '1500_05.png' },
]

const ROOM_1500_IDS = ['1500-a', '1500-b', '1500-c']

export default function Room1500Gallery({ checked, rooms, onSelectBooth, selectedKey }) {
  const anyChecked = ROOM_1500_IDS.some(id => checked[id])
  if (!anyChecked) return null

  return (
    <div className="room-1500-gallery-wrap">
      <ZoomPanViewport>
        <div className="room-1500-grid">
          {ROOM_1500_CELLS.map((cell, i) => {
            const visible = cell.cap ? true : !!checked[cell.id]
            const room = cell.id ? rooms?.[cell.id] : null
            return (
              <div
                className={'puzzle-piece' + (cell.cap ? ' room-1500-cap' : '')}
                key={i}
                style={{ visibility: visible ? 'visible' : 'hidden' }}
              >
                <PuzzleImage
                  src={`/images/top_down/room_1500/${cell.src}`}
                  alt={cell.id || cell.src}
                  roomId={cell.id}
                  room={room}
                  onSelectBooth={onSelectBooth}
                  selectedKey={selectedKey}
                />
              </div>
            )
          })}
        </div>
      </ZoomPanViewport>
    </div>
  )
}

function PuzzleImage({ src, alt, roomId, room, onSelectBooth, selectedKey }) {
  const booths = room?.booths
  const imageWidth = room?.imageWidth
  const imageHeight = room?.imageHeight
  const hasPins = Array.isArray(booths) && booths.length > 0 && imageWidth && imageHeight

  return (
    <div className="puzzle-image-wrap">
      <img className="puzzle-image" src={src} alt={alt} draggable={false} />
      {hasPins && (
        <div className="pins-overlay">
          {booths.map(b => (
            <BoothPin
              key={b.id}
              booth={b}
              xPct={b.x / imageWidth * 100}
              yPct={b.y / imageHeight * 100}
              selected={selectedKey === roomId + '::' + b.id}
              onClick={() => onSelectBooth?.(b, roomId)}
            />
          ))}
        </div>
      )}
    </div>
  )
}