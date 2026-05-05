import React from 'react';

interface Column<T> {
  key: keyof T | string;
  title: string;
  render?: (value: unknown, row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
}

export function Table<T>({ columns, data, onRowClick }: TableProps<T>) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: 'var(--color-gray-50)' }}>
            {columns.map((col) => (
              <th key={String(col.key)} style={{ padding: 'var(--spacing-3) var(--spacing-4)', textAlign: 'left', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-700)', borderBottom: '1px solid var(--color-gray-200)' }}>
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={idx}
              onClick={() => onRowClick?.(row)}
              style={{ cursor: onRowClick ? 'pointer' : 'default', transition: 'var(--transition-fast)' }}
              onMouseEnter={(e) => { if (onRowClick) e.currentTarget.style.backgroundColor = 'var(--color-gray-50)'; }}
              onMouseLeave={(e) => { if (onRowClick) e.currentTarget.style.backgroundColor = ''; }}
            >
              {columns.map((col) => (
                <td key={String(col.key)} style={{ padding: 'var(--spacing-3) var(--spacing-4)', borderBottom: '1px solid var(--color-gray-100)', fontSize: 'var(--font-size-sm)' }}>
                  {col.render ? col.render(row[col.key as keyof T], row) : String(row[col.key as keyof T] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
