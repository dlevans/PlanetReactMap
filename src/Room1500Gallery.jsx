import ZoomPanViewport from './ZoomPanViewport.jsx'
import BoothPin from './BoothPin.jsx'

// Panel Room 1500: A single unified room showing the three-room gallery (A, B, C)
// all together whenever the room is checked.
// Caps at top and bottom, three room sections in between, single vertical layout.
const ROOM_1500_CELLS = [
  { cap: true, src: '1500_01.png' },
  { src: '1500_02.png' },
  { src: '1500_03.png' },
  { src: '1500_04.png' },
  { cap: true, src: '1500_05.png' },
]

const PANEL_ROOM_1500_ID = 'panel-room-1500'

export default function Room1500Gallery({ checked, rooms, onSelectBooth, selectedKey }) {
  if (!checked[PANEL_ROOM_1500_ID]) return null

  const room = rooms?.[PANEL_ROOM_1500_ID]
  if (!room) return null

  return (
    <div className="room-1500-gallery-wrap">
      <ZoomPanViewport>
        <div className="room-1500-grid">
          {ROOM_1500_CELLS.map((cell, i) => (
            <div
              className={'puzzle-piece' + (cell.cap ? ' room-1500-cap' : '')}
              key={i}
            >
              <PuzzleImage
                src={`/images/top_down/room_1500/${cell.src}`}
                alt={cell.src}
                room={room}
                onSelectBooth={onSelectBooth}
                selectedKey={selectedKey}
              />
            </div>
          ))}
        </div>
      </ZoomPanViewport>
    </div>
  )
}

function PuzzleImage({ src, alt, room, onSelectBooth, selectedKey }) {
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
              selected={selectedKey === PANEL_ROOM_1500_ID + '::' + b.id}
              onClick={() => onSelectBooth?.(b, PANEL_ROOM_1500_ID)}
            />
          ))}
        </div>
      )}
    </div>
  )
}