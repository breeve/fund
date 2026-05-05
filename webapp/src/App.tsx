import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import Assets from '@/pages/Assets';
import Funds from '@/pages/Funds';
import Analysis from '@/pages/Analysis';
import Properties from '@/pages/Properties';
import Layout from '@/components/layout/Layout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="assets" element={<Assets />} />
        <Route path="funds" element={<Funds />} />
        <Route path="analysis" element={<Analysis />} />
        <Route path="properties" element={<Properties />} />
      </Route>
    </Routes>
  );
}

export default App;
