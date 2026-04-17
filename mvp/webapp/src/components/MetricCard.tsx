interface MetricCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  change?: number;
  icon?: string;
  color?: 'primary' | 'success' | 'warning' | 'danger';
}

export function MetricCard({ title, value, subValue, change, icon, color = 'primary' }: MetricCardProps) {
  const colorMap = {
    primary: 'var(--color-primary)',
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
    danger: 'var(--color-danger)',
  };

  return (
    <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute',
        top: -20,
        right: -20,
        width: 100,
        height: 100,
        background: `radial-gradient(circle, ${colorMap[color]}15, transparent 70%)`,
        borderRadius: '50%',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: 500,
            color: 'var(--color-text-muted)',
            marginBottom: 'var(--space-2)',
          }}>
            {title}
          </div>
          <div style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--color-text)',
            marginBottom: 'var(--space-1)',
          }}>
            {typeof value === 'number' ? value.toLocaleString('zh-CN') : value}
          </div>
          {subValue && (
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              {subValue}
            </div>
          )}
          {change !== undefined && (
            <div style={{
              fontSize: '0.75rem',
              fontWeight: 500,
              color: change >= 0 ? 'var(--color-success)' : 'var(--color-danger)',
              marginTop: 'var(--space-1)',
            }}>
              {change >= 0 ? '+' : ''}{change.toFixed(2)}%
            </div>
          )}
        </div>
        {icon && (
          <div style={{
            fontSize: '2rem',
            opacity: 0.8,
          }}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}