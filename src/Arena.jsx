import ZoomPanViewport from './ZoomPanViewport.jsx'
import BoothPin from './BoothPin.jsx'

// Must match the key in booths.json ("ballroom")
const GRAND_BALLROOM_ID = 'arena' 

export default function Arena({ checked, rooms, onSelectBooth, selectedKey }) {
  // Return null if the ballroom checkbox is not selected
  if (!checked[GRAND_BALLROOM_ID]) return null

  const room = rooms?.[GRAND_BALLROOM_ID]

  return (
    <div className="arena-wrap">
      <ZoomPanViewport>
        <div className="hall-image-wrap">
          <PuzzleImage
            src="/images/arena/arena.png"
            alt="Arena"
            room={room}
            onSelectBooth={onSelectBooth}
            selectedKey={selectedKey}
          />
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
              xPct={(b.x / imageWidth) * 100}
              yPct={(b.y / imageHeight) * 100}
              selected={selectedKey === GRAND_BALLROOM_ID + '::' + b.id}
              onClick={() => onSelectBooth?.(b, GRAND_BALLROOM_ID)}
            />
          ))}
        </div>
      )}
    </div>
  )
}