import { NavLink, Outlet, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/overview', label: '总览', labelEn: 'Overview', icon: '📊' },
  { path: '/assets', label: '资产', labelEn: 'Assets', icon: '💰' },
  { path: '/fund', label: '基金', labelEn: 'Funds', icon: '📈' },
  { path: '/settings', label: '设置', labelEn: 'Settings', icon: '⚙️' },
];

export function Layout({ children }: { children?: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="app-layout">
      {/* Desktop Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">F</div>
          <span className="sidebar-title">家庭资产</span>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="card" style={{ padding: 'var(--space-3)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              MVP v0.1.0
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="mobile-header">
        <div className="mobile-header-logo">F</div>
        <div className="mobile-header-title">家庭资产</div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {children ?? <Outlet />}
      </main>

      {/* Mobile Bottom Tab Bar */}
      <nav className="mobile-tab-bar">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`mobile-tab-item ${isActive ? 'active' : ''}`}
            >
              <span className="mobile-tab-icon">{item.icon}</span>
              <span className="mobile-tab-label">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
