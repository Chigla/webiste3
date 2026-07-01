import { useState, useRef } from 'react'
import Petals from './Petals.jsx'
import Timer from './Timer.jsx'
import EnvelopePinboard from './EnvelopePinboard.jsx'
import MemoryGame from './MemoryGame.jsx'
import VinylPlayer from './VinylPlayer.jsx'

const SONGS = [
  { title: 'The Night We Met', src: '/songs/the night we met.mp3' },
  { title: 'Tum Hi Ho',        src: '/songs/tum hi ho.mp3' },
]

const IMAGES = Array.from({ length: 10 }, (_, i) => `/images/${i + 1}.jpg`)

const THEME_COLORS = { sakura: '#e8759a', velvet: '#c4507a', midnight: '#7b8cde' }

export default function MainApp({ theme, setTheme }) {
  const [layout, setLayout] = useState(null)
  const playerRef           = useRef(null)

  const choose = (l) => {
    setLayout(l)
    playerRef.current?.startPlaying()
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', position: 'relative', paddingBottom: layout ? '5rem' : '2rem' }}>
      <Petals theme={theme} />

      {!layout ? (
        /* ── Selection screen ── */
        <div style={selWrap}>
          {/* Timer */}
          <div style={{ marginBottom: '2rem' }}>
            <Timer />
          </div>

          {/* Theme switcher */}
          <div style={themeRow}>
            {Object.entries(THEME_COLORS).map(([t, color]) => (
              <button key={t} onClick={() => setTheme(t)} style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                background: theme === t ? color : 'var(--surface)',
                color: theme === t ? '#fff' : 'var(--text2)',
                border: `1px solid ${theme === t ? color : 'rgba(255,255,255,0.08)'}`,
                borderRadius: '999px', padding: '0.35rem 0.9rem',
                cursor: 'pointer', fontSize: '0.78rem', letterSpacing: '0.05em',
                fontFamily: 'var(--font-body)', transition: 'all 0.22s',
              }}>
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: color, flexShrink: 0, display: 'inline-block' }} />
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Layout cards */}
          <div style={cardRow}>
            <OptionCard
              title="Pinboard"
              desc="Open little notes on a corkboard"
              icon={<PinboardIcon />}
              onClick={() => choose('pinboard')}
            />
            <OptionCard
              title="Game"
              desc="Match pairs and reveal messages"
              icon={<GameIcon />}
              onClick={() => choose('game')}
            />
          </div>
        </div>
      ) : (
        /* ── Content screen ── */
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Top bar */}
          <div style={topBar}>
            <Timer />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {/* Theme dots */}
              <div style={{ display: 'flex', gap: '0.45rem' }}>
                {Object.entries(THEME_COLORS).map(([t, color]) => (
                  <button key={t} onClick={() => setTheme(t)} style={{
                    width: 13, height: 13, borderRadius: '50%', border: 'none',
                    background: color, cursor: 'pointer',
                    boxShadow: theme === t ? `0 0 0 2px var(--bg), 0 0 0 4px ${color}` : 'none',
                    transition: 'box-shadow 0.2s',
                  }} title={t} />
                ))}
              </div>
              {/* Layout tabs */}
              <div style={{ display: 'flex', gap: '0.35rem', background: 'var(--surface)', borderRadius: '999px', padding: '0.25rem' }}>
                {['pinboard', 'game'].map(l => (
                  <button key={l} onClick={() => setLayout(l)} style={{
                    background: layout === l ? 'var(--accent)' : 'transparent',
                    color: layout === l ? '#fff' : 'var(--text2)',
                    border: 'none', borderRadius: '999px',
                    padding: '0.28rem 0.75rem', cursor: 'pointer',
                    fontSize: '0.76rem', fontFamily: 'var(--font-body)',
                    letterSpacing: '0.04em', transition: 'all 0.22s',
                    textTransform: 'capitalize',
                  }}>{l}</button>
                ))}
              </div>
            </div>
          </div>

          {layout === 'pinboard' && <EnvelopePinboard />}
          {layout === 'game'     && <MemoryGame images={IMAGES} />}
        </div>
      )}

      <VinylPlayer ref={playerRef} songs={SONGS} />
    </div>
  )
}

function OptionCard({ title, desc, icon, onClick }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...optCard,
        transform: hover ? 'translateY(-6px) scale(1.02)' : 'translateY(0) scale(1)',
        boxShadow: hover ? '0 16px 48px var(--shadow)' : '0 4px 20px rgba(0,0,0,0.12)',
      }}
    >
      <div style={{ marginBottom: '1rem' }}>{icon}</div>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--accent)', marginBottom: '0.4rem' }}>{title}</div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text2)', lineHeight: 1.5, fontFamily: 'var(--font-body)' }}>{desc}</div>
    </button>
  )
}

function PinboardIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56">
      <rect x="4" y="4" width="48" height="48" rx="6" fill="var(--cork)" opacity="0.9"/>
      {[[14,14,'#e53935'],[28,10,'#1e88e5'],[42,16,'#43a047']].map(([x,y,c],i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="4" fill={c}/>
          <rect x={x-5} y={y} width="10" height="14" rx="1" fill="#fdf8f0"/>
        </g>
      ))}
      {[[18,34,'#8e24aa'],[36,30,'#fb8c00']].map(([x,y,c],i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="4" fill={c}/>
          <rect x={x-5} y={y} width="10" height="14" rx="1" fill="#fdf8f0"/>
        </g>
      ))}
    </svg>
  )
}

function GameIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56">
      {[[4,4],[30,4],[4,30],[30,30]].map(([x,y],i) => (
        <rect key={i} x={x} y={y} width="22" height="22" rx="4"
          fill={i%2===0 ? 'var(--accent)' : 'var(--accent2)'} opacity={i%2===0?0.9:0.5}/>
      ))}
      <path d="M15 15 L15 15" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round"/>
      <path d="M41 41 A6 6 0 1 1 41.01 41" stroke="rgba(255,255,255,0.6)" strokeWidth="2" fill="none"/>
    </svg>
  )
}

const selWrap = {
  minHeight: '100vh',
  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  padding: '2rem 1rem',
  position: 'relative', zIndex: 1, gap: '0',
}

const themeRow = {
  display: 'flex', gap: '0.5rem', marginBottom: '2.5rem', flexWrap: 'wrap', justifyContent: 'center',
}

const cardRow = {
  display: 'flex', gap: '1.2rem', flexWrap: 'wrap', justifyContent: 'center',
  width: '100%', maxWidth: '560px',
}

const optCard = {
  flex: '1 1 200px', minWidth: 0, maxWidth: '240px',
  background: 'var(--surface)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '20px', padding: '2rem 1.5rem',
  cursor: 'pointer', textAlign: 'center',
  transition: 'transform 0.25s cubic-bezier(.34,1.56,.64,1), box-shadow 0.25s',
  backdropFilter: 'blur(12px)',
}

const topBar = {
  position: 'relative', zIndex: 2,
  display: 'flex', flexDirection: 'column', alignItems: 'center',
  gap: '1rem', padding: '1.5rem 1rem 1rem',
}
