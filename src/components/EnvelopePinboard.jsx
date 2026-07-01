import { useState, useMemo } from 'react'

const MESSAGES = [
  'You are the best thing that has ever happened to me.',
  'Every time I see you, I fall in love all over again.',
  'With you, every day is an adventure.',
  'You make ordinary moments feel magical.',
  'I love you more than words can say.',
  'You are my sunshine on the cloudiest days.',
  'Thank you for being you, always.',
  'My heart is yours, completely.',
  'You are the reason I smile.',
  'Together is my favourite place to be.',
]

const PIN_COLORS = ['#e53935', '#8e24aa', '#1e88e5', '#43a047', '#fb8c00']

export default function EnvelopePinboard({ images }) {
  const items = useMemo(() => images.map((src, i) => ({
    src, id: i,
    rotate: (Math.random() - 0.5) * 10,
    pinColor: PIN_COLORS[i % PIN_COLORS.length],
    msg: MESSAGES[i % MESSAGES.length],
    type: i % 3 === 2 ? 'photo' : 'envelope',
  })), [images])

  const [open, setOpen] = useState(null)

  return (
    <div style={boardOuter}>
      {/* Corkboard */}
      <div style={corkBoard}>
        {/* Board frame shadow */}
        <div style={boardInner}>
          {items.map(item => (
            <div key={item.id} style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
              {/* Push-pin SVG */}
              <PushPin color={item.pinColor} />

              <div
                onClick={() => setOpen(open === item.id ? null : item.id)}
                style={{
                  ...card,
                  transform: `rotate(${item.rotate}deg) ${open === item.id ? 'scale(1.05)' : ''}`,
                  boxShadow: open === item.id
                    ? '4px 10px 30px rgba(0,0,0,0.35), 2px 4px 8px rgba(0,0,0,0.2)'
                    : '3px 6px 18px rgba(0,0,0,0.25), 1px 2px 4px rgba(0,0,0,0.15)',
                  zIndex: open === item.id ? 50 : 1,
                  marginTop: '10px',
                }}
              >
                {item.type === 'photo' ? (
                  <img src={item.src} alt="" style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block', borderRadius: '2px 2px 0 0' }} />
                ) : (
                  <Envelope src={item.src} msg={item.msg} isOpen={open === item.id} />
                )}
                {item.type === 'photo' && (
                  <p style={{ padding: '0.55rem 0.65rem', fontSize: '0.72rem', fontStyle: 'italic', color: '#555', lineHeight: 1.4 }}>
                    {item.msg}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Envelope({ src, msg, isOpen }) {
  return (
    <div style={{ width: '100%', position: 'relative', overflow: 'hidden', background: '#fdf8f0', borderRadius: '3px', minHeight: '140px' }}>
      {/* Envelope body */}
      <svg viewBox="0 0 180 120" width="100%" style={{ display: 'block' }}>
        <rect x="0" y="0" width="180" height="120" rx="4" fill="#fdf8f0" stroke="#e0cfa0" strokeWidth="1.5" />
        {/* Bottom V flap */}
        <path d="M0 120 L90 65 L180 120Z" fill="#f5ecd0" stroke="#e0cfa0" strokeWidth="1" />
        {/* Side triangles */}
        <path d="M0 0 L90 65 L0 120Z" fill="#ede4c8" />
        <path d="M180 0 L90 65 L180 120Z" fill="#ede4c8" />
        {/* Top flap — open/closed */}
        <path
          d={isOpen ? "M0 0 L90 50 L180 0Z" : "M0 0 L90 65 L180 0Z"}
          fill="#f8f0dc"
          stroke="#e0cfa0"
          strokeWidth="1"
          style={{ transition: 'all 0.4s ease', transformOrigin: 'top', transform: isOpen ? 'rotateX(-180deg)' : 'rotateX(0deg)' }}
        />
        {/* Wax seal */}
        <circle cx="90" cy="70" r="12" fill="#c4507a" opacity="0.85" />
        <path d="M84 70 L90 64 L96 70 L90 76Z" fill="rgba(255,255,255,0.6)" />
      </svg>

      {/* Revealed content */}
      {isOpen && (
        <div style={{ padding: '0.6rem 0.8rem 0.8rem', textAlign: 'center' }}>
          <img src={src} alt="" style={{ width: '100%', height: '90px', objectFit: 'cover', borderRadius: '3px', marginBottom: '0.5rem' }} />
          <p style={{ fontSize: '0.7rem', fontStyle: 'italic', color: '#6b4a2a', lineHeight: 1.5 }}>{msg}</p>
        </div>
      )}
    </div>
  )
}

function PushPin({ color }) {
  return (
    <svg width="20" height="32" viewBox="0 0 20 32" style={{ position: 'absolute', top: '-6px', left: '50%', transform: 'translateX(-50%)', zIndex: 10, filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.4))' }}>
      {/* Pin head */}
      <circle cx="10" cy="8" r="8" fill={color} />
      <circle cx="7" cy="5" r="2.5" fill="rgba(255,255,255,0.4)" />
      {/* Pin shaft */}
      <rect x="9" y="14" width="2" height="16" rx="1" fill="#888" />
      <polygon points="8,28 12,28 10,32" fill="#666" />
    </svg>
  )
}

const boardOuter = {
  padding: '2rem max(1.5rem, 4vw)',
  position: 'relative',
  zIndex: 1,
}

const corkBoard = {
  background: 'var(--cork-texture)',
  backgroundColor: 'var(--cork)',
  borderRadius: '12px',
  padding: '2rem',
  boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3), 0 8px 40px rgba(0,0,0,0.3), 0 0 0 8px #8B6914, 0 0 0 10px #6B4F10',
  position: 'relative',
}

const boardInner = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
  gap: '2.5rem 2rem',
}

const card = {
  background: '#fff',
  borderRadius: '3px',
  width: '100%',
  cursor: 'pointer',
  transition: 'transform 0.3s cubic-bezier(.34,1.56,.64,1), box-shadow 0.3s',
  willChange: 'transform',
  position: 'relative',
}
