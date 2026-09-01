import ZoomPanViewport from './ZoomPanViewport.jsx'
import BoothPin from './BoothPin.jsx'

// Must match the key in booths.json ("ballroom")
const GRAND_BALLROOM_ID = 'lobby-2300' //.json filename

export default function Lobby_2300({ checked, rooms, onSelectBooth, selectedKey }) {
  // Return null if the ballroom checkbox is not selected
  if (!checked[GRAND_BALLROOM_ID]) return null

  const room = rooms?.[GRAND_BALLROOM_ID]

  return (
    <div className="rooms2502-2505-wrap">
      <ZoomPanViewport>
        <div className="hall-image-wrap">
          <PuzzleImage
            src="/images/rooms_2502_2505/rooms_2502_2505.png"
            alt="Rooms 2502-2505"
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
  const items = room?.items
  const imageWidth = room?.imageWidth
  const imageHeight = room?.imageHeight
  const hasItems = Array.isArray(items) && items.length > 0 && imageWidth && imageHeight

  return (
    <div className="puzzle-image-wrap">
      <img className="puzzle-image" src={src} alt={alt} draggable={false} />
      {hasItems && (
        <div className="pins-overlay">
          {items.map(item => (
            <BoothPin
              key={item.id}
              booth={item}
              xPct={(item.x / imageWidth) * 100}
              yPct={(item.y / imageHeight) * 100}
              selected={selectedKey === GRAND_BALLROOM_ID + '::' + item.id}
              onClick={() => onSelectBooth?.(item, GRAND_BALLROOM_ID)}
            />
          ))}
        </div>
      )}
    </div>
  )
}