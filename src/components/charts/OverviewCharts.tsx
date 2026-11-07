import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { Product } from '../../types';

const COLORS = ['#0f766e', '#3b82a0', '#7c83a8', '#b08b58', '#7f9b76', '#a16b6b', '#607d9b', '#8b789d'];
const tooltipStyle = { backgroundColor: 'var(--panel)', border: '1px solid var(--panel-border)', borderRadius: '10px', color: 'var(--text)', boxShadow: '0 8px 24px rgba(15,23,42,.12)' };
const gridColor = 'var(--chart-grid)';
const tickColor = 'var(--chart-text)';

function groupProducts(products: Product[]) {
  return products.reduce<Record<string, Product[]>>((groups, product) => {
    (groups[product.category] ??= []).push(product);
    return groups;
  }, {});
}

export function CategoryBarChart({ products }: { products: Product[] }) {
  const data = Object.entries(groupProducts(products)).map(([name, items]) => ({ name, count: items.length })).sort((a, b) => b.count - a.count);
  return (
    <section className="surface h-[350px] min-w-0 p-5 sm:p-6">
      <div className="mb-5"><p className="muted-label">CATALOG</p><h2 className="mt-1 text-lg font-semibold text-white">Products by category</h2></div>
      <ResponsiveContainer width="100%" height="78%"><BarChart data={data} margin={{ top: 4, right: 8, left: -18, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} /><XAxis dataKey="name" stroke={tickColor} tick={{ fill: tickColor, fontSize: 11 }} interval={0} angle={-18} textAnchor="end" height={48} /><YAxis allowDecimals={false} stroke={tickColor} tick={{ fill: tickColor, fontSize: 11 }} />
        <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [value.toLocaleString(), 'Products']} /><Bar dataKey="count" name="Product count" fill="#43877d" radius={[5, 5, 0, 0]} maxBarSize={44} />
      </BarChart></ResponsiveContainer>
    </section>
  );
}

export function PriceBarChart({ products }: { products: Product[] }) {
  const data = Object.entries(groupProducts(products)).map(([name, items]) => ({ name, average: items.reduce((sum, product) => sum + product.price, 0) / items.length })).sort((a, b) => b.average - a.average);
  return (
    <section className="surface h-[350px] min-w-0 p-5 sm:p-6">
      <div className="mb-4"><p className="muted-label">PRICING</p><h2 className="mt-1 text-lg font-semibold text-white">Average price by category</h2></div>
      <ResponsiveContainer width="100%" height="78%"><BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} /><XAxis dataKey="name" stroke={tickColor} tick={{ fill: tickColor, fontSize: 11 }} interval={0} angle={-18} textAnchor="end" height={48} /><YAxis stroke={tickColor} tick={{ fill: tickColor, fontSize: 11 }} tickFormatter={(value: number) => `$${value}`} />
        <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [`$${value.toFixed(2)}`, 'Average price']} /><Bar dataKey="average" name="Average price" fill="#668eaa" radius={[5, 5, 0, 0]} maxBarSize={44} />
      </BarChart></ResponsiveContainer>
    </section>
  );
}

export function CategoryDonutChart({ products }: { products: Product[] }) {
  const data = Object.entries(groupProducts(products)).map(([name, items]) => ({ name, value: items.length }));
  return (
    <section className="surface h-[350px] min-w-0 p-5 sm:p-6">
      <div className="mb-3"><p className="muted-label">DISTRIBUTION</p><h2 className="mt-1 text-lg font-semibold text-white">Product distribution</h2></div>
      <ResponsiveContainer width="100%" height="80%"><PieChart><Pie data={data} dataKey="value" nameKey="name" innerRadius={58} outerRadius={100} paddingAngle={2}>
        {data.map((entry, index) => <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />)}
      </Pie><Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [value.toLocaleString(), 'Products']} /></PieChart></ResponsiveContainer>
    </section>
  );
}

export function CategoryRatingChart({ products }: { products: Product[] }) {
  const data = Object.entries(groupProducts(products)).map(([name, items]) => ({ name, rating: items.reduce((sum, product) => sum + product.rating, 0) / items.length })).sort((a, b) => b.rating - a.rating);
  return (
    <section className="surface h-[350px] min-w-0 p-5 sm:p-6">
      <div className="mb-4"><p className="muted-label">CUSTOMER RATINGS</p><h2 className="mt-1 text-lg font-semibold text-white">Average rating by category</h2></div>
      <ResponsiveContainer width="100%" height="78%"><BarChart data={data} margin={{ top: 8, right: 10, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} /><XAxis dataKey="name" stroke={tickColor} tick={{ fill: tickColor, fontSize: 11 }} interval={0} angle={-18} textAnchor="end" height={48} /><YAxis domain={[0, 5]} stroke={tickColor} tick={{ fill: tickColor, fontSize: 11 }} />
        <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [value.toFixed(2), 'Average rating']} /><Bar dataKey="rating" name="Average rating" fill="#b08b58" radius={[5, 5, 0, 0]} maxBarSize={44} />
      </BarChart></ResponsiveContainer>
    </section>
  );
}

export function TopRatedProducts({ products }: { products: Product[] }) {
  const topProducts = [...products].sort((a, b) => b.rating - a.rating).slice(0, 5);
  return (
    <section className="surface p-5 sm:p-6">
      <div className="mb-5"><p className="muted-label">TOP PERFORMERS</p><h2 className="mt-1 text-lg font-semibold text-white">Top-rated products</h2></div>
      <ol className="space-y-3">{topProducts.map((product, index) => <li key={product.id} className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
        <div className="flex min-w-0 items-center gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-200">{String(index + 1).padStart(2, '0')}</span><div className="min-w-0"><p className="truncate text-sm font-medium text-white">{product.title}</p><p className="truncate text-xs capitalize text-slate-400">{product.category}</p></div></div><span className="shrink-0 text-sm font-semibold text-amber-600">★ {product.rating.toFixed(1)}</span>
      </li>)}</ol>
    </section>
  );
}
