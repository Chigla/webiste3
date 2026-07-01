import { useState, useMemo } from 'react'
import NotePopup from './NotePopup.jsx'

const NOTES = [
  "I love your smile, it makes me smile too hehe",
  "I love when you take care of me like im your baby",
  "I love the way you have always been my greatest supporter",
  "I love when you get as excited as me in my wins (you are right as im typing this too hehe)",
  "I love your hair",
  "I love your body",
  "I love how good of a mother you are going to be",
  "I love the way you respect elders",
  "I love the way you love and care about little kids",
  "I love how you pretend to find my humor funny",
  "I love how you catch my vocab within days and become a mini me",
  "I love how you love god",
  "I love the way you dream of marrying me and starting a life",
  "I love that you love hiking and travelling too",
  "I love how appreciative you are of everything i do",
  "I love how you share things with me",
  "I love how good of a dancer you are",
  "I love your passion in cooking",
  "I love the way you respect me and my family",
  "I love the way you make love to me",
]

const PIN_COLORS = ['#e53935','#8e24aa','#1e88e5','#43a047','#fb8c00','#00acc1','#d81b60','#6d4c41']
const ENV_COLORS = ['#fdf8f0','#fef0f4','#f0f4fe','#f0fef4','#fdf5ff','#fff8f0','#f5fff9','#f0f8ff']

export default function EnvelopePinboard() {
  const items = useMemo(() => NOTES.map((note, i) => ({
    note, id: i,
    rotate: (Math.random() - 0.5) * 11,
    pinColor: PIN_COLORS[i % PIN_COLORS.length],
    envColor: ENV_COLORS[i % ENV_COLORS.length],
  })), [])

  const [popup, setPopup] = useState(null)

  return (
    <div style={outer}>
      <div style={board}>
        <div style={grid}>
          {items.map(item => (
            <div key={item.id} style={{ display:'flex', flexDirection:'column', alignItems:'center', position:'relative', paddingTop:'10px' }}>
              <PushPin color={item.pinColor} />
              <div
                onClick={() => setPopup(item)}
                style={{
                  ...card,
                  background: item.envColor,
                  transform: `rotate(${item.rotate}deg)`,
                  boxShadow: '3px 6px 18px rgba(0,0,0,0.28), 1px 2px 4px rgba(0,0,0,0.15)',
                }}
              >
                <EnvelopeBody color={item.pinColor} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {popup && (
        <NotePopup
          type="pinboard"
          note={popup.note}
          onClose={() => setPopup(null)}
        />
      )}
    </div>
  )
}

function EnvelopeBody({ color }) {
  return (
    <svg viewBox="0 0 140 90" width="100%" style={{ display:'block', borderRadius:'3px' }}>
      <rect x="0" y="0" width="140" height="90" rx="4" fill="inherit"/>
      {/* sides */}
      <path d="M0 0 L70 55 L0 90Z" fill="rgba(0,0,0,0.05)"/>
      <path d="M140 0 L70 55 L140 90Z" fill="rgba(0,0,0,0.05)"/>
      {/* bottom V */}
      <path d="M0 90 L70 50 L140 90Z" fill="rgba(0,0,0,0.07)"/>
      {/* top flap */}
      <path d="M0 0 L70 58 L140 0Z" fill="rgba(0,0,0,0.04)" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5"/>
      {/* wax seal */}
      <circle cx="70" cy="60" r="10" fill={color} opacity="0.85"/>
      <path d="M65 60 L70 55 L75 60 L70 65Z" fill="rgba(255,255,255,0.5)"/>
    </svg>
  )
}

function PushPin({ color }) {
  return (
    <svg width="18" height="30" viewBox="0 0 18 30"
      style={{ position:'absolute', top:'-2px', left:'50%', transform:'translateX(-50%)', zIndex:10,
               filter:'drop-shadow(0 2px 3px rgba(0,0,0,0.45))' }}>
      <circle cx="9" cy="7" r="7" fill={color}/>
      <circle cx="6.5" cy="4.5" r="2" fill="rgba(255,255,255,0.35)"/>
      <rect x="8" y="13" width="2" height="15" rx="1" fill="#777"/>
      <polygon points="7,27 11,27 9,30" fill="#555"/>
    </svg>
  )
}

const outer = { padding:'1.5rem max(1rem,3vw) 4rem', position:'relative', zIndex:1 }

const board = {
  background: 'var(--cork-texture)',
  backgroundColor: 'var(--cork)',
  borderRadius: '10px',
  padding: 'clamp(1rem,3vw,1.8rem)',
  boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3), 0 8px 40px rgba(0,0,0,0.3), 0 0 0 6px #8B6914, 0 0 0 8px #6B4F10',
}

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
  gap: 'clamp(1.5rem,4vw,2.5rem) clamp(1rem,3vw,2rem)',
}

const card = {
  width: '100%',
  cursor: 'pointer',
  borderRadius: '4px',
  transition: 'transform 0.25s cubic-bezier(.34,1.56,.64,1), box-shadow 0.25s',
  willChange: 'transform',
}
