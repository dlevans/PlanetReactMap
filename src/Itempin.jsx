import { useContext } from 'react'
import { ZoomContext } from './ZoomPanViewport.jsx'

/**
 * ItemPin Component - Fixed version
 * Renders any item type (booth, table, chair, template-image, etc.) with full styling
 * Ensures clicks are properly captured and propagated
 */

export default function ItemPin({ item, xPct, yPct, imageWidth, imageHeight, selected, onClick }) {
  const zoom = useContext(ZoomContext) / 100
  const { type, label, width, height, rotation, color } = item;

  // Style based on item type
  const getItemStyles = () => {
    const base = {
      position: 'absolute',
      left: `${xPct}%`,
      top: `${yPct}%`,
      transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
      cursor: 'pointer',
      zIndex: selected ? 1000 : 'auto',
      pointerEvents: 'auto', // CRITICAL: Ensure this can receive clicks
    };

    // Calculate percentage size based on actual image dimensions
    const widthPct = imageWidth ? (width / imageWidth) * 100 : 0
    const heightPct = imageHeight ? (height / imageHeight) * 100 : 0

    switch (type) {
      case 'booth':
        return {
          ...base,
          width: `${widthPct}%`,
          height: `${heightPct}%`,
          backgroundColor: selected ? '#ef4444' : (color || '#3b82f6'),
          border: selected ? '3px solid #dc2626' : '2px solid rgba(0,0,0,0.2)',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '12px',
          fontWeight: 'bold',
          textShadow: '0 1px 2px rgba(0,0,0,0.5)',
          padding: '4px'
        };

      case 'table':
        return {
          ...base,
          width: `${widthPct}%`,
          height: `${heightPct}%`,
          backgroundColor: '#d4af37',
          border: selected ? '2px solid #b8941f' : '2px solid #8b7600',
          borderRadius: '2px',
          pointerEvents: 'none', // Not clickable
          cursor: 'default'
        };

      case 'chair':
        return {
          ...base,
          width: `${widthPct}%`,
          height: `${heightPct}%`,
          backgroundColor: '#e5e7eb',
          border: selected ? '2px solid #6b7280' : '1px solid #9ca3af',
          borderRadius: '1px',
          pointerEvents: 'none', // Not clickable
          cursor: 'default'
        };

      case 'template-image':
        return {
          ...base,
          width: `${widthPct}%`,
          height: `${heightPct}%`,
          backgroundImage: `url('${item.image}')`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          border: selected ? '2px solid #ec4899' : '1px dashed #a78bfa',
          borderRadius: '2px',
          pointerEvents: 'none', // Not clickable
          cursor: 'default'
        };

      case 'signage':
        return {
          ...base,
          width: `${widthPct}%`,
          height: `${heightPct}%`,
          backgroundColor: selected ? '#fbbf24' : (color || '#f59e0b'),
          border: selected ? '3px solid #f97316' : '2px solid rgba(0,0,0,0.2)',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '12px',
          fontWeight: 'bold',
          textShadow: '0 1px 2px rgba(0,0,0,0.5)',
          padding: '4px'
        };

      default:
        return {
          ...base,
          width: `${widthPct}%`,
          height: `${heightPct}%`,
          backgroundColor: '#9ca3af',
          border: selected ? '2px solid #374151' : '1px solid #6b7280',
          borderRadius: '2px',
          pointerEvents: 'none', // Not clickable
          cursor: 'default'
        };
    }
  };

  // Show labels for booths and signage - everything else (tables, chairs, etc) has NO labels
  const showLabel = (type === 'booth' || type === 'signage') && zoom >= 1.75;
  
  // Make booths and signage clickable - everything else is non-interactive
  const isClickable = type === 'booth' || type === 'signage';
  
  // Always display booth ID for booths, never show the label text on map
  const displayLabel = item.id;

  // Clean outline effect matching Map Maker's canvas rendering
  const textStyle = {
    textShadow: '-0.5px -0.5px 0 #000, 0.5px -0.5px 0 #000, -0.5px 0.5px 0 #000, 0.5px 0.5px 0 #000, 0 0 2px rgba(0,0,0,0.6)',
    fontWeight: 'bold',
    fontSize: 'inherit',
    letterSpacing: '0.5px'
  };

  return (
    <div
      style={getItemStyles()}
      onClick={isClickable ? onClick : undefined}
      onMouseDown={isClickable ? (e => e.stopPropagation()) : undefined}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      title={isClickable ? `${item.id}${label ? ' - ' + label : ''} (${type})` : undefined}
    >
      {showLabel && <span style={textStyle}>{displayLabel}</span>}
    </div>
  );
}