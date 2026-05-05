import type { CSSProperties } from 'react';

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  style?: CSSProperties;
  disabled?: boolean;
}

export function Input({ value, onChange, placeholder, onKeyDown, style, disabled }: InputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onKeyDown={onKeyDown}
      disabled={disabled}
      style={{
        padding: 'var(--spacing-2) var(--spacing-3)',
        border: '1px solid var(--color-gray-300)',
        borderRadius: 'var(--radius-md)',
        fontSize: 'var(--font-size-base)',
        outline: 'none',
        transition: 'border-color var(--duration-fast)',
        ...style,
      }}
      onFocus={(e) => {
        e.target.style.borderColor = 'var(--color-primary-500)';
      }}
      onBlur={(e) => {
        e.target.style.borderColor = 'var(--color-gray-300)';
      }}
    />
  );
}