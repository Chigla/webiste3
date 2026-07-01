import { useState, useEffect } from 'react'
import Petals from './Petals.jsx'

const GREETINGS = [
  { word: 'I Love You',   lang: 'English',  style: { fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.8rem,8vw,6rem)' } },
  { word: '愛してる',      lang: 'Japanese', style: { fontFamily: 'var(--font-jp)', fontSize: 'clamp(2.4rem,7vw,5.2rem)', letterSpacing: '0.12em' } },
  { word: '사랑해',        lang: 'Korean',   style: { fontFamily: 'var(--font-kr)', fontSize: 'clamp(2.4rem,7vw,5.2rem)', letterSpacing: '0.08em' } },
  { word: 'Je t\'aime',   lang: 'French',   style: { fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.8rem,8vw,6rem)' } },
  { word: 'Te Amo',       lang: 'Spanish',  style: { fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.8rem,8vw,6rem)' } },
  { word: 'Ich liebe dich', lang: 'German', style: { fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.2rem,6vw,5rem)' } },
  { word: 'Tujhse Pyar Hai', lang: 'Hindi', style: { fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem,6vw,4.8rem)' } },
]

export default function GreetingScreen({ onEnter }) {
  const [idx, setIdx] = useState(0)
  const [fade, setFade] = useState(true)
  const [theme, setTheme] = useState('sakura')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setIdx(i => (i + 1) % GREETINGS.length)
        setFade(true)
      }, 500)
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  const g = GREETINGS[idx]

  return (
    <div style={styles.screen}>
      <Petals theme={theme} />

      {/* Theme picker top-right */}
      <div style={styles.themePicker}>
        {['sakura', 'velvet', 'midnight'].map(t => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            style={{
              ...styles.dot,
              background: t === 'sakura' ? '#e8759a' : t === 'velvet' ? '#c4507a' : '#7b8cde',
              boxShadow: theme === t ? `0 0 0 3px #fff, 0 0 0 5px ${t === 'sakura' ? '#e8759a' : t === 'velvet' ? '#c4507a' : '#7b8cde'}` : 'none',
            }}
            title={t.charAt(0).toUpperCase() + t.slice(1)}
          />
        ))}
      </div>

      <div style={styles.center}>
        {/* SVG heart */}
        <svg width="90" height="80" viewBox="0 0 90 80" style={{ marginBottom: '1.5rem', filter: 'drop-shadow(0 4px 16px var(--shadow))' }}>
          <path
            d="M45 70 C45 70 5 45 5 22 C5 10 13 3 22 3 C31 3 38 9 45 17 C52 9 59 3 68 3 C77 3 85 10 85 22 C85 45 45 70 45 70Z"
            fill="var(--accent)"
            stroke="none"
          />
          <path
            d="M28 16 C24 16 20 20 20 25"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </svg>

        {/* Cycling greeting */}
        <div
          style={{
            ...g.style,
            color: 'var(--accent)',
            transition: 'opacity 0.5s ease',
            opacity: fade ? 1 : 0,
            textAlign: 'center',
            lineHeight: 1.1,
            minHeight: '7rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            className: 'glitter-heading',
          }}
          className="glitter-heading"
        >
          {g.word}
        </div>

        <div style={styles.lang}>{g.lang}</div>

        <div style={{ marginTop: '2.5rem' }}>
          <button className="btn" onClick={onEnter} style={{ fontSize: '1rem', padding: '0.75rem 2.4rem' }}>
            Open our memories ♡
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  screen: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg)',
    position: 'relative',
    overflow: 'hidden',
  },
  center: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem',
  },
  lang: {
    marginTop: '0.6rem',
    fontSize: '0.85rem',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'var(--text2)',
    fontFamily: 'var(--font-body)',
    fontWeight: 300,
  },
  themePicker: {
    position: 'fixed',
    top: '1.2rem',
    right: '1.4rem',
    display: 'flex',
    gap: '0.6rem',
    zIndex: 10,
  },
  dot: {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    transition: 'box-shadow 0.2s',
  },
}
