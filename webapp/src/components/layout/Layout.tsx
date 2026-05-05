import { Outlet, Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/dashboard', label: '仪表盘', icon: '📊' },
  { path: '/assets', label: '资产', icon: '💰' },
  { path: '/funds', label: '基金', icon: '📈' },
  { path: '/analysis', label: '分析', icon: '🔍' },
  { path: '/properties', label: '房产', icon: '🏠' },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-sidebar-bg)' }}>
      {/* Sidebar */}
      <aside style={{ 
        width: 260, 
        borderRight: '1px solid var(--color-gray-200)', 
        display: 'flex', 
        flexDirection: 'column',
        padding: 'var(--spacing-6) var(--spacing-4)',
        position: 'relative'
      }}>
        <div style={{ 
          fontSize: 'var(--font-size-lg)', 
          fontWeight: 'var(--font-weight-bold)', 
          marginBottom: 'var(--spacing-10)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-2)',
          paddingLeft: 'var(--spacing-2)'
        }}>
          <span style={{ fontSize: '24px' }}>🌈</span> 天天开心
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)', flex: 1 }}>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', marginBottom: 'var(--spacing-2)', paddingLeft: 'var(--spacing-2)' }}>
            主要功能
          </div>
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  padding: 'var(--spacing-3) var(--spacing-4)',
                  borderRadius: 'var(--radius-md)',
                  color: isActive ? 'var(--color-gray-900)' : 'var(--color-gray-700)',
                  backgroundColor: isActive ? 'var(--color-gray-200)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-3)',
                  transition: 'var(--transition-fast)',
                  fontWeight: isActive ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)',
                }}
              >
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Profile Section */}
        <div style={{ 
          marginTop: 'auto', 
          padding: 'var(--spacing-4)', 
          backgroundColor: 'var(--color-white)', 
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-gray-200)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-3)'
        }}>
          <div style={{ 
            width: 32, 
            height: 32, 
            borderRadius: 'var(--radius-full)', 
            backgroundColor: '#4ade80',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px'
          }}>
            👤
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>Flynn</div>
            <div style={{ fontSize: '10px', color: 'var(--color-gray-500)' }}>免费版</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="grid-background" style={{ flex: 1, overflow: 'auto', padding: 'var(--spacing-10)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
