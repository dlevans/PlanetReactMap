import { useEffect, useRef, useState } from 'react'
import BartleGallery from './BartleGallery.jsx'
import GreatHallGallery from './GreatHallGallery.jsx'
import Room1500Gallery from './Room1500Gallery.jsx'
import BoothPanel from './BoothPanel.jsx'
import BoothSearch from './BoothSearch.jsx'
import GrandBallroomGallery from './GrandBallroomGallery.jsx'
import Rooms2502_2505 from './Rooms2502_2505.jsx'
import ExhibitionHall from './ExhibitionHall.jsx'
import Arena from './Arena.jsx'
import LittleTheater from './LittleTheater.jsx'
import MusicHall from './MusicHall.jsx'

export default function App() {
  const [rooms, setRooms] = useState(null)   // booths.json -> data.rooms
  const [checked, setChecked] = useState({}) // roomId -> bool
  const [error, setError] = useState(null)
  const [selectedBooth, setSelectedBooth] = useState(null) // { booth, roomId, roomLabel, scrollTo } | null
  const galleryAnchorRef = useRef(null)

  useEffect(() => {
    fetch('/booths.json')
      .then(res => {
        if (!res.ok) throw new Error('HTTP ' + res.status)
        return res.json()
      })
      .then(data => setRooms(data.rooms || {}))
      .catch(err => setError(err.message))
  }, [])

  // Parse URL search parameters once rooms data finishes loading
  useEffect(() => {
    if (!rooms) return

    const params = new URLSearchParams(window.location.search)
    const targetId = params.get('id') || params.get('booth') // Supports ?id=C2 or ?booth=C2

    if (!targetId) return

    const normalizedTarget = targetId.trim().toLowerCase()

    // Scan through all rooms to find a booth with a matching ID
    for (const [roomId, room] of Object.entries(rooms)) {
      if (!Array.isArray(room.booths)) continue

      const foundBooth = room.booths.find(
        b => b.id && b.id.trim().toLowerCase() === normalizedTarget
      )

      if (foundBooth) {
        // Enable room visibility and select the booth
        setChecked(prev => ({ ...prev, [roomId]: true }))
        setSelectedBooth({
          booth: foundBooth,
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

  function clearMap() {
    setChecked({})
    setSelectedBooth(null)
  }

  function selectBooth(booth, roomId, opts = {}) {
    setSelectedBooth({ booth, roomId, roomLabel: rooms?.[roomId]?.label || roomId, scrollTo: !!opts.scrollTo })
  }

  // Used by search: turns on the booth's room and opens its detail panel, then scrolls it into view
  function goToBooth(booth, roomId) {
    setChecked(prev => ({ ...prev, [roomId]: true }))
    selectBooth(booth, roomId, { scrollTo: true })
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
      <h2>KC Convention Center Interactive</h2>
      <button type="button" className="reset-btn" onClick={clearMap}>Clear Map</button>

      <BoothSearch rooms={rooms} onGoToBooth={goToBooth} />

      {error && (
        <p className="loading-msg error">
          Couldn't load booths.json ({error}). Make sure booths.json is in the <code>public/</code> folder
          and the dev server is running (<code>npm run dev</code>).
        </p>
      )}
      {!rooms && !error && <p className="loading-msg">Loading rooms…</p>}

      {groups.map(group => (
        <div className="group" key={group.name}>
          <p><strong>{group.name}</strong></p>
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
      ))}

      <div className="map-container">
        <img src="/images/uncolored.jpg" className="base-map" alt="Base Map" />

        {rooms && Object.entries(rooms).map(([id, room]) => {
          if (!room.baseImage) return null
          return (
            <img
              key={id}
              className="room-layer"
              style={{ opacity: checked[id] ? 1 : 0 }}
              src={'/' + room.baseImage}
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

      <BoothPanel data={selectedBooth} onClose={() => setSelectedBooth(null)} checked={checked} rooms={rooms} onSelectBooth={selectBooth} />
    </div>
  )
}