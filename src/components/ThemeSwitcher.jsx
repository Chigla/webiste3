const THEMES = [
  { id: 'sakura',   label: 'Sakura',   color: '#e8759a', icon: SakuraSVG },
  { id: 'velvet',   label: 'Velvet',   color: '#c4507a', icon: VelvetSVG },
  { id: 'midnight', label: 'Midnight', color: '#7b8cde', icon: MidnightSVG },
]

export default function ThemeSwitcher({ theme, setTheme }) {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--surface)', borderRadius: '999px', padding: '0.3rem', boxShadow: '0 2px 10px var(--shadow)' }}>
      {THEMES.map(t => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          title={t.label}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.35rem',
            background: theme === t.id ? t.color : 'transparent',
            color: theme === t.id ? '#fff' : 'var(--text2)',
            border: 'none', borderRadius: '999px',
            padding: '0.3rem 0.75rem', cursor: 'pointer',
            fontSize: '0.78rem', fontFamily: 'var(--font-body)',
            letterSpacing: '0.05em', transition: 'all 0.25s',
          }}
        >
          <t.icon size={14} active={theme === t.id} />
          {t.label}
        </button>
      ))}
    </div>
  )
}

function SakuraSVG({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16">
      {[0,72,144,216,288].map((deg, i) => (
        <ellipse key={i} cx="8" cy="4" rx="2.2" ry="3.8" fill="#f9a8c0"
          transform={`rotate(${deg} 8 8)`} />
      ))}
      <circle cx="8" cy="8" r="2" fill="#f5c6d8" />
    </svg>
  )
}

function VelvetSVG({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16">
      <path d="M8 14 C8 14 2 9 2 5.5 C2 3 3.8 1.5 5.5 1.5 C6.8 1.5 7.6 2.2 8 3 C8.4 2.2 9.2 1.5 10.5 1.5 C12.2 1.5 14 3 14 5.5 C14 9 8 14 8 14Z" fill="#c4507a" />
    </svg>
  )
}

function MidnightSVG({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16">
      <path d="M12 8 A5 5 0 1 1 8 3 A4 4 0 1 0 12 8Z" fill="#7b8cde" />
      {[[3,3],[13,5],[11,13],[5,12]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="0.8" fill="#c4b5fd" />
      ))}
    </svg>
  )
}
