import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'

function fmt(s) { return `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}` }

const VinylPlayer = forwardRef(function VinylPlayer({ songs }, ref) {
  const [idx, setIdx]           = useState(1) // default Tum Hi Ho
  const [playing, setPlaying]   = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume]     = useState(0.75)
  const [expanded, setExpanded] = useState(false)
  const audioRef                = useRef(null)

  useImperativeHandle(ref, () => ({
    startPlaying() {
      const a = audioRef.current
      if (!a) return
      a.src = songs[1].src  // Tum Hi Ho
      a.load()
      a.volume = volume
      a.play().catch(() => {})
      setIdx(1)
      setPlaying(true)
    },
  }))

  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    a.volume = volume
    const wasPlaying = playing
    a.src = songs[idx].src
    a.load()
    if (wasPlaying) a.play().catch(() => {})
  }, [idx])

  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume }, [volume])

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
    a.currentTime = ((e.clientX - rect.left) / rect.width) * duration
  }

  const prev = () => setIdx(i => (i - 1 + songs.length) % songs.length)
  const next = () => { setIdx(i => (i + 1) % songs.length); setPlaying(true) }

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={e => setProgress(e.target.currentTime)}
        onLoadedMetadata={e => setDuration(e.target.duration)}
        onEnded={next}
      />

      <div style={wrap}>
        {/* Expanded panel */}
        {expanded && (
          <div style={panel}>
            {/* Spinning vinyl */}
            <div style={{ display:'flex', justifyContent:'center', margin:'0.6rem 0 0.8rem' }}>
              <div style={{ width:88, height:88, borderRadius:'50%', overflow:'hidden', boxShadow:'0 6px 24px rgba(0,0,0,0.5)', animation: playing ? 'spin 4s linear infinite' : 'none' }}>
                <VinylSVG />
              </div>
            </div>

            <div style={{ textAlign:'center', marginBottom:'0.8rem' }}>
              <div style={{ fontSize:'0.9rem', color:'var(--text)', fontWeight:400 }}>{songs[idx].title}</div>
              <div style={{ fontSize:'0.68rem', color:'var(--text2)', marginTop:'0.15rem', display:'flex', justifyContent:'space-between', padding:'0.15rem 0' }}>
                <span>{fmt(progress)}</span><span>{fmt(duration)}</span>
              </div>
            </div>

            {/* Seek */}
            <div onClick={seek} style={seekBar}>
              <div style={{ ...seekFill, width: duration ? `${(progress/duration)*100}%` : '0%' }} />
            </div>

            {/* Controls */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'0.6rem', margin:'0.9rem 0 0.5rem' }}>
              <Ctrl onClick={prev}><PrevSVG/></Ctrl>
              <Ctrl onClick={toggle} primary>{playing ? <PauseSVG/> : <PlaySVG/>}</Ctrl>
              <Ctrl onClick={next}><NextSVG/></Ctrl>
            </div>

            {/* Track list */}
            {songs.map((s, i) => (
              <div key={i} onClick={() => { setIdx(i); setPlaying(true) }} style={{
                ...track,
                background: i === idx ? 'var(--accent)' : 'transparent',
                color: i === idx ? '#fff' : 'var(--text)',
              }}>
                <span style={{ fontSize:'0.72rem', opacity:0.6, width:'1.1rem' }}>{i+1}</span>
                <span style={{ fontSize:'0.82rem' }}>{s.title}</span>
              </div>
            ))}

            {/* Volume */}
            <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginTop:'0.7rem' }}>
              <svg width="14" height="14" viewBox="0 0 14 14" style={{ flexShrink:0, color:'var(--text2)' }}>
                <path d="M1 4H5L9 1V13L5 10H1Z" fill="currentColor"/>
                <path d="M11 3.5C12.5 4.8 12.5 9.2 11 10.5" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
              </svg>
              <input type="range" min="0" max="1" step="0.01" value={volume}
                onChange={e => setVolume(+e.target.value)}
                style={{ flex:1, accentColor:'var(--accent)', height:'3px' }} />
            </div>
          </div>
        )}

        {/* Cassette button */}
        <button onClick={() => setExpanded(e => !e)} style={cassetteBtn} title={expanded ? 'Close player' : 'Music'}>
          <CassetteSVG spinning={playing} />
          {playing && <span style={dot} />}
        </button>
      </div>

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}} @keyframes reelSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </>
  )
})

export default VinylPlayer

function Ctrl({ onClick, children, primary }) {
  return (
    <button onClick={onClick} style={{
      background: primary ? 'var(--accent)' : 'rgba(255,255,255,0.08)',
      border:'none', cursor:'pointer', color: primary ? '#fff' : 'var(--text)',
      width: primary ? 40 : 32, height: primary ? 40 : 32,
      borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
      boxShadow: primary ? '0 3px 10px var(--shadow)' : 'none',
      flexShrink:0,
    }}>{children}</button>
  )
}

function VinylSVG() {
  return (
    <svg width="88" height="88" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="50" fill="#1a1a1a"/>
      {[44,37,30,23,16].map(r=><circle key={r} cx="50" cy="50" r={r} fill="none" stroke="#2d2d2d" strokeWidth="1.5"/>)}
      <circle cx="50" cy="50" r="14" fill="var(--accent)"/>
      <circle cx="50" cy="50" r="9" fill="#1a1a1a"/>
      <circle cx="50" cy="50" r="3.5" fill="var(--accent2)"/>
      <ellipse cx="44" cy="43" rx="4" ry="2.5" fill="rgba(255,255,255,0.12)"/>
    </svg>
  )
}

function CassetteSVG({ spinning }) {
  return (
    <svg width="46" height="34" viewBox="0 0 46 34">
      <rect x="1" y="1" width="44" height="32" rx="4" fill="#1c1c2e" stroke="var(--accent2)" strokeWidth="1"/>
      <rect x="6" y="5" width="34" height="16" rx="2" fill="#0d0d1a"/>
      {/* Reels */}
      <g style={{ transformOrigin:'16px 13px', animation: spinning ? 'reelSpin 1.2s linear infinite' : 'none' }}>
        <circle cx="16" cy="13" r="5.5" fill="none" stroke="#5a5a8a" strokeWidth="1.5"/>
        <circle cx="16" cy="13" r="2" fill="#5a5a8a"/>
        <line x1="16" y1="7.5" x2="16" y2="10" stroke="#5a5a8a" strokeWidth="1.2"/>
        <line x1="16" y1="16" x2="16" y2="18.5" stroke="#5a5a8a" strokeWidth="1.2"/>
        <line x1="10.5" y1="13" x2="13" y2="13" stroke="#5a5a8a" strokeWidth="1.2"/>
        <line x1="19" y1="13" x2="21.5" y2="13" stroke="#5a5a8a" strokeWidth="1.2"/>
      </g>
      <g style={{ transformOrigin:'30px 13px', animation: spinning ? 'reelSpin 1.2s linear infinite reverse' : 'none' }}>
        <circle cx="30" cy="13" r="5.5" fill="none" stroke="#5a5a8a" strokeWidth="1.5"/>
        <circle cx="30" cy="13" r="2" fill="#5a5a8a"/>
        <line x1="30" y1="7.5" x2="30" y2="10" stroke="#5a5a8a" strokeWidth="1.2"/>
        <line x1="30" y1="16" x2="30" y2="18.5" stroke="#5a5a8a" strokeWidth="1.2"/>
        <line x1="24.5" y1="13" x2="27" y2="13" stroke="#5a5a8a" strokeWidth="1.2"/>
        <line x1="33" y1="13" x2="35.5" y2="13" stroke="#5a5a8a" strokeWidth="1.2"/>
      </g>
      {/* Tape window gap */}
      <path d="M18 18 Q23 22 28 18" stroke="#3a3a5a" strokeWidth="2" fill="none"/>
      {/* Label */}
      <rect x="9" y="23" width="28" height="7" rx="1.5" fill="#2a2a4a"/>
      <line x1="11" y1="26" x2="35" y2="26" stroke="var(--accent)" strokeWidth="0.8" opacity="0.6"/>
      <line x1="11" y1="28" x2="30" y2="28" stroke="var(--accent2)" strokeWidth="0.5" opacity="0.4"/>
      {/* Holes */}
      <circle cx="4" cy="29" r="2" fill="#0d0d1a"/>
      <circle cx="42" cy="29" r="2" fill="#0d0d1a"/>
    </svg>
  )
}

const PlaySVG  = () => <svg width="15" height="15" viewBox="0 0 15 15"><polygon points="3,1 14,7.5 3,14" fill="currentColor"/></svg>
const PauseSVG = () => <svg width="15" height="15" viewBox="0 0 15 15"><rect x="2" y="1" width="4" height="13" rx="1" fill="currentColor"/><rect x="9" y="1" width="4" height="13" rx="1" fill="currentColor"/></svg>
const PrevSVG  = () => <svg width="13" height="13" viewBox="0 0 13 13"><rect x="1" y="1" width="2.5" height="11" rx="1" fill="currentColor"/><polygon points="12,1 4.5,6.5 12,12" fill="currentColor"/></svg>
const NextSVG  = () => <svg width="13" height="13" viewBox="0 0 13 13"><rect x="9.5" y="1" width="2.5" height="11" rx="1" fill="currentColor"/><polygon points="1,1 8.5,6.5 1,12" fill="currentColor"/></svg>

const wrap = {
  position:'fixed', bottom:'1.4rem', right:'1.4rem', zIndex:300,
  display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'0.75rem',
}

const cassetteBtn = {
  width:62, height:48, borderRadius:12,
  background:'var(--surface)',
  border:'1px solid rgba(255,255,255,0.1)',
  cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
  boxShadow:'0 4px 20px rgba(0,0,0,0.35)',
  position:'relative',
  backdropFilter:'blur(12px)',
  transition:'transform 0.15s',
}

const dot = {
  position:'absolute', top:6, right:6, width:7, height:7,
  borderRadius:'50%', background:'var(--accent)',
  boxShadow:'0 0 6px var(--accent)',
  animation:'pulse 1.5s ease-in-out infinite',
}

const panel = {
  background:'var(--surface)',
  border:'1px solid rgba(255,255,255,0.08)',
  borderRadius:16,
  padding:'0.9rem 1.1rem',
  width:240,
  boxShadow:'0 8px 40px rgba(0,0,0,0.4)',
  backdropFilter:'blur(16px)',
}

const seekBar = {
  height:4, background:'var(--bg2)', borderRadius:2,
  cursor:'pointer', position:'relative', overflow:'hidden',
}

const seekFill = {
  position:'absolute', top:0, left:0, height:'100%',
  background:'var(--accent)', borderRadius:2,
  transition:'width 0.2s linear',
}

const track = {
  display:'flex', alignItems:'center', gap:'0.6rem',
  padding:'0.4rem 0.55rem', borderRadius:8,
  cursor:'pointer', transition:'background 0.2s',
}
