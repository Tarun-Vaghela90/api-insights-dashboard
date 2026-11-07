import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { Product } from '../../types';

const COLORS = ['#0f766e', '#3b82a0', '#7c83a8', '#b08b58', '#7f9b76', '#a16b6b', '#607d9b', '#8b789d', '#659b91', '#9a845e'];
const tooltipStyle = { backgroundColor: 'var(--panel)', border: '1px solid var(--panel-border)', borderRadius: '10px', color: 'var(--text)', boxShadow: '0 8px 24px rgba(15,23,42,.12)' };
const gridColor = 'var(--chart-grid)';
const tickColor = 'var(--chart-text)';
const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const TOP_CATEGORIES = 10;

function groupProducts(products: Product[]) {
  return products.reduce<Record<string, Product[]>>((groups, product) => {
    (groups[product.category] ??= []).push(product);
    return groups;
  }, {});
}

function topCategories<T extends { name: string }>(data: T[], metric: (item: T) => number) {
  return data.sort((a, b) => metric(b) - metric(a)).slice(0, TOP_CATEGORIES);
}

function CategoryComparisonChart({
  title,
  eyebrow,
  data,
  dataKey,
  color,
  valueFormatter,
  valueLabel,
  axisFormatter,
  domain
}: {
  title: string;
  eyebrow: string;
  data: Array<{ name: string; value: number }>;
  dataKey: string;
  color: string;
  valueFormatter: (value: number) => string;
  valueLabel: string;
  axisFormatter?: (value: number) => string;
  domain?: [number, number];
}) {
  const chartHeight = Math.max(330, data.length * 34 + 90);
  return (
    <section className="surface min-w-0 p-5 sm:p-6" style={{ minHeight: 350 }}>
      <div className="mb-4"><p className="muted-label">{eyebrow}</p><h2 className="mt-1 text-lg font-semibold text-white">{title}</h2><p className="mt-1 text-xs text-slate-500">Top 10 categories</p></div>
      <div style={{ height: chartHeight - 100 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
            <XAxis type="number" domain={domain} stroke={tickColor} tick={{ fill: tickColor, fontSize: 11 }} tickFormatter={axisFormatter} />
            <YAxis type="category" dataKey="name" width={126} stroke={tickColor} tick={{ fill: tickColor, fontSize: 11 }} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} labelFormatter={(label) => `Category: ${String(label)}`} formatter={(value: number) => [valueFormatter(value), valueLabel]} />
            <Bar dataKey={dataKey} name={valueLabel} fill={color} radius={[0, 5, 5, 0]} maxBarSize={22} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export function CategoryBarChart({ products }: { products: Product[] }) {
  const data = topCategories(Object.entries(groupProducts(products)).map(([name, items]) => ({ name, count: items.length })), (item) => item.count)
    .map(({ name, count }) => ({ name, value: count }));
  return <CategoryComparisonChart title="Products by category" eyebrow="CATALOG" data={data} dataKey="value" color="#43877d" valueFormatter={(value) => value.toLocaleString()} valueLabel="Products" />;
}

export function PriceBarChart({ products }: { products: Product[] }) {
  const data = topCategories(Object.entries(groupProducts(products)).map(([name, items]) => ({ name, average: items.reduce((sum, product) => sum + product.price, 0) / items.length })), (item) => item.average)
    .map(({ name, average }) => ({ name, value: average }));
  return <CategoryComparisonChart title="Average price by category" eyebrow="PRICING" data={data} dataKey="value" color="#668eaa" valueFormatter={(value) => currency.format(value)} valueLabel="Average price" axisFormatter={(value) => `$${value.toLocaleString('en-US')}`} />;
}

export function CategoryDonutChart({ products }: { products: Product[] }) {
  const data = topCategories(Object.entries(groupProducts(products)).map(([name, items]) => ({ name, value: items.length })), (item) => item.value);
  return (
    <section className="surface h-[390px] min-w-0 p-5 sm:p-6">
      <div className="mb-3"><p className="muted-label">DISTRIBUTION</p><h2 className="mt-1 text-lg font-semibold text-white">Product distribution</h2><p className="mt-1 text-xs text-slate-500">Top 10 categories</p></div>
      <ResponsiveContainer width="100%" height="78%"><PieChart><Pie data={data} dataKey="value" nameKey="name" innerRadius={58} outerRadius={100} paddingAngle={2}>
        {data.map((entry, index) => <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />)}
      </Pie><Tooltip contentStyle={tooltipStyle} labelFormatter={(label) => `Category: ${String(label)}`} formatter={(value: number) => [value.toLocaleString(), 'Products']} /></PieChart></ResponsiveContainer>
    </section>
  );
}

export function CategoryRatingChart({ products }: { products: Product[] }) {
  const data = topCategories(Object.entries(groupProducts(products)).map(([name, items]) => ({ name, rating: items.reduce((sum, product) => sum + product.rating, 0) / items.length })), (item) => item.rating)
    .map(({ name, rating }) => ({ name, value: rating }));
  return <CategoryComparisonChart title="Average rating by category" eyebrow="CUSTOMER RATINGS" data={data} dataKey="value" color="#b08b58" valueFormatter={(value) => `${value.toFixed(2)} / 5`} valueLabel="Average rating" domain={[0, 5]} />;
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
