import { ArrowUpRight, DollarSign, Package, Star, Tags } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Product } from '../../types';
import { cn } from '../../lib/utils';

export function MetricCard({
  label,
  value,
  icon,
  trend,
  accent
}: {
  label: string;
  value: string;
  icon: ReactNode;
  trend?: string;
  accent?: string;
}) {
  return (
    <div className="surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div><p className="muted-label">{label}</p><h3 className="mt-4 text-3xl font-semibold text-white">{value}</h3></div>
        <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', accent ?? 'bg-slate-800 text-slate-200')}>{icon}</div>
      </div>
      {trend ? <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400"><ArrowUpRight size={12} />{trend}</div> : null}
    </div>
  );
}

export function OverviewMetrics({ products }: { products: Product[] }) {
  const totalProducts = products.length;
  const averagePrice = totalProducts ? products.reduce((sum, product) => sum + product.price, 0) / totalProducts : 0;
  const averageRating = totalProducts ? products.reduce((sum, product) => sum + product.rating, 0) / totalProducts : 0;
  const totalCategories = new Set(products.map((product) => product.category)).size;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <MetricCard label="Total Products" value={String(totalProducts)} icon={<Package size={18} />} trend="Live count" accent="bg-cyan-500/15 text-cyan-300" />
      <MetricCard label="Average Product Price" value={`$${averagePrice.toFixed(2)}`} icon={<DollarSign size={18} />} trend="Updated" accent="bg-violet-500/15 text-violet-300" />
      <MetricCard label="Average Product Rating" value={averageRating.toFixed(2)} icon={<Star size={18} />} trend="Average rating" accent="bg-amber-500/15 text-amber-300" />
      <MetricCard label="Total Categories" value={String(totalCategories)} icon={<Tags size={18} />} trend="Segmented" accent="bg-emerald-500/15 text-emerald-300" />
    </div>
  );
}
