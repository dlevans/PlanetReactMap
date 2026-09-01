/**
 * Converts new room JSON format from map creator into viewer's room data structure
 * Includes ALL items (booths, tables, chairs, templates) with full metadata
 */

export function convertRoomJson(roomJson, roomMetadata = {}) {
  const { room, imageWidth, imageHeight, items = [] } = roomJson;

  // Keep all items with their full properties for rendering
  const allItems = items.map(item => ({
    id: item.id,
    x: item.x,
    y: item.y,
    type: item.type, // 'booth', 'table', 'chair', 'template-image', etc.
    label: item.label || '',
    width: item.width,
    height: item.height,
    orientation: item.orientation || 'horizontal',
    rotation: item.rotation || 0,
    color: item.color,
    templateKey: item.templateKey,
    image: item.image
  }));

  return {
    label: roomMetadata.label || room,
    group: roomMetadata.group || 'Uncategorized',
    baseImage: roomMetadata.baseImage || `images/${room}.png`,
    imageWidth,
    imageHeight,
    items: allItems,
    // Keep 'booths' for backwards compatibility - just filter booths from items
    booths: allItems.filter(item => item.type === 'booth')
  };
}

/**
 * Room metadata configuration
 * Maps room IDs to their display info, base images, and groups
 * IMPORTANT: Room IDs MUST match JSON filenames (e.g., 'rooms-2101' for 'rooms-2101.json')
 */
export const ROOM_METADATA = {
  'hall-a': {
    label: 'Hall A',
    group: 'Bartle Hall',
    baseImage: 'images/top_map/hall-a.png'
  },
  'hall-b': {
    label: 'Hall B',
    group: 'Bartle Hall',
    baseImage: 'images/top_map/hall-b.png'
  },
  'hall-c': {
    label: 'Hall C',
    group: 'Bartle Hall',
    baseImage: 'images/top_map/hall-c.png'
  },
  'hall-d': {
    label: 'Hall D',
    group: 'Bartle Hall',
    baseImage: 'images/top_map/hall-d.png'
  },
  'hall-e': {
    label: 'Hall E',
    group: 'Bartle Hall',
    baseImage: 'images/top_map/hall-e.png'
  },
  'gh-a': {
    label: '3501 A',
    group: 'Great Hall (3501)',
    baseImage: 'images/top_map/great-hall-3501-A.png'
  },
  'gh-b': {
    label: '3501 B',
    group: 'Great Hall (3501)',
    baseImage: 'images/top_map/great-hall-3501-B.png'
  },
  'gh-c': {
    label: '3501 C',
    group: 'Great Hall (3501)',
    baseImage: 'images/top_map/great-hall-3501-C.png'
  },
  'gh-d': {
    label: '3501 D',
    group: 'Great Hall (3501)',
    baseImage: 'images/top_map/great-hall-3501-D.png'
  },
  'gh-e': {
    label: '3501 E',
    group: 'Great Hall (3501)',
    baseImage: 'images/top_map/great-hall-3501-E.png'
  },
  'gh-f': {
    label: '3501 F',
    group: 'Great Hall (3501)',
    baseImage: 'images/top_map/great-hall-3501-F.png'
  },
  'gh-g': {
    label: '3501 G',
    group: 'Great Hall (3501)',
    baseImage: 'images/top_map/great-hall-3501-G.png'
  },
  'gh-h': {
    label: '3501 H',
    group: 'Great Hall (3501)',
    baseImage: 'images/top_map/great-hall-3501-H.png'
  },
  'gh-lobby': {
    label: 'Great Hall Lobby',
    group: 'Great Hall (3501)',
    baseImage: 'images/top_map/great-hall-3501-Lobby.png'
  },
  'panel-room-1500A': {
    label: 'Room 1500A',
    group: 'Room 1500',
    baseImage: 'images/top_map/rooms-1501.png'
  },
  'panel-room-1500B': {
    label: 'Room 1500B',
    group: 'Room 1500',
    baseImage: 'images/top_map/rooms-1501.png'
  },
  'panel-room-1500C': {
    label: 'Room 1500C',
    group: 'Room 1500',
    baseImage: 'images/top_map/rooms-1501.png'
  },
  'grand-ballroom': {
    label: 'Grand Ballroom (2501)',
    group: 'Conference Center & Grand Ballroom',
    baseImage: 'images/top_map/grand-ballroom-2501.png'
  },
  'rooms-2502-2505': {
    label: 'Rooms 2502-2505',
    group: 'Conference Center & Grand Ballroom',
    baseImage: 'images/top_map/rooms-2502-2505.png'
  },
  'rooms-2101': {
    label: 'Rooms 2101-2105',
    group: 'Rooms 2101-2105',
    baseImage: 'images/top_map/rooms_2101_2105.png'
  },
  'lobby-2300': {
    label: 'Lobby 2300',
    group: 'Lobby 2300',
    baseImage: 'images/top_map/lobby-2300.png'
  },
  'rooms-2201': {
    label: 'Rooms 2201-2215',
    group: 'Rooms 2201-2215',
    baseImage: 'images/top_map/rooms_2201_2215.png'
  },
  'exhibition-hall': {
    label: 'Exhibition Hall',
    group: 'Municipal Auditorium',
    baseImage: 'images/top_map/exhibition-hall.png'
  },
  'arena': {
    label: 'Arena',
    group: 'Municipal Auditorium',
    baseImage: 'images/top_map/arena.png'
  },
  'music-hall': {
    label: 'Music Hall',
    group: 'Municipal Auditorium',
    baseImage: 'images/top_map/music-hall.png'
  },
  'little-theater': {
    label: 'Little Theatre',
    group: 'Municipal Auditorium',
    baseImage: 'images/top_map/little-theatre.png'
  }
};

/**
 * List of all room IDs to load
 */
export const ALL_ROOM_IDS = Object.keys(ROOM_METADATA);