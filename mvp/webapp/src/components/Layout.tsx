import { NavLink, Outlet } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/overview', label: '资产总览', icon: '📊' },
  { path: '/assets', label: '资产列表', icon: '💰' },
  { path: '/fund', label: '基金诊断', icon: '📈' },
  { path: '/settings', label: '设置', icon: '⚙️' },
];

export function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="app-layout">
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

      <main className="main-content">
        {children ?? <Outlet />}
      </main>
    </div>
  );
}