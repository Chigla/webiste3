import { useState, useEffect } from 'react'

// July 20 2022, 5:00 PM NPT (UTC+5:45) = 11:15 AM UTC
const START = new Date('2022-07-20T11:15:00Z')

function pad(n) { return String(n).padStart(2, '0') }

export default function Timer() {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(id)
  }, [])

  const diff    = Math.max(0, Math.floor((Date.now() - START) / 1000))
  const seconds = diff % 60
  const minutes = Math.floor(diff / 60) % 60
  const hours   = Math.floor(diff / 3600) % 24
  const days    = Math.floor(diff / 86400)

  return (
    <div style={wrap}>
      <div style={numRow}>
        <Unit value={days}         label="days" big />
        <Colon />
        <Unit value={pad(hours)}   label="hours" />
        <Colon />
        <Unit value={pad(minutes)} label="min" />
        <Colon />
        <Unit value={pad(seconds)} label="sec" />
      </div>
    </div>
  )
}

function Unit({ value, label, big }) {
  return (
    <div style={{ textAlign: 'center', lineHeight: 1 }}>
      <div style={{
        fontFamily: "'Dancing Script', cursive",
        fontWeight: 600,
        fontSize: big ? 'clamp(2.6rem,7vw,4.2rem)' : 'clamp(2.2rem,5.5vw,3.6rem)',
        color: 'var(--accent)',
        letterSpacing: '0.01em',
        transition: 'color 0.3s',
        lineHeight: 1,
      }}>
        {value}
      </div>
      <div style={{
        fontSize: '0.58rem',
        color: 'var(--text2)',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        marginTop: '0.25rem',
        fontFamily: 'var(--font-body)',
        fontWeight: 300,
      }}>
        {label}
      </div>
    </div>
  )
}

function Colon() {
  return (
    <div style={{
      fontFamily: "'Dancing Script', cursive",
      fontWeight: 600,
      fontSize: 'clamp(2rem,5vw,3.2rem)',
      color: 'var(--accent2)',
      lineHeight: 1,
      paddingBottom: '1.1rem',
      opacity: 0.55,
    }}>
      :
    </div>
  )
}

const wrap = { display: 'flex', flexDirection: 'column', alignItems: 'center' }
const numRow = { display: 'flex', alignItems: 'flex-end', gap: 'clamp(0.3rem,1.5vw,1rem)' }
