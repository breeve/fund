import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { OverviewPage } from './pages/OverviewPage';
import { AssetsPage } from './pages/AssetsPage';
import { AssetFormPage } from './pages/AssetFormPage';
import { FundPage } from './pages/FundPage';
import { FundDiagnosisPage } from './pages/FundDiagnosisPage';
import { SettingsPage } from './pages/SettingsPage';
import { useConfigStore } from './store';
import { useEffect } from 'react';

function App() {
  const theme = useConfigStore((s) => s.preferences.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else if (theme === 'light') {
      root.removeAttribute('data-theme');
    } else {
      // Auto: follow system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.setAttribute('data-theme', 'dark');
      } else {
        root.removeAttribute('data-theme');
      }
    }
  }, [theme]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/overview" replace />} />
        <Route path="/overview" element={<OverviewPage />} />
        <Route path="/assets" element={<AssetsPage />} />
        <Route path="/assets/new" element={<AssetFormPage />} />
        <Route path="/assets/:id/edit" element={<AssetFormPage />} />
        <Route path="/fund" element={<FundPage />} />
        <Route path="/fund/:code" element={<FundDiagnosisPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Layout>
  );
}

export default App;