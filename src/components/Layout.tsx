import { NavLink, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAppData } from '../hooks/useAppData';

const navItems = [
  { to: '/', label: 'ダッシュボード', icon: '◉' },
  { to: '/record', label: '記録', icon: '✎' },
  { to: '/history', label: '履歴', icon: '☰' },
  { to: '/settings', label: '設定', icon: '⚙' },
];

export default function Layout() {
  const { error } = useAppData();

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <header
        className="border-b"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <div className="mx-auto max-w-3xl px-4 py-3 flex items-center justify-between">
          <h1 className="font-heading text-lg font-bold" style={{ color: 'var(--text)' }}>
            Shadowing Log
          </h1>
          <nav className="flex gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    isActive ? 'nav-active' : 'nav-default'
                  }`
                }
                style={({ isActive }) =>
                  isActive
                    ? {
                        backgroundColor: 'var(--accent-soft)',
                        color: 'var(--accent)',
                      }
                    : {
                        color: 'var(--text-muted)',
                      }
                }
              >
                <span className="mr-1">{item.icon}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {error && (
        <div
          className="border-b px-4 py-3 text-center text-sm"
          style={{
            backgroundColor: '#fdf2f2',
            borderColor: '#f5d5d5',
            color: 'var(--danger)',
          }}
        >
          {error} &mdash;
          <NavLink to="/settings" className="underline font-medium">
            設定画面のインポート機能
          </NavLink>
          でデータを復旧できます
        </div>
      )}

      <main className="mx-auto max-w-3xl px-4 py-6">
        <Outlet />
      </main>

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontFamily: "'Noto Sans JP', sans-serif",
            background: 'var(--bg-card)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
          },
        }}
      />
    </div>
  );
}
