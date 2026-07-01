import { useState, useEffect, useRef } from 'react'
import Petals from './Petals.jsx'

const GREETINGS = [
  { word: 'I love you',                    font: 'var(--font-heading)', size: 'clamp(3rem,10vw,6.5rem)' },
  { word: 'Aishiteru',                     font: 'var(--font-heading)', size: 'clamp(3rem,10vw,6.5rem)' },
  { word: 'Saranghae',                     font: 'var(--font-heading)', size: 'clamp(3rem,10vw,6.5rem)' },
  { word: 'म तिमीलाई माया गर्छु',          font: 'var(--font-dev)',     size: 'clamp(1.8rem,6vw,3.8rem)', letterSpacing: '0.06em' },
]

const THEME_COLORS = { sakura: '#e8759a', velvet: '#c4507a', midnight: '#7b8cde' }

export default function GreetingScreen({ onEnter, theme, setTheme }) {
  const [idx, setIdx]   = useState(0)
  const [fade, setFade] = useState(true)
  const countRef        = useRef(0)

  useEffect(() => {
    const t = setTimeout(() => {
      setFade(false)
      setTimeout(() => {
        countRef.current += 1
        if (countRef.current >= GREETINGS.length) {
          onEnter()
        } else {
          setIdx(countRef.current)
          setFade(true)
        }
      }, 500)
    }, 2600)
    return () => clearTimeout(t)
  }, [idx])

  const g = GREETINGS[idx]

  return (
    <div style={screen}>
      <Petals theme={theme} />

      {/* Theme dots — top right */}
      <div style={dots}>
        {Object.entries(THEME_COLORS).map(([t, color]) => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            style={{
              width: 14, height: 14, borderRadius: '50%', border: 'none',
              background: color, cursor: 'pointer',
              boxShadow: theme === t ? `0 0 0 2px #fff, 0 0 0 4px ${color}` : 'none',
              transition: 'box-shadow 0.2s',
            }}
          />
        ))}
      </div>

      <div style={center}>
        {/* Heart SVG */}
        <svg width="72" height="64" viewBox="0 0 90 80" style={{ marginBottom: '2rem', filter: 'drop-shadow(0 4px 18px var(--shadow))' }}>
          <path d="M45 70 C45 70 5 45 5 22 C5 10 13 3 22 3 C31 3 38 9 45 17 C52 9 59 3 68 3 C77 3 85 10 85 22 C85 45 45 70 45 70Z" fill="var(--accent)" />
          <path d="M28 16 C24 16 20 20 20 25" stroke="rgba(255,255,255,0.45)" strokeWidth="3" strokeLinecap="round" fill="none" />
        </svg>

        {/* Greeting text */}
        <div style={{
          fontFamily: g.font,
          fontSize: g.size,
          letterSpacing: g.letterSpacing || 'normal',
          color: 'var(--accent)',
          opacity: fade ? 1 : 0,
          transition: 'opacity 0.5s ease',
          textAlign: 'center',
          lineHeight: 1.15,
          minHeight: '8rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 1rem',
        }} className="glitter-heading">
          {g.word}
        </div>

        {/* Arrow — click to skip */}
        <button
          onClick={onEnter}
          style={{ marginTop: '3rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent2)', animation: 'arrowBounce 1.4s ease-in-out infinite' }}
          title="Enter"
        >
          <svg width="28" height="28" viewBox="0 0 28 28">
            <path d="M4 8 L14 20 L24 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </button>
        <style>{`@keyframes arrowBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(6px)} }`}</style>
      </div>
    </div>
  )
}

const screen = {
  minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'var(--bg)', position: 'relative', overflow: 'hidden',
}
const center = {
  position: 'relative', zIndex: 1,
  display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 1rem',
}
const dots = {
  position: 'fixed', top: '1.2rem', right: '1.4rem',
  display: 'flex', gap: '0.55rem', zIndex: 10, alignItems: 'center',
}
