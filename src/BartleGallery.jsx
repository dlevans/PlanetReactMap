import ZoomPanViewport from './ZoomPanViewport.jsx'
import ItemPin from './Itempin.jsx'

// Order matches the original left-to-right layout (E through A).
const HALLS = ['hall-e', 'hall-d', 'hall-c', 'hall-b', 'hall-a']

export default function BartleGallery({ checked, rooms, onSelectBooth, selectedKey }) {
  const anyChecked = HALLS.some(id => checked[id])
  if (!anyChecked) return null

  return (
    <div className="top-down-gallery">
      <ZoomPanViewport>
        <div className="hall-strip">
          {HALLS.map(id => checked[id] && (
            <HallImage key={id} id={id} room={rooms?.[id]} onSelectBooth={onSelectBooth} selectedKey={selectedKey} />
          ))}
        </div>
      </ZoomPanViewport>
    </div>
  )
}

function HallImage({ id, room, onSelectBooth, selectedKey }) {
  const items = room?.items
  const imageWidth = room?.imageWidth
  const imageHeight = room?.imageHeight
  const hasItems = Array.isArray(items) && items.length > 0 && imageWidth && imageHeight

  return (
    <div className="hall-image-wrap">
      <img className="hall-image" src={`/images/top_down/bartle_hall/${id}.png`} alt={id} draggable={false} />
      {hasItems && (
        <div className="pins-overlay">
          {items.map(item => (
            <ItemPin
              key={item.id}
              item={item}
              xPct={item.x / imageWidth * 100}
              yPct={item.y / imageHeight * 100}
              imageWidth={imageWidth}
              imageHeight={imageHeight}
              selected={selectedKey === id + '::' + item.id}
              onClick={() => onSelectBooth?.(item, id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}