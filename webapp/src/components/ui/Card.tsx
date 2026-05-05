import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  style?: React.CSSProperties;
  className?: string;
}

export function Card({ children, title, style, className }: CardProps) {
  const cardStyle: React.CSSProperties = {
    backgroundColor: '#fff',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-sm)',
    padding: 'var(--spacing-6)',
    ...style,
  };

  return (
    <div className={className} style={cardStyle}>
      {title && <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--spacing-4)' }}>{title}</h3>}
      {children}
    </div>
  );
}
