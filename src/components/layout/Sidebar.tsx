import { NavLink } from 'react-router-dom';
import { BarChart3, Boxes, ChartColumn, LayoutGrid, Search, Bell, Moon, Sun } from 'lucide-react';
import { cn } from '../../lib/utils';

const links = [
  { label: 'Overview', to: '/overview', icon: LayoutGrid },
  { label: 'Products', to: '/products', icon: Boxes },
  { label: 'Categories', to: '/categories', icon: BarChart3 },
  { label: 'Analytics', to: '/analytics', icon: ChartColumn }
];

export function Sidebar() {
  return (
    <aside className="dashboard-sidebar hidden w-64 shrink-0 flex-col border-r p-5 lg:flex">
      <a href="/overview" className="mb-10 flex items-center gap-3 rounded-lg" aria-label="API Insights home">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500 text-sm font-bold text-slate-950">AI</span>
        <span><span className="block text-xs text-slate-400">PRODUCT ANALYTICS</span><span className="text-base font-semibold text-white">Insights</span></span>
      </a>
      <p className="muted-label mb-3 px-3">Workspace</p>
      <nav className="space-y-1" aria-label="Main navigation">
        {links.map(({ label, to, icon: Icon }) => <NavLink key={label} to={to} className={({ isActive }) => cn('sidebar-link flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors', isActive ? 'sidebar-link-active' : 'text-slate-400 hover:bg-slate-800/60 hover:text-white')}><Icon size={18} strokeWidth={1.8} />{label}</NavLink>)}
      </nav>
      <div className="mt-auto rounded-xl border border-slate-800 bg-slate-900/60 p-4"><p className="muted-label mb-3">Data source</p><div className="flex items-center gap-2 text-sm text-slate-300"><span className="h-2 w-2 rounded-full bg-emerald-400" />DummyJSON API</div><p className="mt-2 text-xs text-slate-500">Product data refreshed on demand</p></div>
    </aside>
  );
}

export function TopBar({ search, onSearchChange, theme, onToggleTheme }: { search: string; onSearchChange: (value: string) => void; theme: 'dark' | 'light'; onToggleTheme: () => void }) {
  return (
    <header className="dashboard-header sticky top-0 z-10 border-b px-4 py-3 backdrop-blur-xl sm:px-7">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500 text-xs font-bold text-slate-950 lg:hidden">AI</span><div><p className="text-xs font-medium text-slate-400">WORKSPACE / <span className="text-cyan-500">DASHBOARD</span></p><h1 className="text-base font-semibold text-white sm:text-lg">API Insights</h1></div></div>
        <div className="flex items-center gap-2 sm:gap-3">
          <label className="relative hidden w-56 sm:block md:w-72"><Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} /><input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search products..." aria-label="Search products" className="dashboard-input w-full rounded-lg border py-2 pl-9 pr-3 text-sm outline-none transition focus:border-cyan-500" /></label>
          <button type="button" aria-label="Notifications" className="icon-button hidden h-10 w-10 items-center justify-center rounded-lg border sm:flex"><Bell size={17} /></button>
          <button type="button" onClick={onToggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} className="icon-button flex h-10 items-center gap-2 rounded-lg border px-3 text-sm"><span className="hidden sm:inline">{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>{theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}</button>
          <div className="profile-chip hidden items-center gap-2 rounded-lg border py-1 pl-1 pr-3 sm:flex"><span className="flex h-8 w-8 items-center justify-center rounded-md bg-cyan-500/15 text-xs font-semibold text-cyan-600">TV</span><span className="text-sm font-medium text-white">Tarun</span></div>
        </div>
        <label className="relative block w-full sm:hidden"><Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} /><input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search products..." aria-label="Search products" className="dashboard-input w-full rounded-lg border py-2 pl-9 pr-3 text-sm outline-none focus:border-cyan-500" /></label>
      </div>
      <nav className="mobile-nav mt-3 flex gap-1 overflow-x-auto lg:hidden" aria-label="Mobile navigation">{links.map(({ label, to, icon: Icon }) => <NavLink key={label} to={to} className={({ isActive }) => cn('flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm', isActive ? 'sidebar-link-active' : 'text-slate-400')}><Icon size={16} />{label}</NavLink>)}</nav>
    </header>
  );
}
