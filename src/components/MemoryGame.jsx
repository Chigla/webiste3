import { useState, useEffect, useCallback } from 'react'
import NotePopup from './NotePopup.jsx'

// 10 notes revealed when each pair is matched
const GAME_NOTES = [
  "If I were to close my eyes forever, I would choose your eyes as my last view.",
  "Among many perfections, you have problems few... though it cannot stop my heart to gravitate towards you.",
  "त्यो महा कस्तो महा, जुन मा मिठास छैन...\nत्यो महा कस्तो महा, जुन मा मिठास छैन...\nत्यो धर्ती कस्तो धर्ती, जुन मा तिमी छैन।",
  "I would walk a million miles just to see you smile.",
  "सुन्दर त्यो साँझ, घाम को किरण ले सजाएको...\nमखमली तिम्रो हासो ले, सुन्दरता बढाइदेको।",
  "जति बाधा आए पनि, तिमी संगै बाँच्न पाउँ...\nयो जुनि मात्र होइन, ७ जुनि तिमी संगै बिताउन पाउँ।",
  "तिम्रो माया को सागर हो म, तिमी मेरो किनारा हो...\nजति टाढा भए पनि, मेरो उद्देश्य तिमीलाई भेट्ने हो।",
  "चन्द्रमाको किरण संगै, तिम्रो याद झुल्किन्छ...\nमेरो मनको भित्र, तिम्रो नाम धड्कन्छ।",
  "My eyes long to see you, my arms long to hold you, and I long to spend my life with you.",
  "The greatest flex in my life? That's you.",
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Detect if note uses Devanagari
function isDevanagari(text) {
  return /[ऀ-ॿ]/.test(text)
}

export default function MemoryGame({ images }) {
  const [cards, setCards]     = useState([])
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState(new Set())
  const [moves, setMoves]     = useState(0)
  const [popup, setPopup]     = useState(null)   // { note, image }
  const [win, setWin]         = useState(false)
  const [locked, setLocked]   = useState(false)

  const init = useCallback(() => {
    const deck = shuffle(
      images.flatMap((src, i) => [
        { src, pairId: i, id: `${i}-a` },
        { src, pairId: i, id: `${i}-b` },
      ])
    )
    setCards(deck)
    setFlipped([])
    setMatched(new Set())
    setMoves(0)
    setWin(false)
    setLocked(false)
    setPopup(null)
  }, [images.join()])

  useEffect(() => { init() }, [init])

  useEffect(() => {
    if (flipped.length !== 2) return
    setLocked(true)
    setMoves(m => m + 1)
    const [a, b] = flipped
    if (cards[a].pairId === cards[b].pairId) {
      const pairId = cards[a].pairId
      setTimeout(() => {
        setMatched(prev => {
          const next = new Set(prev)
          next.add(cards[a].id)
          next.add(cards[b].id)
          if (next.size === cards.length) setWin(true)
          return next
        })
        setFlipped([])
        setLocked(false)
        // show popup for this pair
        setPopup({ note: GAME_NOTES[pairId % GAME_NOTES.length], image: cards[a].src })
      }, 400)
    } else {
      setTimeout(() => { setFlipped([]); setLocked(false) }, 900)
    }
  }, [flipped])

  const flip = (i) => {
    if (locked) return
    if (flipped.length === 2) return
    if (flipped.includes(i)) return
    if (matched.has(cards[i].id)) return
    setFlipped(f => [...f, i])
  }

  const isVisible = (i) => flipped.includes(i) || matched.has(cards[i]?.id)

  return (
    <div style={{ padding:'1rem max(1rem,3vw) 5rem', position:'relative', zIndex:1 }}>
      {/* Header */}
      <div style={{ textAlign:'center', marginBottom:'1.2rem' }}>
        <h2 className="heading" style={{ fontSize:'clamp(1.6rem,5vw,2.4rem)', color:'var(--accent)' }}>
          Memory Matching
        </h2>
        <p style={{ fontSize:'0.8rem', color:'var(--text2)', marginTop:'0.2rem' }}>
          Find matching pairs to see a note &nbsp;·&nbsp; {moves} moves
        </p>
      </div>

      {win && (
        <div style={winBox}>
          <p style={{ fontFamily:'var(--font-heading)', fontSize:'2rem', color:'var(--accent)' }}>You did it! ♡</p>
          <p style={{ fontSize:'0.82rem', color:'var(--text2)', marginTop:'0.3rem' }}>Completed in {moves} moves</p>
          <button className="btn" onClick={init} style={{ marginTop:'0.8rem', fontSize:'0.85rem', padding:'0.45rem 1.2rem' }}>Play Again</button>
        </div>
      )}

      {/* 4×5 grid */}
      <div style={grid}>
        {cards.map((card, i) => (
          <div key={card.id} onClick={() => flip(i)} style={{ perspective:'700px', cursor: matched.has(card.id) ? 'default' : 'pointer' }}>
            <div style={{
              ...inner,
              transform: isVisible(i) ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}>
              {/* Back */}
              <div style={{ ...face, ...back }}>
                <svg width="28" height="26" viewBox="0 0 28 26">
                  <path d="M14 23C14 23 2 14 2 7C2 3 5 1 8 1C11 1 13 3 14 5.5C15 3 17 1 20 1C23 1 26 3 26 7C26 14 14 23 14 23Z" fill="var(--accent)" opacity="0.45"/>
                </svg>
              </div>
              {/* Front */}
              <div style={{ ...face, ...front }}>
                <img src={card.src} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'8px', display:'block' }}/>
                {matched.has(card.id) && (
                  <div style={matchOverlay}>
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="11" fill="rgba(255,255,255,0.88)"/>
                      <path d="M6 12L10 16L18 8" stroke="var(--accent)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {popup && (
        <NotePopup
          type="game"
          note={popup.note}
          image={popup.image}
          onClose={() => setPopup(null)}
        />
      )}

      {/* Override note font for Devanagari notes in popup */}
      <style>{`
        .popup-box p[data-dev="true"] {
          font-family: var(--font-dev) !important;
          white-space: pre-line;
          font-size: 1rem !important;
        }
      `}</style>
    </div>
  )
}

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: 'clamp(0.4rem,2vw,0.75rem)',
  maxWidth: '600px',
  margin: '0 auto',
}

const inner = {
  position:'relative', width:'100%', paddingTop:'100%',
  transition:'transform 0.5s cubic-bezier(0.4,0,0.2,1)',
  transformStyle:'preserve-3d',
}

const face = {
  position:'absolute', inset:0, borderRadius:'8px',
  backfaceVisibility:'hidden',
  display:'flex', alignItems:'center', justifyContent:'center',
}

const back = {
  background:'var(--surface)',
  border:'1.5px solid var(--accent2)',
  boxShadow:'0 3px 12px var(--shadow)',
}

const front = {
  transform:'rotateY(180deg)',
  overflow:'hidden',
  boxShadow:'0 3px 12px var(--shadow)',
}

const matchOverlay = {
  position:'absolute', inset:0, background:'rgba(0,0,0,0.18)',
  display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'8px',
}

const winBox = {
  textAlign:'center', background:'var(--surface)',
  border:'1.5px solid var(--accent2)', borderRadius:'14px',
  padding:'1.4rem', marginBottom:'1.2rem',
  boxShadow:'0 6px 24px var(--shadow)',
}
