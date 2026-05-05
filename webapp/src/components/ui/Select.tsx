import type { CSSProperties } from 'react';

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  style?: CSSProperties;
  disabled?: boolean;
}

export function Select({ value, onChange, options, style, disabled }: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      style={{
        padding: 'var(--spacing-2) var(--spacing-3)',
        border: '1px solid var(--color-gray-300)',
        borderRadius: 'var(--radius-md)',
        fontSize: 'var(--font-size-base)',
        outline: 'none',
        backgroundColor: 'white',
        cursor: 'pointer',
        ...style,
      }}
      onFocus={(e) => {
        e.target.style.borderColor = 'var(--color-primary-500)';
      }}
      onBlur={(e) => {
        e.target.style.borderColor = 'var(--color-gray-300)';
      }}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}