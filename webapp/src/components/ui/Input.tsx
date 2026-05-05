import type { CSSProperties } from 'react';
import React from 'react';

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  style?: CSSProperties;
  disabled?: boolean;
}

export function Input({ value, onChange, placeholder, onKeyDown, style, disabled }: InputProps) {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        disabled={disabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          width: '100%',
          padding: 'var(--spacing-3) var(--spacing-4)',
          backgroundColor: 'var(--color-gray-50)',
          border: '1px solid var(--color-gray-200)',
          borderRadius: 'var(--radius-lg)',
          fontSize: 'var(--font-size-sm)',
          outline: 'none',
          transition: 'var(--transition-normal)',
          boxShadow: isFocused ? 'var(--shadow-md)' : 'none',
          borderColor: isFocused ? 'var(--color-gray-400)' : 'var(--color-gray-200)',
          ...style,
        }}
      />
    </div>
  );
}