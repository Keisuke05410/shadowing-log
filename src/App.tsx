import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppDataProvider } from './hooks/AppDataProvider';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Record from './pages/Record';
import History from './pages/History';
import Settings from './pages/Settings';

export default function App() {
  return (
    <HashRouter>
      <AppDataProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/record" element={<Record />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </AppDataProvider>
    </HashRouter>
  );
}
