import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: { backgroundColor: 'var(--color-primary)', color: 'var(--color-white)' },
  secondary: { backgroundColor: 'var(--color-gray-100)', color: 'var(--color-gray-900)', border: '1px solid var(--color-gray-200)' },
  danger: { backgroundColor: 'var(--color-danger)', color: 'var(--color-white)' },
  ghost: { backgroundColor: 'transparent', color: 'var(--color-gray-700)' },
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: 'var(--spacing-1) var(--spacing-3)', fontSize: 'var(--font-size-xs)' },
  md: { padding: 'var(--spacing-2) var(--spacing-5)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' },
  lg: { padding: 'var(--spacing-3) var(--spacing-8)', fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)' },
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  style,
  ...props
}: ButtonProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  const baseStyle: React.CSSProperties = {
    border: 'none',
    borderRadius: 'var(--radius-md)',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'var(--transition-fast)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--spacing-2)',
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...(isHovered && !disabled && !loading ? { opacity: 0.85, transform: 'translateY(-1px)' } : {}),
    ...style,
  };

  return (
    <button 
      disabled={disabled || loading} 
      style={baseStyle} 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {loading ? (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="animate-spin">⏳</span> 加载中...
        </span>
      ) : children}
    </button>
  );
}
