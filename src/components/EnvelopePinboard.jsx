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

// Brown / wood tones — 20 distinct shades from sandy to dark walnut
const PIN_COLORS = [
  '#C4A882', '#B8935A', '#A67C52', '#8B6914',
  '#9E7040', '#C19A6B', '#7B5B2E', '#8B4513',
  '#D2B48C', '#A0522D', '#6B4423', '#BF9B5A',
  '#8D6E63', '#795548', '#6D4C41', '#C8A97E',
  '#B07742', '#8A6240', '#9C7242', '#7A4F2C',
]

// Matching envelope body tones (cream/ivory family, distinct per row)
const ENV_COLORS = [
  '#fdf8f0', '#fef9f2', '#fffaf4', '#fdf7ee',
  '#fef8f1', '#fdfaf3', '#fff9f0', '#fdf6ec',
  '#fefaf2', '#fdf9f1', '#fffbf5', '#fdf8ee',
  '#fefaf3', '#fdf7ef', '#fffaf6', '#fdf8f2',
  '#fef9f3', '#fdf7f0', '#fffbf6', '#fdf9f4',
]

// Slightly muted/darkened shade for opened envelopes
const OPENED_ENV = '#ede3d4'

export default function EnvelopePinboard() {
  const items = useMemo(() => NOTES.map((note, i) => ({
    note, id: i,
    rotate: (Math.random() - 0.5) * 8,
    pinColor: PIN_COLORS[i % PIN_COLORS.length],
    envColor: ENV_COLORS[i % ENV_COLORS.length],
  })), [])

  const [popup, setPopup]   = useState(null)
  const [opened, setOpened] = useState(new Set())

  const open = (item) => {
    setPopup(item)
    setOpened(s => { const n = new Set(s); n.add(item.id); return n })
  }

  return (
    <div style={outer}>
      {/* Section heading */}
      <div style={{ textAlign: 'center', marginBottom: '1.4rem' }}>
        <h2 className="heading" style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)', color: 'var(--accent)' }}>
          Reasons Why I Love You
        </h2>
        <p style={{ fontSize: '0.78rem', color: 'var(--text2)', marginTop: '0.3rem', letterSpacing: '0.1em' }}>
          Click each to read
        </p>
      </div>

      <div style={boardWrap}>
        <div className="pinboard-grid">
          {items.map(item => {
            const isOpened = opened.has(item.id)
            return (
              <div
                key={item.id}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', paddingTop: 12 }}
              >
                <PushPin color={item.pinColor} />
                <div
                  onClick={() => open(item)}
                  style={{
                    ...cardBase,
                    background: isOpened ? OPENED_ENV : item.envColor,
                    transform: `rotate(${item.rotate}deg)`,
                    filter: isOpened ? 'brightness(0.93)' : 'none',
                    transition: 'transform 0.25s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s, filter 0.3s',
                  }}
                >
                  <EnvelopeFace
                    pinColor={item.pinColor}
                    isOpened={isOpened}
                    bg={isOpened ? OPENED_ENV : item.envColor}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {popup && (
        <NotePopup
          type="pinboard"
          note={popup.note}
          pinColor={popup.pinColor}
          onClose={() => setPopup(null)}
        />
      )}
    </div>
  )
}

/* ── Envelope face SVG ── */
function EnvelopeFace({ pinColor, isOpened, bg }) {
  return (
    <svg viewBox="0 0 140 88" width="100%" style={{ display: 'block', borderRadius: 3 }}>
      {/* Body */}
      <rect x="0" y="0" width="140" height="88" rx="4" fill={bg} stroke="rgba(0,0,0,0.1)" strokeWidth="1" />

      {/* Diagonal fold cross marks */}
      <line x1="0" y1="0" x2="140" y2="88" stroke="rgba(0,0,0,0.055)" strokeWidth="0.8" />
      <line x1="140" y1="0" x2="0" y2="88" stroke="rgba(0,0,0,0.055)" strokeWidth="0.8" />

      {/* Side triangular flaps */}
      <path d="M0 0 L70 54 L0 88Z"   fill="rgba(0,0,0,0.04)" />
      <path d="M140 0 L70 54 L140 88Z" fill="rgba(0,0,0,0.04)" />

      {/* Bottom V fold */}
      <path d="M0 88 L70 46 L140 88Z" fill="rgba(0,0,0,0.06)" />

      {/* Top flap */}
      <path
        d={isOpened
          ? 'M0 0 L70 -8 L140 0Z'
          : 'M0 0 L70 56 L140 0Z'
        }
        fill={isOpened ? 'rgba(0,0,0,0.07)' : 'rgba(0,0,0,0.05)'}
        stroke="rgba(0,0,0,0.09)"
        strokeWidth="0.7"
        style={{ transition: 'd 0.4s ease' }}
      />

      {/* Top flap lighter fill */}
      <path
        d={isOpened ? 'M0 0 L70 -8 L140 0Z' : 'M0 0 L70 56 L140 0Z'}
        fill={isOpened ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.18)'}
        style={{ transition: 'd 0.4s ease' }}
      />

      {/* Wax seal — only on unopened envelopes */}
      {!isOpened && (
        <g>
          <circle cx="70" cy="52" r="9.5" fill={pinColor} opacity="0.82" />
          <path d="M66.5 52 L70 48.5 L73.5 52 L70 55.5Z" fill="rgba(255,255,255,0.48)" />
        </g>
      )}

      {/* Tiny stamp rectangle top-right */}
      <rect x="116" y="7" width="17" height="12" rx="1.5"
        fill="rgba(255,255,255,0.4)" stroke="rgba(0,0,0,0.12)" strokeWidth="0.6" strokeDasharray="1.5,1" />
    </svg>
  )
}

/* ── Push pin — wood/brown tones ── */
function PushPin({ color }) {
  // Slightly lighter highlight for the pin head
  return (
    <svg
      width="16" height="28" viewBox="0 0 16 28"
      style={{
        position: 'absolute', top: -2, left: '50%', transform: 'translateX(-50%)', zIndex: 10,
        filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.42))',
      }}
    >
      {/* Pin head */}
      <circle cx="8" cy="6.5" r="6.5" fill={color} />
      {/* Glossy highlight */}
      <ellipse cx="5.5" cy="4" rx="2.2" ry="1.5" fill="rgba(255,255,255,0.3)" />
      {/* Shaft */}
      <rect x="7" y="12" width="2" height="13" rx="1" fill="#6b4a2a" />
      <polygon points="6.2,24 9.8,24 8,27.5" fill="#5a3b1e" />
    </svg>
  )
}

/* ── Layout styles ── */
const outer = {
  padding: '1.5rem max(1rem, 3vw) 4rem',
  position: 'relative', zIndex: 1,
}

const boardWrap = {
  background: 'var(--cork-texture)',
  backgroundColor: 'var(--cork)',
  borderRadius: 10,
  padding: 'clamp(1rem,2.5vw,1.6rem)',
  boxShadow: `
    inset 0 2px 8px rgba(0,0,0,0.28),
    0 8px 40px rgba(0,0,0,0.3),
    0 0 0 6px #8B6914,
    0 0 0 9px #6B4F10
  `,
}

const cardBase = {
  width: '100%',
  cursor: 'pointer',
  borderRadius: 4,
  boxShadow: '3px 5px 16px rgba(0,0,0,0.28), 1px 2px 4px rgba(0,0,0,0.14)',
  willChange: 'transform',
}
