const LAYOUTS = [
  { id: 'notes',    label: 'Notes',    icon: NotesSVG },
  { id: 'pinboard', label: 'Pinboard', icon: PinboardSVG },
  { id: 'memory',   label: 'Memory',   icon: MemorySVG },
]

export default function LayoutPicker({ layout, setLayout }) {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--surface)', borderRadius: '999px', padding: '0.3rem', boxShadow: '0 2px 10px var(--shadow)' }}>
      {LAYOUTS.map(l => (
        <button
          key={l.id}
          onClick={() => setLayout(l.id)}
          title={l.label}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.35rem',
            background: layout === l.id ? 'var(--accent)' : 'transparent',
            color: layout === l.id ? '#fff' : 'var(--text2)',
            border: 'none', borderRadius: '999px',
            padding: '0.3rem 0.75rem', cursor: 'pointer',
            fontSize: '0.78rem', fontFamily: 'var(--font-body)',
            letterSpacing: '0.05em', transition: 'all 0.25s',
          }}
        >
          <l.icon size={14} />
          {l.label}
        </button>
      ))}
    </div>
  )
}

function NotesSVG({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16">
      <rect x="2" y="3" width="8" height="10" rx="1" fill="currentColor" opacity="0.5" transform="rotate(-8 6 8)" />
      <rect x="6" y="2" width="8" height="10" rx="1" fill="currentColor" />
    </svg>
  )
}

function PinboardSVG({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16">
      <rect x="1" y="1" width="14" height="14" rx="2" fill="currentColor" opacity="0.3" />
      <circle cx="4" cy="4" r="1.2" fill="currentColor" />
      <circle cx="12" cy="4" r="1.2" fill="currentColor" />
      <rect x="4" y="6" width="8" height="5" rx="0.8" fill="currentColor" opacity="0.7" />
    </svg>
  )
}

function MemorySVG({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16">
      {[[1,1],[9,1],[1,9],[9,9]].map(([x,y],i) => (
        <rect key={i} x={x} y={y} width="6" height="6" rx="1" fill="currentColor" opacity={i % 2 === 0 ? 0.9 : 0.4} />
      ))}
    </svg>
  )
}
