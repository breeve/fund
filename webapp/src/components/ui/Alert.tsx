import type { ReactNode } from 'react';

type AlertSeverity = 'normal' | 'attention' | 'warning' | 'danger';

interface AlertProps {
  severity: AlertSeverity;
  title?: string;
  children: ReactNode;
  action?: ReactNode;
}

const severityConfig: Record<
  AlertSeverity,
  { bg: string; border: string; icon: string; titleColor: string }
> = {
  normal: {
    bg: 'var(--color-gray-50)',
    border: 'var(--color-gray-400)',
    icon: 'ℹ️',
    titleColor: 'var(--color-gray-900)',
  },
  attention: {
    bg: '#fffbeb',
    border: 'var(--color-warning)',
    icon: '💡',
    titleColor: '#92400e',
  },
  warning: {
    bg: '#fff7ed',
    border: 'var(--color-warning)',
    icon: '⚠️',
    titleColor: '#9a3412',
  },
  danger: {
    bg: '#fef2f2',
    border: 'var(--color-danger)',
    icon: '🚨',
    titleColor: '#991b1b',
  },
};

export function Alert({ severity, title, children, action }: AlertProps) {
  const config = severityConfig[severity];

  return (
    <div
      style={{
        padding: 'var(--spacing-5) var(--spacing-6)',
        backgroundColor: config.bg,
        border: `1px solid ${config.border}33`,
        borderLeft: `4px solid ${config.border}`,
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-4)' }}>
        <span
          style={{
            fontSize: 'var(--font-size-lg)',
            lineHeight: 1,
            marginTop: '2px'
          }}
        >
          {config.icon}
        </span>
        <div style={{ flex: 1 }}>
          {title && (
            <div
              style={{
                fontWeight: 'var(--font-weight-bold)',
                color: config.titleColor,
                marginBottom: 'var(--spacing-1)',
                fontSize: 'var(--font-size-sm)'
              }}
            >
              {title}
            </div>
          )}
          <div
            style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-gray-700)',
              lineHeight: 1.6,
            }}
          >
            {children}
          </div>
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
}

interface AlertIndicatorProps {
  severity: AlertSeverity;
  label?: string;
}

export function AlertIndicator({ severity, label }: AlertIndicatorProps) {
  const config = severityConfig[severity];
  const labelText =
    severity === 'normal'
      ? '正常'
      : severity === 'attention'
        ? '关注'
        : severity === 'warning'
          ? '预警'
          : '危险';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', padding: '2px 8px', borderRadius: 'var(--radius-full)', backgroundColor: `${config.bg}` }}>
      <span style={{ fontSize: '10px' }}>{config.icon}</span>
      <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-medium)', color: config.titleColor }}>
        {label || labelText}
      </span>
    </div>
  );
}
