import ZoomPanViewport from './ZoomPanViewport.jsx'
import BoothPin from './BoothPin.jsx'

// Same 14-cell layout as the original puzzle grid, in DOM order -- the
// grid is 2 columns wide, so this array naturally flows into the same
// 7-row arrangement the original CSS grid-area rules hardcoded. Column
// widths (308px/318px) come from .great-hall-puzzle-grid's
// grid-template-columns, same as the original design, so pieces tile
// correctly without any per-image width math.
const GH_CELLS = [
  { cap: true, src: 'top_left.png' },
  { cap: true, src: 'top_right.png' },
  { id: 'gh-d', src: '3501 - D.png' },
  { id: 'gh-b', src: '3501 - B.png' },
  { id: 'gh-c', src: '3501 - C.png' },
  { id: 'gh-a', src: '3501 - A.png' },
  { id: 'gh-lobby', src: '3501 - Lobby1.png' },
  { id: 'gh-lobby', src: '3501 - Lobby2.png' },
  { id: 'gh-g', src: '3501 - G.png' },
  { id: 'gh-e', src: '3501 - E.png' },
  { id: 'gh-h', src: '3501 - H.png' },
  { id: 'gh-f', src: '3501 - F.png' },
  { cap: true, src: 'bottom_left.png' },
  { cap: true, src: 'bottom_right.png' },
]

const GH_IDS = ['gh-a', 'gh-b', 'gh-c', 'gh-d', 'gh-e', 'gh-f', 'gh-g', 'gh-h', 'gh-lobby']

export default function GreatHallGallery({ checked, rooms, onSelectBooth, selectedKey }) {
  const anyChecked = GH_IDS.some(id => checked[id])
  if (!anyChecked) return null

  return (
    <div className="great-hall-gallery-wrap">
      <ZoomPanViewport>
        <div className="great-hall-puzzle-grid">
          {GH_CELLS.map((cell, i) => {
            const visible = cell.cap ? true : !!checked[cell.id]
            const room = cell.id ? rooms?.[cell.id] : null
            return (
              <div
                className={'puzzle-piece' + (cell.cap ? ' gh-cap' : '')}
                key={i}
                style={{ visibility: visible ? 'visible' : 'hidden' }}
              >
                <PuzzleImage
                  src={`/images/top_down/great_hall/${cell.src}`}
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
