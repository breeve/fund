import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  style?: React.CSSProperties;
  className?: string;
}

export function Card({ children, title, style, className }: CardProps) {
  const cardStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-white)',
    borderRadius: 'var(--radius-xl)',
    boxShadow: 'var(--shadow-md)',
    padding: 'var(--spacing-8)',
    border: '1px solid var(--color-gray-100)',
    ...style,
  };

  return (
    <div className={className} style={cardStyle}>
      {title && <h3 style={{ 
        fontSize: 'var(--font-size-lg)', 
        fontWeight: 'var(--font-weight-bold)', 
        marginBottom: 'var(--spacing-6)',
        color: 'var(--color-gray-900)'
      }}>{title}</h3>}
      {children}
    </div>
  );
}
