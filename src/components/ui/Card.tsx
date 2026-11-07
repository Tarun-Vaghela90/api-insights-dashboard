import { Database, DollarSign, Package, Star, Tags } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Product } from '../../types';
import { cn } from '../../lib/utils';

export function MetricCard({ label, value, icon, accent }: { label: string; value: string; icon: ReactNode; accent?: string }) {
  return (
    <article className="surface p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div><p className="muted-label">{label}</p><h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">{value}</h2></div>
        <span className={cn('flex h-11 w-11 items-center justify-center rounded-xl', accent ?? 'bg-slate-100 text-slate-600')}>{icon}</span>
      </div>
    </article>
  );
}

export function OverviewMetrics({ products, total }: { products: Product[]; total: number }) {
  const count = products.length;
  const averagePrice = count ? products.reduce((sum, product) => sum + product.price, 0) / count : 0;
  const averageRating = count ? products.reduce((sum, product) => sum + product.rating, 0) / count : 0;
  const totalCategories = new Set(products.map((product) => product.category)).size;

  return (
    <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
      <MetricCard label="Total products" value={total.toLocaleString()} icon={<Package size={19} />} accent="bg-cyan-500/10 text-cyan-700" />
      <MetricCard label="Average price" value={`$${averagePrice.toFixed(2)}`} icon={<DollarSign size={19} />} accent="bg-violet-500/10 text-violet-700" />
      <MetricCard label="Average rating" value={averageRating.toFixed(2)} icon={<Star size={19} />} accent="bg-amber-500/10 text-amber-700" />
      <MetricCard label="Categories" value={String(totalCategories)} icon={<Tags size={19} />} accent="bg-emerald-500/10 text-emerald-700" />
    </div>
  );
}

export function DataSourceCard({ connected, description }: { connected: boolean; description?: string }) {
  return (
    <section className="surface flex h-full flex-col justify-between p-5 sm:p-6" aria-label="Data source status">
      <div>
        <div className="mb-5 flex items-center justify-between">
          <div><p className="muted-label">INTEGRATION</p><h2 className="mt-1 text-lg font-semibold text-white">Data source</h2></div>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600"><Database size={19} /></span>
        </div>
        <p className="font-medium text-white">DummyJSON REST API</p>
        <p className="mt-1 text-sm text-slate-400">Public sample product data</p>
      </div>
      <div className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-700">
        <p className={`inline-flex items-center gap-2 text-sm font-medium ${connected ? 'text-emerald-700' : 'text-red-600'}`}>
          <span className={`h-2 w-2 rounded-full ${connected ? 'bg-emerald-500' : 'bg-red-500'}`} />
          {connected ? 'Connected' : 'Connection error'}
        </p>
        <p className="mt-2 text-xs leading-5 text-slate-500">{description ?? 'Data fetched from API on demand'}</p>
      </div>
    </section>
  );
}
