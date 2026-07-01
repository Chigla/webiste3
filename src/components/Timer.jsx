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
        <Unit value={days}        label="days" big />
        <Colon />
        <Unit value={pad(hours)}  label="hours" />
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
        fontFamily: 'var(--font-body)',
        fontWeight: 300,
        fontSize: big ? 'clamp(2.2rem,6vw,3.6rem)' : 'clamp(2rem,5vw,3.2rem)',
        color: 'var(--accent)',
        letterSpacing: '-0.02em',
        transition: 'color 0.3s',
      }}>
        {value}
      </div>
      <div style={{ fontSize: '0.62rem', color: 'var(--text2)', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: '0.2rem' }}>
        {label}
      </div>
    </div>
  )
}

function Colon() {
  return (
    <div style={{ fontSize: 'clamp(1.6rem,4vw,2.8rem)', color: 'var(--accent2)', fontWeight: 300, lineHeight: 1, paddingBottom: '1rem', opacity: 0.6 }}>
      :
    </div>
  )
}

const wrap = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}

const numRow = {
  display: 'flex',
  alignItems: 'flex-end',
  gap: 'clamp(0.4rem,2vw,1.2rem)',
}
