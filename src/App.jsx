import { useEffect, useRef, useState } from 'react'
import BartleGallery from './BartleGallery.jsx'
import GreatHallGallery from './GreatHallGallery.jsx'
import Room1500Gallery from './Room1500Gallery.jsx'
import BoothPopup from './Boothpopup.jsx'
import BoothSearch from './BoothSearch.jsx'
import GrandBallroomGallery from './GrandBallroomGallery.jsx'
import Rooms2502_2505 from './Rooms2502_2505.jsx'
import ExhibitionHall from './ExhibitionHall.jsx'
import Arena from './Arena.jsx'
import LittleTheater from './LittleTheater.jsx'
import MusicHall from './MusicHall.jsx'
import { convertRoomJson, ROOM_METADATA, ALL_ROOM_IDS } from './Roomconverter.jsx'

export default function App() {
  const [rooms, setRooms] = useState(null)
  const [checked, setChecked] = useState({})
  const [error, setError] = useState(null)
  const [selectedBooth, setSelectedBooth] = useState(null)
  const galleryAnchorRef = useRef(null)

  // Load all individual room JSON files from /rooms/ folder
  useEffect(() => {
    async function loadRooms() {
      try {
        const loadedRooms = {}
        const errors = []

        // Load each room file
        for (const roomId of ALL_ROOM_IDS) {
          try {
            const response = await fetch(`/rooms/${roomId}.json`)
            if (!response.ok) {
              // Room file doesn't exist yet, skip it
              continue
            }

            const roomJson = await response.json()
            const metadata = ROOM_METADATA[roomId]
            loadedRooms[roomId] = convertRoomJson(roomJson, metadata)
          } catch (err) {
            errors.push(`${roomId}: ${err.message}`)
          }
        }

        if (Object.keys(loadedRooms).length === 0) {
          throw new Error(`No room files loaded. Check that room JSON files exist in /rooms/ folder.${errors.length > 0 ? ' Errors: ' + errors.join(', ') : ''}`)
        }

        setRooms(loadedRooms)
      } catch (err) {
        setError(err.message)
      }
    }

    loadRooms()
  }, [])

  // Parse URL search parameters once rooms data finishes loading
  useEffect(() => {
    if (!rooms) return

    const params = new URLSearchParams(window.location.search)
    const targetId = params.get('id') || params.get('booth')

    if (!targetId) return

    const normalizedTarget = targetId.trim().toLowerCase()

    // Scan through all rooms to find an item with a matching ID
    for (const [roomId, room] of Object.entries(rooms)) {
      if (!Array.isArray(room.items)) continue

      const foundItem = room.items.find(
        item => item.id && item.id.trim().toLowerCase() === normalizedTarget
      )

      if (foundItem) {
        setChecked(prev => ({ ...prev, [roomId]: true }))
        setSelectedBooth({
          booth: foundItem,
          roomId,
          roomLabel: room.label || roomId,
          scrollTo: true
        })
        break
      }
    }
  }, [rooms])

  // Scrolls to the galleries once a selection is active and flagged for scroll
  useEffect(() => {
    if (selectedBooth?.scrollTo) {
      galleryAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [selectedBooth])

  function toggleRoom(id) {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }))
  }

  function toggleGroup(group) {
    setChecked(prev => {
      const newChecked = { ...prev }
      // Check if all rooms in this group are currently selected
      const allSelected = group.rooms.every(([id]) => newChecked[id])
      // If all selected, deselect all; otherwise select all
      group.rooms.forEach(([id]) => {
        newChecked[id] = !allSelected
      })
      return newChecked
    })
  }

  function clearMap() {
    setChecked({})
    setSelectedBooth(null)
  }

  function selectBooth(item, roomId, opts = {}) {
    setSelectedBooth({ booth: item, roomId, roomLabel: rooms?.[roomId]?.label || roomId, scrollTo: !!opts.scrollTo })
  }

  // Used by search: turns on the item's room and opens its detail panel, then scrolls it into view
  function goToBooth(item, roomId) {
    setChecked(prev => ({ ...prev, [roomId]: true }))
    selectBooth(item, roomId, { scrollTo: true })
  }

  const selectedKey = selectedBooth ? selectedBooth.roomId + '::' + selectedBooth.booth.id : null

  // Group rooms by their "group" field
  const groups = []
  if (rooms) {
    const groupIndex = {}
    for (const [id, room] of Object.entries(rooms)) {
      const groupName = room.group || 'Other'
      if (!(groupName in groupIndex)) {
        groupIndex[groupName] = groups.length
        groups.push({ name: groupName, rooms: [] })
      }
      groups[groupIndex[groupName]].rooms.push([id, room])
    }
  }

  return (
    <div className="sidebar">
      <div className="sidebar-main">
        <h2>KC Convention Center Interactive</h2>
        <button type="button" className="reset-btn" onClick={clearMap}>Clear Map</button>

        <BoothSearch rooms={rooms} onGoToBooth={goToBooth} />

        {error && (
          <p className="loading-msg error">
            Couldn't load rooms ({error}). Make sure room JSON files are in the <code>public/rooms/</code> folder
            and the dev server is running (<code>npm run dev</code>).
          </p>
        )}
        {!rooms && !error && <p className="loading-msg">Loading rooms…</p>}

        {groups.map(group => {
          // Determine group state
          const allSelected = group.rooms.every(([id]) => checked[id])
          const someSelected = group.rooms.some(([id]) => checked[id])
          
          return (
            <div className="group" key={group.name}>
              <div className="group-header">
                <p><strong>{group.name}</strong></p>
                <button
                  type="button"
                  className="group-toggle-btn"
                  onClick={() => toggleGroup(group)}
                  title={allSelected ? 'Deselect all' : 'Select all'}
                >
                  {allSelected ? '✓ All' : someSelected ? '− Some' : '+ None'}
                </button>
              </div>
              {group.rooms.map(([id, room]) => (
                <label key={id} className={checked[id] ? 'active' : ''}>
                  <input
                    type="checkbox"
                    checked={!!checked[id]}
                    onChange={() => toggleRoom(id)}
                  />
                  {room.label}
                </label>
              ))}
            </div>
          )
        })}
      </div>

      <div className="sidebar-inner">
        <div className="sidebar-main">
          <div className="map-container">
            <img src="/images/uncolored.jpg" className="base-map" alt="Base Map" />

            {rooms && Object.entries(rooms).map(([id, room]) => {
              if (!room.baseImage) return null
              return (
                <img
                  key={id}
                  className="room-layer"
                  style={{ opacity: checked[id] ? 1 : 0 }}
                  src={room.baseImage}
                  alt={room.label || id}
                />
              )
            })}

            <img className="copyright-layer" src="/images/copyright.png" alt="" />
          </div>

          <div ref={galleryAnchorRef} />
          <BartleGallery checked={checked} rooms={rooms} onSelectBooth={selectBooth} selectedKey={selectedKey} />
          <GreatHallGallery checked={checked} rooms={rooms} onSelectBooth={selectBooth} selectedKey={selectedKey} />
          <Room1500Gallery checked={checked} rooms={rooms} onSelectBooth={selectBooth} selectedKey={selectedKey} />
          <GrandBallroomGallery checked={checked} rooms={rooms} onSelectBooth={selectBooth} selectedKey={selectedKey} />
          <Rooms2502_2505 checked={checked} rooms={rooms} onSelectBooth={selectBooth} selectedKey={selectedKey} />
          <ExhibitionHall checked={checked} rooms={rooms} onSelectBooth={selectBooth} selectedKey={selectedKey} />
          <Arena checked={checked} rooms={rooms} onSelectBooth={selectBooth} selectedKey={selectedKey} />
          <LittleTheater checked={checked} rooms={rooms} onSelectBooth={selectBooth} selectedKey={selectedKey} />
          <MusicHall checked={checked} rooms={rooms} onSelectBooth={selectBooth} selectedKey={selectedKey} />
        </div>
      </div>

      {/* Floating Booth Info Popup */}
      {selectedBooth && (
        <BoothPopup data={selectedBooth} onClose={() => setSelectedBooth(null)} checked={checked} rooms={rooms} onSelectBooth={selectBooth} />
      )}
    </div>
  )
}