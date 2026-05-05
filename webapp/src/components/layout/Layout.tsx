import { Outlet, Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/dashboard', label: '仪表盘' },
  { path: '/assets', label: '资产' },
  { path: '/funds', label: '基金' },
  { path: '/analysis', label: '分析' },
  { path: '/properties', label: '房产' },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: 240, backgroundColor: 'var(--color-gray-900)', color: '#fff', padding: 'var(--spacing-6)' }}>
        <h1 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--spacing-8)' }}>天天开心</h1>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                padding: 'var(--spacing-3) var(--spacing-4)',
                borderRadius: 'var(--radius-md)',
                color: location.pathname === item.path ? '#fff' : 'var(--color-gray-400)',
                backgroundColor: location.pathname === item.path ? 'var(--color-primary-600)' : 'transparent',
                textDecoration: 'none',
                transition: 'var(--transition-fast)',
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main style={{ flex: 1, backgroundColor: 'var(--color-gray-50)', overflow: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
