import { useMemo, useState } from 'react'

// Flattens every room's booths into one searchable list: {roomId, roomLabel, booth}.
function buildIndex(rooms) {
  if (!rooms) return []
  const list = []
  for (const [roomId, room] of Object.entries(rooms)) {
    if (!Array.isArray(room.booths)) continue
    for (const booth of room.booths) {
      list.push({ roomId, roomLabel: room.label || roomId, booth })
    }
  }
  return list
}

export default function BoothSearch({ rooms, onGoToBooth }) {
  const [query, setQuery] = useState('')
  const index = useMemo(() => buildIndex(rooms), [rooms])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return index
      .filter(({ booth, roomLabel }) =>
        booth.id.toLowerCase().includes(q) || 
        (booth.label || '').toLowerCase().includes(q) ||
        (booth.description || '').toLowerCase().includes(q) ||
        roomLabel.toLowerCase().includes(q)
      )
      .sort((a, b) => {
        // Sort by label (or ID if no label), then alphabetically
        const aSort = (a.booth.label || a.booth.id).toLowerCase()
        const bSort = (b.booth.label || b.booth.id).toLowerCase()
        return aSort.localeCompare(bSort)
      })
      .slice(0, 25)
  }, [index, query])

  function pick(entry) {
    onGoToBooth(entry.booth, entry.roomId)
    setQuery('')
  }

  return (
    <div className="booth-search">
      <input
        type="text"
        className="booth-search-input"
        placeholder="Find a booth by number or name…"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={e => { if (e.key === 'Escape') setQuery('') }}
      />
      {query.trim() && (
        <div className="booth-search-results">
          {results.length === 0 && (
            <div className="booth-search-empty">No matching booths.</div>
          )}
          {results.map(entry => (
            <div
              key={entry.roomId + '::' + entry.booth.id}
              className="booth-search-result"
              onMouseDown={e => e.preventDefault()} /* keeps input from blurring before the click registers */
              onClick={() => pick(entry)}
            >
              <span className="bsr-id">{entry.booth.id}</span>
              {entry.booth.label && <span className="bsr-label">{entry.booth.label}</span>}
              <span className="bsr-room">{entry.roomLabel}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}