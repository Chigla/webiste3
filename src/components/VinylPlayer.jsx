import { useState, useRef, useEffect } from 'react'

export default function VinylPlayer({ songs }) {
  const [idx, setIdx]         = useState(0)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume]   = useState(0.7)
  const [expanded, setExpanded] = useState(false)
  const audioRef = useRef(null)

  const song = songs[idx]

  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    a.volume = volume
    a.src = song.src
    a.load()
    if (playing) a.play().catch(() => {})
  }, [idx])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  const toggle = () => {
    const a = audioRef.current
    if (!a) return
    if (playing) { a.pause(); setPlaying(false) }
    else { a.play().catch(() => {}); setPlaying(true) }
  }

  const seek = (e) => {
    const a = audioRef.current
    if (!a || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    a.currentTime = ratio * duration
  }

  const prev = () => { setIdx(i => (i - 1 + songs.length) % songs.length); setPlaying(true) }
  const next = () => { setIdx(i => (i + 1) % songs.length); setPlaying(true) }

  const fmt = (s) => `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={e => setProgress(e.target.currentTime)}
        onLoadedMetadata={e => setDuration(e.target.duration)}
        onEnded={next}
      />

      {/* Collapsed pill / expanded player */}
      <div style={{ ...playerWrap, height: expanded ? 'auto' : '64px', overflow: 'hidden' }}>
        {/* Always-visible row */}
        <div style={topRow}>
          {/* Mini vinyl disc */}
          <div
            style={{
              ...vinyl,
              animation: playing ? 'spin 4s linear infinite' : 'none',
            }}
          >
            <VinylSVG />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={songTitle}>{song.title}</div>
            {expanded && (
              <div style={timeRow}>
                <span>{fmt(progress)}</span>
                <span>{fmt(duration)}</span>
              </div>
            )}
          </div>

          {/* Controls */}
          <div style={controls}>
            <IconBtn onClick={prev} title="Previous"><PrevSVG /></IconBtn>
            <IconBtn onClick={toggle} primary title={playing ? 'Pause' : 'Play'}>
              {playing ? <PauseSVG /> : <PlaySVG />}
            </IconBtn>
            <IconBtn onClick={next} title="Next"><NextSVG /></IconBtn>
          </div>

          <IconBtn onClick={() => setExpanded(e => !e)} title="Expand">
            <ChevronSVG up={expanded} />
          </IconBtn>
        </div>

        {/* Expanded area */}
        {expanded && (
          <div style={{ padding: '0 1.2rem 1rem' }}>
            {/* Seek bar */}
            <div onClick={seek} style={seekBar}>
              <div style={{ ...seekFill, width: duration ? `${(progress/duration)*100}%` : '0%' }} />
            </div>

            {/* Large vinyl */}
            <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
              <div style={{
                ...vinylLarge,
                animation: playing ? 'spin 4s linear infinite' : 'none',
              }}>
                <VinylSVG large />
              </div>
            </div>

            {/* Song list */}
            <div style={{ marginTop: '0.75rem' }}>
              {songs.map((s, i) => (
                <div
                  key={i}
                  onClick={() => { setIdx(i); setPlaying(true) }}
                  style={{
                    ...trackRow,
                    background: i === idx ? 'var(--accent)' : 'transparent',
                    color: i === idx ? '#fff' : 'var(--text)',
                  }}
                >
                  {i === idx && playing
                    ? <PlayingDots />
                    : <span style={{ fontSize: '0.75rem', opacity: 0.6, width: '1.2rem' }}>{i+1}</span>
                  }
                  <span style={{ fontSize: '0.85rem' }}>{s.title}</span>
                </div>
              ))}
            </div>

            {/* Volume */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.8rem' }}>
              <VolumeSVG />
              <input
                type="range" min="0" max="1" step="0.01" value={volume}
                onChange={e => setVolume(Number(e.target.value))}
                style={{ flex: 1, accentColor: 'var(--accent)' }}
              />
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </>
  )
}

function IconBtn({ onClick, children, primary, title }) {
  return (
    <button onClick={onClick} title={title} style={{
      background: primary ? 'var(--accent)' : 'transparent',
      border: 'none', cursor: 'pointer',
      color: primary ? '#fff' : 'var(--text)',
      width: primary ? '38px' : '30px',
      height: primary ? '38px' : '30px',
      borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: primary ? '0 3px 10px var(--shadow)' : 'none',
      transition: 'transform 0.15s',
      flexShrink: 0,
    }}>
      {children}
    </button>
  )
}

function PlayingDots() {
  return (
    <span style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: '14px', width: '1.2rem' }}>
      {[0,1,2].map(i => (
        <span key={i} style={{
          display: 'inline-block', width: '3px', background: '#fff', borderRadius: '1px',
          animation: `bounce 0.9s ease-in-out ${i*0.2}s infinite alternate`,
          height: `${6 + i*3}px`,
        }} />
      ))}
      <style>{`@keyframes bounce { from{transform:scaleY(0.4)} to{transform:scaleY(1)} }`}</style>
    </span>
  )
}

function VinylSVG({ large }) {
  const s = large ? 120 : 42
  return (
    <svg width={s} height={s} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="50" fill="#1a1a1a" />
      {[44,37,30,23,16].map(r => <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="#2d2d2d" strokeWidth="1.5" />)}
      <circle cx="50" cy="50" r="12" fill="var(--accent)" />
      <circle cx="50" cy="50" r="8" fill="#1a1a1a" />
      <circle cx="50" cy="50" r="3" fill="var(--accent2)" />
      {/* Label glare */}
      <ellipse cx="44" cy="44" rx="4" ry="2.5" fill="rgba(255,255,255,0.15)" />
    </svg>
  )
}

/* SVG icons */
const PlaySVG  = () => <svg width="16" height="16" viewBox="0 0 16 16"><polygon points="4,2 14,8 4,14" fill="currentColor"/></svg>
const PauseSVG = () => <svg width="16" height="16" viewBox="0 0 16 16"><rect x="3" y="2" width="4" height="12" rx="1" fill="currentColor"/><rect x="9" y="2" width="4" height="12" rx="1" fill="currentColor"/></svg>
const PrevSVG  = () => <svg width="14" height="14" viewBox="0 0 14 14"><rect x="1" y="1" width="3" height="12" rx="1" fill="currentColor"/><polygon points="13,1 5,7 13,13" fill="currentColor"/></svg>
const NextSVG  = () => <svg width="14" height="14" viewBox="0 0 14 14"><rect x="10" y="1" width="3" height="12" rx="1" fill="currentColor"/><polygon points="1,1 9,7 1,13" fill="currentColor"/></svg>
const ChevronSVG = ({ up }) => <svg width="14" height="14" viewBox="0 0 14 14"><path d={up ? "M2 9 L7 4 L12 9" : "M2 5 L7 10 L12 5"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/></svg>
const VolumeSVG = () => <svg width="16" height="16" viewBox="0 0 16 16" style={{flexShrink:0,color:'var(--text2)'}}><path d="M2 5 H6 L10 2 V14 L6 11 H2Z" fill="currentColor"/><path d="M12 4 C14 5.5 14 10.5 12 12" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>

const playerWrap = {
  position: 'fixed',
  bottom: '1.2rem',
  left: '50%',
  transform: 'translateX(-50%)',
  width: 'min(480px, 94vw)',
  background: 'var(--surface)',
  borderRadius: '18px',
  boxShadow: '0 8px 40px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.06)',
  backdropFilter: 'blur(16px)',
  zIndex: 200,
  transition: 'height 0.3s ease',
}

const topRow = {
  display: 'flex', alignItems: 'center', gap: '0.75rem',
  padding: '0.7rem 1rem',
}

const vinyl = {
  flexShrink: 0,
  width: '42px', height: '42px',
  borderRadius: '50%',
  overflow: 'hidden',
}

const vinylLarge = {
  width: '120px', height: '120px',
  borderRadius: '50%',
  overflow: 'hidden',
  boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
}

const songTitle = {
  fontSize: '0.88rem',
  fontWeight: 400,
  color: 'var(--text)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}

const controls = { display: 'flex', alignItems: 'center', gap: '0.3rem' }

const timeRow = {
  display: 'flex', justifyContent: 'space-between',
  fontSize: '0.7rem', color: 'var(--text2)', marginTop: '0.15rem',
}

const seekBar = {
  height: '4px', background: 'var(--bg2)',
  borderRadius: '2px', cursor: 'pointer',
  position: 'relative', overflow: 'hidden',
}

const seekFill = {
  position: 'absolute', top: 0, left: 0, height: '100%',
  background: 'var(--accent)', borderRadius: '2px',
  transition: 'width 0.2s linear',
}

const trackRow = {
  display: 'flex', alignItems: 'center', gap: '0.75rem',
  padding: '0.45rem 0.65rem', borderRadius: '8px',
  cursor: 'pointer', transition: 'background 0.2s',
}
