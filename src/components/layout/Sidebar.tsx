import { NavLink } from 'react-router-dom';
import { BarChart3, Boxes, ChartColumn, LayoutGrid, Search, Bell, MoonStar } from 'lucide-react';
import { cn } from '../lib/utils';

const links = [
  { label: 'Overview', to: '/overview', icon: LayoutGrid },
  { label: 'Products', to: '/products', icon: Boxes },
  { label: 'Categories', to: '/categories', icon: BarChart3 },
  { label: 'Analytics', to: '/analytics', icon: ChartColumn }
];

export function Sidebar() {
  return (
    <aside className="hidden lg:flex lg:w-72 flex-col border-r border-slate-800 bg-slate-950/70 p-5">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-teal-400 text-sm font-bold text-slate-900">
          AI
        </div>
        <div>
          <p className="text-sm text-slate-400">Workspace</p>
          <h1 className="text-lg font-semibold text-white">Insights</h1>
        </div>
      </div>

      <nav className="space-y-2">
        {links.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                isActive
                  ? 'bg-slate-800 text-white shadow-lg shadow-slate-900/40'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              )
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <p className="muted-label mb-2">Quick status</p>
        <div className="flex items-center justify-between text-sm text-slate-300">
          <span>API health</span>
          <span className="inline-flex items-center gap-2 text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Stable
          </span>
        </div>
      </div>
    </aside>
  );
}

export function TopBar({ search, onSearchChange }: { search: string; onSearchChange: (value: string) => void }) {
  return (
    <header className="border-b border-slate-800 bg-slate-950/60 px-4 py-4 backdrop-blur-sm sm:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="muted-label">Dashboard</p>
          <h2 className="text-xl font-semibold text-white">API Insights Dashboard</h2>
        </div>

        <div className="flex flex-wrap items-center gap-3 md:justify-end">
          <label className="relative block w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search products..."
              className="w-full rounded-xl border border-slate-700 bg-slate-900/80 py-2.5 pl-10 pr-4 text-sm text-slate-200 outline-none transition focus:border-cyan-500"
            />
          </label>

          <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-slate-300 transition hover:border-slate-500 hover:text-white">
            <Bell size={18} />
          </button>

          <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-slate-300 transition hover:border-slate-500 hover:text-white">
            <MoonStar size={18} />
          </button>

          <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900 px-2 py-1.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 text-sm font-bold text-slate-900">
              TV
            </div>
            <div>
              <p className="text-sm font-medium text-white">Tarun</p>
              <p className="text-xs text-slate-400">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
