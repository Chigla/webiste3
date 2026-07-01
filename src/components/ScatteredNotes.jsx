import { useMemo, useState } from 'react'

const CAPTIONS = [
  'Every moment with you is a treasure 💌',
  'You are my favourite hello and hardest goodbye',
  'In your arms is where I belong',
  'You make every day brighter',
  'My heart chose you, always',
  'Forever isn\'t long enough with you',
  'You are home to me',
  'I fall for you, again and again',
  'You are my person',
  'Our love story is my favourite',
]

const COLORS = ['#fff9f9', '#fff5f0', '#f9fff5', '#f5f9ff', '#fff0f9', '#fffaf0', '#f5fff9', '#fdf5ff', '#fff8f0', '#f0f8ff']

export default function ScatteredNotes({ images }) {
  const notes = useMemo(() => images.map((src, i) => ({
    src, id: i,
    rotate: (Math.random() - 0.5) * 14,
    x: 40 + Math.random() * 60,
    y: 40 + Math.random() * 60,
    color: COLORS[i % COLORS.length],
    caption: CAPTIONS[i % CAPTIONS.length],
    zBase: Math.floor(Math.random() * 5),
  })), [images])

  const [lifted, setLifted] = useState(null)

  return (
    <div style={wrap}>
      {notes.map(n => (
        <div
          key={n.id}
          onMouseEnter={() => setLifted(n.id)}
          onMouseLeave={() => setLifted(null)}
          style={{
            ...noteStyle,
            background: n.color,
            transform: lifted === n.id
              ? `rotate(0deg) scale(1.06)`
              : `rotate(${n.rotate}deg)`,
            boxShadow: lifted === n.id
              ? '0 20px 50px rgba(0,0,0,0.22)'
              : '0 6px 20px rgba(0,0,0,0.13)',
            zIndex: lifted === n.id ? 100 : n.zBase + 1,
            transition: 'transform 0.3s cubic-bezier(.34,1.56,.64,1), box-shadow 0.3s, z-index 0s',
          }}
        >
          {/* Tape strip at top */}
          <div style={tape} />
          <img
            src={n.src}
            alt=""
            style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block', borderRadius: '2px 2px 0 0' }}
          />
          <p style={caption}>{n.caption}</p>
        </div>
      ))}
    </div>
  )
}

const wrap = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  gap: '2.5rem 2rem',
  padding: '2rem max(2rem, 5vw) 3rem',
  position: 'relative',
  zIndex: 1,
}

const noteStyle = {
  borderRadius: '3px',
  padding: '0',
  cursor: 'pointer',
  position: 'relative',
  willChange: 'transform',
}

const tape = {
  position: 'absolute',
  top: '-14px',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '50px',
  height: '22px',
  background: 'rgba(255,240,150,0.7)',
  backdropFilter: 'blur(2px)',
  borderRadius: '2px',
  zIndex: 2,
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
}

const caption = {
  padding: '0.7rem 0.85rem 0.9rem',
  fontSize: '0.78rem',
  color: '#555',
  fontFamily: 'var(--font-body)',
  lineHeight: 1.5,
  fontStyle: 'italic',
}
