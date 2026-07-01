import { useEffect, useState } from 'react'

function HeartSVG({ size = 18, color = 'var(--accent)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 18">
      <path d="M10 16 C10 16 1 10 1 5 C1 2 3 0.5 5 0.5 C7 0.5 8.5 1.8 10 3.5 C11.5 1.8 13 0.5 15 0.5 C17 0.5 19 2 19 5 C19 10 10 16 10 16Z" fill={color} />
    </svg>
  )
}

function FlowerSVG() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20">
      {[0,60,120,180,240,300].map((deg,i) => (
        <ellipse key={i} cx="10" cy="4.5" rx="2" ry="3.5" fill="var(--accent2)" opacity="0.75"
          transform={`rotate(${deg} 10 10)`} />
      ))}
      <circle cx="10" cy="10" r="3" fill="var(--accent)" />
    </svg>
  )
}

/* ─────────────────────────────────────────────
   Pinboard popup:
   Phase 0 → closed envelope
   Phase 1 (150ms) → flap lifts open
   Phase 2 (650ms) → paper slides up out of envelope
──────────────────────────────────────────────── */
function PinboardNote({ note, pinColor, onClose }) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 150)
    const t2 = setTimeout(() => setPhase(2), 650)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  // CSS `d` property transition works in all modern browsers (Chrome 88+, Firefox 97+)
  const flapD = phase >= 1
    ? 'M0 0 L150 -24 L300 0Z'
    : 'M0 0 L150 112 L300 0Z'

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={outerWrap}>

        {/* Close */}
        <button onClick={onClose} style={closeBtn}>×</button>

        {/* Stage — envelope + paper overlap here */}
        <div style={{ position: 'relative', height: 400, width: '100%' }}>

          {/* ── Paper note — slides up from inside envelope ── */}
          <div style={{
            position: 'absolute',
            left: '9%', right: '9%',
            bottom: phase >= 2 ? 195 : 14,
            zIndex: 2,
            opacity: phase >= 1 ? 1 : 0,
            transition: 'bottom 0.65s cubic-bezier(0.34,1.08,0.64,1) 0.05s, opacity 0.3s 0.35s',
          }}>
            {/* Lined paper texture lines */}
            <div style={paperCard}>
              <div style={paperLines}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} style={{ height: 1, background: 'rgba(0,0,0,0.06)', marginBottom: '1.1rem' }} />
                ))}
              </div>
              <div style={paperContent}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                  <FlowerSVG /><HeartSVG size={15} /><FlowerSVG />
                </div>
                <p style={noteText}>{note}</p>
                <div style={{ textAlign: 'center', marginTop: '0.75rem', display: 'flex', justifyContent: 'center', gap: '0.3rem' }}>
                  <HeartSVG size={11} color="var(--accent2)" />
                  <HeartSVG size={14} color="var(--accent)" />
                  <HeartSVG size={11} color="var(--accent2)" />
                </div>
              </div>
            </div>
          </div>

          {/* ── Envelope — sits at the bottom ── */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 3 }}>
            <svg
              viewBox="0 0 300 175"
              width="100%"
              style={{ display: 'block', filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.35))' }}
            >
              {/* Body */}
              <rect x="0" y="0" width="300" height="175" rx="7" fill="#fdf6e8" stroke="#ddd0aa" strokeWidth="1.5" />

              {/* Diagonal fold cross */}
              <line x1="0" y1="0" x2="300" y2="175" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
              <line x1="300" y1="0" x2="0" y2="175" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />

              {/* Side fold triangles */}
              <path d="M0 0 L150 100 L0 175Z"   fill="rgba(0,0,0,0.04)" />
              <path d="M300 0 L150 100 L300 175Z" fill="rgba(0,0,0,0.04)" />

              {/* Bottom V fold */}
              <path d="M0 175 L150 92 L300 175Z" fill="rgba(0,0,0,0.06)" />

              {/* Top flap — path animates via CSS d property */}
              <path
                d={flapD}
                fill="#f5ecd0"
                stroke="#ddd0aa"
                strokeWidth="1"
                style={{ transition: 'd 0.48s cubic-bezier(0.4,0,0.2,1)' }}
              />

              {/* Wax seal — only visible when closed */}
              {phase < 1 && (
                <g>
                  <circle cx="150" cy="105" r="17" fill={pinColor} opacity="0.88" />
                  <path d="M144 105 L150 99 L156 105 L150 111Z" fill="rgba(255,255,255,0.52)" />
                </g>
              )}

              {/* Stamp corner */}
              <rect x="254" y="11" width="32" height="22" rx="2"
                fill="#f8f0dc" stroke="#c5aa78" strokeWidth="0.8" strokeDasharray="2,1.5" />
            </svg>
          </div>
        </div>

      </div>
    </div>
  )
}

/* ── Game match popup ── */
function GameNote({ note, image, onClose }) {
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-box" onClick={e => e.stopPropagation()}>
        <button className="popup-close" onClick={onClose}>×</button>
        {image && (
          <img src={image} alt="" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', display: 'block' }} />
        )}
        <div style={{ padding: '1.3rem 1.5rem 1.6rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.35rem', marginBottom: '0.8rem' }}>
            <HeartSVG size={13} /><HeartSVG size={18} /><HeartSVG size={13} />
          </div>
          <p style={{ fontFamily: 'var(--font-note)', fontSize: '1.12rem', lineHeight: 1.7, color: 'var(--text)', textAlign: 'center', whiteSpace: 'pre-line' }}>
            {note}
          </p>
          <div style={{ textAlign: 'center', marginTop: '0.7rem', color: 'var(--accent2)', fontSize: '1.2rem' }}>♡</div>
        </div>
      </div>
    </div>
  )
}

export default function NotePopup({ type, note, image, pinColor, onClose }) {
  if (type === 'pinboard') return <PinboardNote note={note} pinColor={pinColor || '#8B6914'} onClose={onClose} />
  return <GameNote note={note} image={image} onClose={onClose} />
}

/* ── Styles ── */
const outerWrap = {
  position: 'relative',
  width: 'min(320px, 92vw)',
  margin: '0 auto',
}

const closeBtn = {
  position: 'absolute',
  top: '-2.2rem', right: 0,
  background: 'none', border: 'none',
  color: '#fff', fontSize: '1.7rem',
  cursor: 'pointer', lineHeight: 1, zIndex: 20,
}

const paperCard = {
  background: '#fffef9',
  borderRadius: '7px',
  boxShadow: '0 8px 28px rgba(0,0,0,0.18)',
  overflow: 'hidden',
  position: 'relative',
  border: '1px solid #e8ddc8',
}

const paperLines = {
  position: 'absolute',
  inset: 0,
  padding: '1rem 1rem 0',
  pointerEvents: 'none',
}

const paperContent = {
  position: 'relative',
  padding: '1rem 1.2rem 1.1rem',
  zIndex: 1,
}

const noteText = {
  fontFamily: 'var(--font-note)',
  fontSize: '1.05rem',
  lineHeight: 1.75,
  color: '#4a3020',
  textAlign: 'center',
}
