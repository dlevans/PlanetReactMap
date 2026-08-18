import ZoomPanViewport from './ZoomPanViewport.jsx'

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
  const booths = room?.booths
  const imageWidth = room?.imageWidth
  const imageHeight = room?.imageHeight
  const hasPins = Array.isArray(booths) && booths.length > 0 && imageWidth && imageHeight

  return (
    <div className="hall-image-wrap">
      <img className="hall-image" src={`/images/top_down/bartle_hall/${id}.png`} alt={id} draggable={false} />
      {hasPins && (
        <div className="pins-overlay">
          {booths.map(b => (
            <div
              key={b.id}
              className={'booth-pin' + (selectedKey === id + '::' + b.id ? ' selected' : '')}
              style={{ left: (b.x / imageWidth * 100) + '%', top: (b.y / imageHeight * 100) + '%' }}
              onMouseDown={e => e.stopPropagation()}
              onClick={() => onSelectBooth?.(b, id)}
            >
              <span className="pin-num">{b.id}</span>
              <span className="pin-tag">{b.id}{b.label ? ' — ' + b.label : ''}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
