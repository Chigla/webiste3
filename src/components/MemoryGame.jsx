import { useState, useEffect, useCallback } from 'react'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function MemoryGame({ images }) {
  const subset = images.slice(0, 6)
  const [cards, setCards]   = useState([])
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [moves, setMoves]   = useState(0)
  const [win, setWin]       = useState(false)

  const init = useCallback(() => {
    const deck = shuffle([...subset, ...subset].map((src, i) => ({ src, id: i, pairId: src })))
    setCards(deck)
    setFlipped([])
    setMatched([])
    setMoves(0)
    setWin(false)
  }, [subset.join()])

  useEffect(() => { init() }, [init])

  useEffect(() => {
    if (flipped.length === 2) {
      setMoves(m => m + 1)
      const [a, b] = flipped
      if (cards[a].pairId === cards[b].pairId) {
        setMatched(m => {
          const next = [...m, a, b]
          if (next.length === cards.length) setWin(true)
          return next
        })
        setFlipped([])
      } else {
        const t = setTimeout(() => setFlipped([]), 1000)
        return () => clearTimeout(t)
      }
    }
  }, [flipped, cards])

  const flip = (i) => {
    if (flipped.length === 2) return
    if (flipped.includes(i)) return
    if (matched.includes(i)) return
    setFlipped(f => [...f, i])
  }

  const isVisible = (i) => flipped.includes(i) || matched.includes(i)

  return (
    <div style={{ padding: '1.5rem max(1.5rem,4vw) 3rem', position: 'relative', zIndex: 1 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 className="heading" style={{ fontSize: '1.8rem', color: 'var(--accent)', marginBottom: '0.15rem' }}>Memory Matching</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text2)' }}>Find all the matching pairs — {moves} moves</p>
        </div>
        <button className="btn" onClick={init} style={{ padding: '0.45rem 1.2rem' }}>Restart</button>
      </div>

      {win && (
        <div style={winBanner}>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--accent)' }}>You did it!</span>
          <p style={{ fontSize: '0.85rem', color: 'var(--text2)', marginTop: '0.3rem' }}>Completed in {moves} moves ♡</p>
          <button className="btn" onClick={init} style={{ marginTop: '0.8rem' }}>Play Again</button>
        </div>
      )}

      <div style={grid}>
        {cards.map((card, i) => (
          <div key={card.id} onClick={() => flip(i)} style={{ perspective: '600px', cursor: 'pointer' }}>
            <div style={{
              ...cardInner,
              transform: isVisible(i) ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}>
              {/* Back */}
              <div style={{ ...face, ...back }}>
                <svg width="36" height="36" viewBox="0 0 36 36">
                  <path d="M18 30 C18 30 4 20 4 11 C4 6 7.5 3 11 3 C14 3 16.5 5 18 7.5 C19.5 5 22 3 25 3 C28.5 3 32 6 32 11 C32 20 18 30 18 30Z" fill="var(--accent)" opacity="0.5" />
                </svg>
              </div>
              {/* Front */}
              <div style={{ ...face, ...front }}>
                <img
                  src={card.src}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                />
                {matched.includes(i) && (
                  <div style={matchedOverlay}>
                    <svg width="28" height="28" viewBox="0 0 28 28">
                      <circle cx="14" cy="14" r="13" fill="rgba(255,255,255,0.85)" />
                      <path d="M7 14 L12 19 L21 9" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
  gap: '1rem',
  maxWidth: '900px',
  margin: '0 auto',
}

const cardInner = {
  position: 'relative',
  width: '100%',
  paddingTop: '100%',
  transition: 'transform 0.55s cubic-bezier(0.4,0,0.2,1)',
  transformStyle: 'preserve-3d',
}

const face = {
  position: 'absolute',
  inset: 0,
  borderRadius: '8px',
  backfaceVisibility: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const back = {
  background: 'var(--surface)',
  border: '2px solid var(--accent2)',
  boxShadow: '0 4px 14px var(--shadow)',
}

const front = {
  background: 'var(--bg2)',
  transform: 'rotateY(180deg)',
  overflow: 'hidden',
  boxShadow: '0 4px 14px var(--shadow)',
}

const matchedOverlay = {
  position: 'absolute',
  inset: 0,
  background: 'rgba(0,0,0,0.15)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '8px',
}

const winBanner = {
  textAlign: 'center',
  background: 'var(--surface)',
  border: '2px solid var(--accent2)',
  borderRadius: '12px',
  padding: '1.5rem',
  marginBottom: '1.5rem',
  boxShadow: '0 6px 24px var(--shadow)',
}
