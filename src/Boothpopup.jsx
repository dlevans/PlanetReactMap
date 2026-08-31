import { useEffect, useRef } from 'react'

/**
 * BoothPopup - Floating popup that appears on the map/gallery next to selected booth
 * Displays booth details with an X button to close
 */
export default function BoothPopup({ data, onClose, checked, rooms, onSelectBooth }) {
  if (!data) return null

  const { booth, roomId, roomLabel } = data
  const { id, label, type } = booth

  const popupRef = useRef(null)

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      ref={popupRef}
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#ffffff',
        border: '2px solid #3b82f6',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
        zIndex: 1000,
        maxWidth: '380px',
        minWidth: '300px',
        maxHeight: '80vh',
        overflowY: 'auto',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'none',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          color: '#6b7280',
          padding: '4px',
          lineHeight: '1',
          transition: 'color 0.2s ease',
        }}
        onMouseEnter={e => e.target.style.color = '#1e293b'}
        onMouseLeave={e => e.target.style.color = '#6b7280'}
        title="Close popup (Esc)"
      >
        ✕
      </button>

      {/* Booth ID */}
      <div style={{ marginBottom: '16px' }}>
        <h2
          style={{
            margin: '0 0 8px 0',
            fontSize: '28px',
            fontWeight: '700',
            color: '#1e293b',
            wordBreak: 'break-word',
          }}
        >
          {id}
        </h2>
        <p
          style={{
            margin: '0',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#64748b',
          }}
        >
          {roomLabel}
        </p>
      </div>

      {/* Booth Image */}
      {booth.image && (
        <div style={{ marginBottom: '16px' }}>
          <img
            src={booth.image}
            alt={`${id} - ${label || 'booth sign'}`}
            style={{
              width: '100%',
              maxHeight: '200px',
              objectFit: 'contain',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc',
            }}
          />
        </div>
      )}

      {/* Divider before details */}
      {booth.image && <div style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '16px 0' }} />}

      {/* Booth Name/Label */}
      {label && (
        <div style={{ marginBottom: '16px' }}>
          <p
            style={{
              margin: '0 0 8px 0',
              fontSize: '14px',
              fontWeight: '600',
              color: '#475569',
            }}
          >
            Booth Name
          </p>
          <p
            style={{
              margin: '0',
              fontSize: '16px',
              color: '#1e293b',
              lineHeight: '1.5',
              wordBreak: 'break-word',
            }}
          >
            {label}
          </p>
        </div>
      )}

      {/* Booth Type */}
      {type && (
        <div style={{ marginBottom: '16px' }}>
          <p
            style={{
              margin: '0 0 8px 0',
              fontSize: '14px',
              fontWeight: '600',
              color: '#475569',
            }}
          >
            Type
          </p>
          <p
            style={{
              margin: '0',
              fontSize: '14px',
              color: '#1e293b',
              textTransform: 'capitalize',
            }}
          >
            {type}
          </p>
        </div>
      )}

      {/* Close Hint */}
      <div
        style={{
          marginTop: '20px',
          padding: '12px',
          backgroundColor: '#f8fafc',
          borderRadius: '6px',
          fontSize: '11px',
          color: '#64748b',
          textAlign: 'center',
        }}
      >
        Press ESC or click outside to close
      </div>
    </div>
  )
}