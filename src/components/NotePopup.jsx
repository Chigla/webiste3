import { useEffect, useState } from 'react'

/* ── Small SVG decorations ── */
function HeartSVG({ size = 18, color = 'var(--accent)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 18">
      <path d="M10 16 C10 16 1 10 1 5 C1 2 3 0.5 5 0.5 C7 0.5 8.5 1.8 10 3.5 C11.5 1.8 13 0.5 15 0.5 C17 0.5 19 2 19 5 C19 10 10 16 10 16Z" fill={color} />
    </svg>
  )
}

function FlowerSVG() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20">
      {[0,60,120,180,240,300].map((deg,i) => (
        <ellipse key={i} cx="10" cy="4.5" rx="2" ry="3.5" fill="var(--accent2)" opacity="0.7"
          transform={`rotate(${deg} 10 10)`} />
      ))}
      <circle cx="10" cy="10" r="3" fill="var(--accent)" />
    </svg>
  )
}

/* ── Pinboard note popup — envelope style ── */
function PinboardNote({ note, onClose }) {
  const [open, setOpen] = useState(false)
  useEffect(() => { const t = setTimeout(() => setOpen(true), 200); return () => clearTimeout(t) }, [])

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-box" onClick={e => e.stopPropagation()} style={{ background: 'none', boxShadow: 'none', overflow: 'visible' }}>
        <button className="popup-close" onClick={onClose} style={{ color: '#fff', top: '-2rem', right: 0 }}>×</button>

        {/* Envelope shell */}
        <div style={envWrap}>
          {/* Envelope body */}
          <svg viewBox="0 0 300 180" width="100%" style={{ display: 'block', borderRadius: '8px 8px 0 0' }}>
            <rect x="0" y="0" width="300" height="180" rx="6" fill="#fdf6e8" stroke="#ddd0aa" strokeWidth="1.5" />
            <path d="M0 180 L150 100 L300 180Z" fill="#f5ecd0" stroke="#ddd0aa" strokeWidth="1" />
            <path d="M0 0 L150 100 L0 180Z" fill="#eee4c8" />
            <path d="M300 0 L150 100 L300 180Z" fill="#eee4c8" />
            {/* Top flap */}
            <path
              d={open ? "M0 0 Q150 -30 300 0 L150 70Z" : "M0 0 Q150 30 300 0 L150 100Z"}
              fill="#f8f0dc" stroke="#ddd0aa" strokeWidth="1"
              style={{ transition: 'all 0.5s cubic-bezier(0.4,0,0.2,1)', transformOrigin: 'top' }}
            />
            {/* Wax seal */}
            <circle cx="150" cy="115" r="16" fill="var(--accent)" opacity="0.9" />
            <path d="M143 115 L150 108 L157 115 L150 122Z" fill="rgba(255,255,255,0.55)" />
          </svg>

          {/* Note paper that slides out */}
          <div style={{
            ...notePaper,
            transform: open ? 'translateY(0)' : 'translateY(80px)',
            opacity: open ? 1 : 0,
            transition: 'all 0.55s cubic-bezier(0.34,1.2,0.64,1) 0.35s',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.9rem' }}>
              <FlowerSVG />
              <HeartSVG size={16} />
              <FlowerSVG />
            </div>
            <p style={noteText}>{note}</p>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
              <HeartSVG size={14} color="var(--accent2)" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Game match popup — revealed note ── */
function GameNote({ note, image, onClose }) {
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-box" onClick={e => e.stopPropagation()}>
        <button className="popup-close" onClick={onClose}>×</button>

        {image && (
          <img src={image} alt="" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', display: 'block' }} />
        )}

        <div style={{ padding: '1.4rem 1.6rem 1.8rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', marginBottom: '0.9rem' }}>
            <HeartSVG size={14} />
            <HeartSVG size={18} />
            <HeartSVG size={14} />
          </div>
          <p style={{ ...noteText, color: 'var(--text)', textAlign: 'center', fontFamily: 'var(--font-note)', fontSize: '1.15rem' }}>{note}</p>
          <div style={{ textAlign: 'center', marginTop: '0.8rem', fontSize: '1.3rem', color: 'var(--accent2)' }}>♡</div>
        </div>
      </div>
    </div>
  )
}

export default function NotePopup({ type, note, image, onClose }) {
  if (type === 'pinboard') return <PinboardNote note={note} onClose={onClose} />
  return <GameNote note={note} image={image} onClose={onClose} />
}

const envWrap = {
  background: '#fdf6e8',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
  maxWidth: '360px',
  margin: '0 auto',
}

const notePaper = {
  background: '#fffdf7',
  margin: '0 1.2rem 1.2rem',
  borderRadius: '6px',
  padding: '1.2rem 1.4rem',
  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  borderTop: '1px solid #e8ddc8',
}

const noteText = {
  fontFamily: 'var(--font-note)',
  fontSize: '1.1rem',
  lineHeight: 1.7,
  color: '#4a3728',
  textAlign: 'center',
}
