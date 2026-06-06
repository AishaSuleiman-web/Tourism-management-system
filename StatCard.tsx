interface Props {
  label: string
  value: number | string
  icon: string
  color?: string
}

export default function StatCard({ label, value, icon, color = 'var(--accent)' }: Props) {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div style={{
        width: 48, height: 48,
        borderRadius: '10px',
        background: `${color}22`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.4rem',
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '1.6rem', fontWeight: 800, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '4px' }}>{label}</div>
      </div>
    </div>
  )
}