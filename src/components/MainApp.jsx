import { useState, useEffect } from 'react'
import Petals from './Petals.jsx'
import ThemeSwitcher from './ThemeSwitcher.jsx'
import LayoutPicker from './LayoutPicker.jsx'
import ScatteredNotes from './ScatteredNotes.jsx'
import EnvelopePinboard from './EnvelopePinboard.jsx'
import MemoryGame from './MemoryGame.jsx'
import VinylPlayer from './VinylPlayer.jsx'

const SONGS = [
  { title: 'The Night We Met', src: '/songs/the night we met.mp3' },
  { title: 'Tum Hi Ho',        src: '/songs/tum hi ho.mp3' },
]

const IMAGES = Array.from({ length: 10 }, (_, i) => `/images/${i + 1}.jpg`)

export default function MainApp() {
  const [theme, setTheme]   = useState('sakura')
  const [layout, setLayout] = useState('notes')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', position: 'relative', paddingBottom: '7rem' }}>
      <Petals theme={theme} />

      {/* Header */}
      <header style={hdr}>
        <h1 className="heading glitter-heading" style={{ fontSize: 'clamp(2rem,5vw,3.6rem)', color: 'var(--accent)', lineHeight: 1 }}>
          For You, Always
        </h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          <ThemeSwitcher theme={theme} setTheme={setTheme} />
          <LayoutPicker layout={layout} setLayout={setLayout} />
        </div>
      </header>

      {/* Love names row */}
      <div style={namesRow}>
        <span style={{ fontFamily: 'var(--font-jp)', fontSize: '1.5rem', color: 'var(--accent2)', letterSpacing: '0.12em' }}>愛してる</span>
        <svg width="28" height="26" viewBox="0 0 28 26" style={{ margin: '0 0.8rem' }}>
          <path d="M14 23 C14 23 2 14 2 7 C2 3 5 1 8 1 C11 1 13 3 14 5 C15 3 17 1 20 1 C23 1 26 3 26 7 C26 14 14 23 14 23Z" fill="var(--accent)" />
        </svg>
        <span style={{ fontFamily: 'var(--font-kr)', fontSize: '1.5rem', color: 'var(--accent2)', letterSpacing: '0.08em' }}>사랑해</span>
      </div>

      {/* Layout content */}
      <main style={{ position: 'relative', zIndex: 1 }}>
        {layout === 'notes'    && <ScatteredNotes images={IMAGES} />}
        {layout === 'pinboard' && <EnvelopePinboard images={IMAGES} />}
        {layout === 'memory'   && <MemoryGame images={IMAGES} />}
      </main>

      {/* Vinyl player fixed at bottom */}
      <VinylPlayer songs={SONGS} />
    </div>
  )
}

const hdr = {
  position: 'relative',
  zIndex: 2,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1rem',
  padding: '2rem 1rem 1rem',
}

const namesRow = {
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.4rem 0 1.6rem',
}
