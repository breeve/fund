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
  primary: { backgroundColor: 'var(--color-primary-600)', color: '#fff' },
  secondary: { backgroundColor: 'var(--color-gray-100)', color: 'var(--color-gray-700)' },
  danger: { backgroundColor: 'var(--color-danger)', color: '#fff' },
  ghost: { backgroundColor: 'transparent', color: 'var(--color-gray-700)' },
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: 'var(--spacing-1) var(--spacing-2)', fontSize: 'var(--font-size-sm)' },
  md: { padding: 'var(--spacing-2) var(--spacing-4)', fontSize: 'var(--font-size-base)' },
  lg: { padding: 'var(--spacing-3) var(--spacing-6)', fontSize: 'var(--font-size-lg)' },
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
  const baseStyle: React.CSSProperties = {
    border: 'none',
    borderRadius: 'var(--radius-md)',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'var(--transition-fast)',
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...style,
  };

  return (
    <button disabled={disabled || loading} style={baseStyle} {...props}>
      {loading ? '加载中...' : children}
    </button>
  );
}
