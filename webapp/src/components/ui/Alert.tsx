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
    bg: 'var(--color-primary-50)',
    border: 'var(--color-primary-500)',
    icon: '●',
    titleColor: 'var(--color-primary-600)',
  },
  attention: {
    bg: '#fef3c7',
    border: 'var(--color-warning)',
    icon: '◐',
    titleColor: 'var(--color-warning)',
  },
  warning: {
    bg: '#fee2e2',
    border: 'var(--color-danger)',
    icon: '◉',
    titleColor: 'var(--color-danger)',
  },
  danger: {
    bg: '#fecaca',
    border: '#b91c1c',
    icon: '◼',
    titleColor: '#b91c1c',
  },
};

export function Alert({ severity, title, children, action }: AlertProps) {
  const config = severityConfig[severity];

  return (
    <div
      style={{
        padding: 'var(--spacing-4)',
        backgroundColor: config.bg,
        borderLeft: `4px solid ${config.border}`,
        borderRadius: 'var(--radius-md)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-3)' }}>
        <span
          style={{
            fontSize: 'var(--font-size-lg)',
            color: config.titleColor,
            lineHeight: 1.2,
          }}
        >
          {config.icon}
        </span>
        <div style={{ flex: 1 }}>
          {title && (
            <div
              style={{
                fontWeight: 'var(--font-weight-semibold)',
                color: config.titleColor,
                marginBottom: 'var(--spacing-1)',
              }}
            >
              {title}
            </div>
          )}
          <div
            style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-gray-700)',
              lineHeight: 1.5,
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
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
      <span style={{ fontSize: 'var(--font-size-sm)', color: config.titleColor }}>{config.icon}</span>
      <span style={{ fontSize: 'var(--font-size-sm)', color: config.titleColor }}>
        {label || labelText}
      </span>
    </div>
  );
}
