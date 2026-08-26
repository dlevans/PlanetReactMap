import { useEffect } from 'react'

// Panel showing whichever item was clicked on the map
// Now handles: label, description, socials, and base64 encoded images
export default function BoothPanel({ data, onClose, checked, rooms, onSelectBooth }) {
  useEffect(() => {
    if (!data) return
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [data, onClose])

  // Helper to get display name for item type
  function getItemTypeLabel(type) {
    const labels = {
      'booth': 'Booth',
      'table': 'Table',
      'chair': 'Chair',
      'template-image': 'Template',
    }
    return labels[type] || (type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Item')
  }

  // If an item is selected, show its details
  if (data) {
    const { booth: item, roomLabel } = data
    const hasSocials = Array.isArray(item.socials) && item.socials.length > 0
    const hasDescription = item.description && item.description.trim().length > 0
    const hasImage = item.image && item.image.trim().length > 0
    const itemType = getItemTypeLabel(item.type)

    return (
      <div className="booth-panel">
        <button className="booth-panel-close" onClick={onClose} aria-label="Close">×</button>

        {/* Room + Type info */}
        <div className="booth-panel-eyebrow">
          {roomLabel} • {itemType}
        </div>

        {/* Item ID and Label */}
        <h3 className="booth-panel-title">
          {item.label || item.id}
        </h3>

        {/* Item ID (if label is different) */}
        {item.label && item.id && (
          <p className="booth-panel-desc" style={{ color: '#9aa0a8', fontSize: '12px', marginBottom: '16px' }}>
            ID: {item.id}
          </p>
        )}

        {/* Image (if base64 encoded) */}
        {hasImage && (
          <div style={{ 
            marginBottom: '16px', 
            padding: '12px', 
            background: '#1a1d22', 
            borderRadius: '6px', 
            border: '1px solid #383c43',
            textAlign: 'center'
          }}>
            <img 
              src={item.image} 
              alt={item.label || 'Item image'}
              style={{
                maxWidth: '100%',
                maxHeight: '200px',
                display: 'block',
                margin: '0 auto',
                borderRadius: '4px'
              }}
            />
          </div>
        )}

        {/* Description */}
        {hasDescription && (
          <p className="booth-panel-desc">{item.description}</p>
        )}

        {/* Item Properties */}
        <div style={{ marginTop: '16px', marginBottom: '16px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#9aa0a8', marginBottom: '8px' }}>
            Properties
          </div>
          
          <div style={{ fontSize: '13px', color: '#ccc', lineHeight: '1.6' }}>
            {item.type && (
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid #383c43', marginBottom: '6px' }}>
                <span style={{ color: '#9aa0a8' }}>Type:</span>
                <span style={{ color: '#e8e9eb' }}>{itemType}</span>
              </div>
            )}
            
            {item.width && item.height && (
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid #383c43', marginBottom: '6px' }}>
                <span style={{ color: '#9aa0a8' }}>Size:</span>
                <span style={{ color: '#e8e9eb' }}>{item.width} × {item.height}px</span>
              </div>
            )}
            
            {item.rotation !== undefined && item.rotation !== 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid #383c43', marginBottom: '6px' }}>
                <span style={{ color: '#9aa0a8' }}>Rotation:</span>
                <span style={{ color: '#e8e9eb' }}>{item.rotation}°</span>
              </div>
            )}
            
            {item.color && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '6px', borderBottom: '1px solid #383c43', marginBottom: '6px' }}>
                <span style={{ color: '#9aa0a8' }}>Color:</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div 
                    style={{
                      width: '16px',
                      height: '16px',
                      backgroundColor: item.color,
                      borderRadius: '3px',
                      border: '1px solid #666'
                    }}
                  />
                  <span style={{ color: '#e8e9eb' }}>{item.color}</span>
                </span>
              </div>
            )}
            
            {item.templateKey && (
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid #383c43', marginBottom: '6px' }}>
                <span style={{ color: '#9aa0a8' }}>Template:</span>
                <span style={{ color: '#e8e9eb' }}>{item.templateKey}</span>
              </div>
            )}
            
            {item.orientation && (
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px' }}>
                <span style={{ color: '#9aa0a8' }}>Orientation:</span>
                <span style={{ color: '#e8e9eb' }}>{item.orientation}</span>
              </div>
            )}
          </div>
        </div>

        {/* Socials */}
        {hasSocials && (
          <div className="booth-panel-socials">
            {item.socials.map((s, i) => (
              <a 
                key={i} 
                href={s.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="booth-social-link"
              >
                {s.platform || s.label || s.url}
              </a>
            ))}
          </div>
        )}
      </div>
    )
  }

  // No item selected — show list of booths/items in selected rooms
  if (!checked || !rooms) return null

  const selectedRoomIds = Object.keys(checked).filter(id => checked[id])
  if (selectedRoomIds.length === 0) return null

  // Collect all booths from selected rooms (for backwards compatibility)
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