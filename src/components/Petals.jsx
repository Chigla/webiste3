import { useMemo } from 'react'

export default function Petals({ theme }) {
  const petals = useMemo(() => Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    size: `${Math.random() * 14 + 8}px`,
    duration: `${Math.random() * 8 + 6}s`,
    delay: `${Math.random() * 10}s`,
    opacity: Math.random() * 0.5 + 0.3,
  })), [])

  return (
    <div className="petals-wrap">
      {petals.map(p => (
        <div
          key={p.id}
          className="petal"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            background: theme === 'midnight'
              ? `radial-gradient(circle, rgba(255,255,255,0.9) 0%, var(--petal) 100%)`
              : 'var(--petal)',
            animationDuration: p.duration,
            animationDelay: p.delay,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  )
}
