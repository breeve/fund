import React from 'react';
import { Button } from './Button';

interface FormField {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'select' | 'date';
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
}

interface FormProps {
  fields: FormField[];
  initialValues?: Record<string, string | number>;
  onSubmit: (values: Record<string, string | number>) => void;
  submitLabel?: string;
}

export function Form({ fields, initialValues = {}, onSubmit, submitLabel = '提交' }: FormProps) {
  const [values, setValues] = React.useState<Record<string, string | number>>(initialValues);

  const handleChange = (name: string, value: string | number) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: 'var(--spacing-2) var(--spacing-3)',
    border: '1px solid var(--color-gray-300)',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--font-size-base)',
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
      {fields.map((field) => (
        <div key={field.name} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
          <label style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)' }}>
            {field.label}
            {field.required && <span style={{ color: 'var(--color-danger)' }}> *</span>}
          </label>
          {field.type === 'select' ? (
            <select
              value={values[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              style={inputStyle}
              required={field.required}
            >
              <option value="">{field.placeholder || '请选择'}</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ) : (
            <input
              type={field.type || 'text'}
              value={values[field.name] || ''}
              onChange={(e) => handleChange(field.name, field.type === 'number' ? Number(e.target.value) : e.target.value)}
              placeholder={field.placeholder}
              style={inputStyle}
              required={field.required}
            />
          )}
        </div>
      ))}
      <Button type="submit" variant="primary">
        {submitLabel}
      </Button>
    </form>
  );
}
