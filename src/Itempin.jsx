/**
 * ItemPin Component - Fixed version
 * Renders any item type (booth, table, chair, template-image, etc.) with full styling
 * Ensures clicks are properly captured and propagated
 */

export default function ItemPin({ item, xPct, yPct, imageWidth, imageHeight, selected, onClick }) {
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
          backgroundColor: color || '#3b82f6',
          border: selected ? '3px solid #1e40af' : '2px solid rgba(0,0,0,0.2)',
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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '10px',
          color: '#333'
        };

      case 'chair':
        return {
          ...base,
          width: `${widthPct}%`,
          height: `${heightPct}%`,
          backgroundColor: '#e5e7eb',
          border: selected ? '2px solid #6b7280' : '1px solid #9ca3af',
          borderRadius: '1px'
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
          borderRadius: '2px'
        };

      default:
        return {
          ...base,
          width: `${widthPct}%`,
          height: `${heightPct}%`,
          backgroundColor: '#9ca3af',
          border: selected ? '2px solid #374151' : '1px solid #6b7280',
          borderRadius: '2px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '10px',
          color: 'white'
        };
    }
  };

  const showLabel = label && ['booth', 'table'].includes(type);

  return (
    <div
      style={getItemStyles()}
      onClick={onClick}
      onMouseDown={e => e.stopPropagation()} // Prevent zoom pan from interfering
      role="button"
      tabIndex={0}
      title={`${item.id}${label ? ' - ' + label : ''} (${type})`}
    >
      {showLabel && <span>{label}</span>}
    </div>
  );
}