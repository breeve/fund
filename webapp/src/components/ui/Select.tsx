import type { CSSProperties } from 'react';
import React from 'react';

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  style?: CSSProperties;
  disabled?: boolean;
}

export function Select({ value, onChange, options, style, disabled }: SelectProps) {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          width: '100%',
          padding: 'var(--spacing-2) var(--spacing-4)',
          backgroundColor: 'var(--color-white)',
          border: '1px solid var(--color-gray-200)',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--font-size-sm)',
          outline: 'none',
          cursor: 'pointer',
          appearance: 'none',
          transition: 'var(--transition-normal)',
          boxShadow: isFocused ? 'var(--shadow-sm)' : 'none',
          borderColor: isFocused ? 'var(--color-gray-400)' : 'var(--color-gray-200)',
          backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236b7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right var(--spacing-3) center',
          backgroundSize: '16px',
          paddingRight: 'var(--spacing-10)',
          ...style,
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}