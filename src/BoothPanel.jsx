import { useEffect } from 'react'

// Fixed panel on the right showing whichever booth was last clicked,
// or a list of booths in selected rooms if nothing is selected.
// `data` is { booth, roomId, roomLabel } or null.
// `checked` is { roomId: bool } for all rooms.
// `rooms` is { roomId: { label, booths: [...] } }.
export default function BoothPanel({ data, onClose, checked, rooms, onSelectBooth }) {
  useEffect(() => {
    if (!data) return
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [data, onClose])

  // If a booth is selected, show its details
  if (data) {
    const { booth, roomLabel } = data
    const hasSocials = Array.isArray(booth.socials) && booth.socials.length > 0

    return (
      <div className="booth-panel">
        <button className="booth-panel-close" onClick={onClose} aria-label="Close">×</button>

        <div className="booth-panel-eyebrow">
          {roomLabel}{booth.id ? ' · Booth ' + booth.id : ''}
        </div>
        <h3 className="booth-panel-title">{booth.label || booth.id}</h3>

        {booth.description
          ? <p className="booth-panel-desc">{booth.description}</p>
          : <p className="booth-panel-empty">No description yet.</p>}

        {hasSocials && (
          <div className="booth-panel-socials">
            {booth.socials.map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="booth-social-link">
                {s.platform || s.url}
              </a>
            ))}
          </div>
        )}
      </div>
    )
  }

  // No booth selected — show list of booths in selected rooms
  if (!checked || !rooms) return null

  const selectedRoomIds = Object.keys(checked).filter(id => checked[id])
  if (selectedRoomIds.length === 0) return null

  // Collect all booths from selected rooms
  const boothList = []
  selectedRoomIds.forEach(roomId => {
    const room = rooms[roomId]
    if (room && Array.isArray(room.booths)) {
      room.booths.forEach(booth => {
        boothList.push({ booth, roomId, roomLabel: room.label || roomId })
      })
    }
  })

  // Sort by booth ID (numeric if possible, else alphabetic)
  boothList.sort((a, b) => {
    const aNum = parseInt(a.booth.id)
    const bNum = parseInt(b.booth.id)
    if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum
    return a.booth.id.localeCompare(b.booth.id)
  })

  return (
    <div className="booth-panel">
      <button className="booth-panel-close" onClick={onClose} aria-label="Close">×</button>

      <div className="booth-panel-list-header">
        <h3 className="booth-panel-title">{selectedRoomIds.length === 1 ? `${rooms[selectedRoomIds[0]]?.label || 'Room'}` : 'Booths'}</h3>
        <p className="booth-panel-list-hint">Click a booth to see details</p>
      </div>

      {boothList.length === 0 ? (
        <p className="booth-panel-empty">No booths in this room yet.</p>
      ) : (
        <ul className="booth-list">
          {boothList.map(({ booth, roomId, roomLabel }) => (
            <li key={`${roomId}::${booth.id}`} className="booth-list-item" onClick={() => onSelectBooth?.(booth, roomId)}>
              <div className="booth-list-id">{booth.id}</div>
              <div className="booth-list-details">
                <div className="booth-list-label">{booth.label || '(no name)'}</div>
                {selectedRoomIds.length > 1 && <div className="booth-list-room">{roomLabel}</div>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}