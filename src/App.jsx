import { useEffect, useState } from 'react'
import BartleGallery from './BartleGallery.jsx'
import GreatHallGallery from './GreatHallGallery.jsx'

export default function App() {
  const [rooms, setRooms] = useState(null)   // booths.json -> data.rooms
  const [checked, setChecked] = useState({}) // roomId -> bool
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/booths.json')
      .then(res => {
        if (!res.ok) throw new Error('HTTP ' + res.status)
        return res.json()
      })
      .then(data => setRooms(data.rooms || {}))
      .catch(err => setError(err.message))
  }, [])

  function toggleRoom(id) {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }))
  }

  function clearMap() {
    setChecked({})
  }

  // Group rooms by their "group" field, preserving first-seen order.
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

        {rooms && Object.entries(rooms).map(([id, room]) => (
          room.baseImage && (
            <img
              key={id}
              className="room-layer"
              style={{ opacity: checked[id] ? 1 : 0 }}
              src={'/' + room.baseImage}
              alt={room.label || id}
            />
          )
        ))}

        <img className="copyright-layer" src="/images/copyright.png" alt="" />
      </div>

      <BartleGallery checked={checked} rooms={rooms} />
      <GreatHallGallery checked={checked} rooms={rooms} />
    </div>
  )
}
