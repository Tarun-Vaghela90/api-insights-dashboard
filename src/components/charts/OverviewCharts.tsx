import { BarChart, Bar, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie } from 'recharts';
import type { Product } from '../../types';

const COLORS = ['#2dd4bf', '#60a5fa', '#a78bfa', '#fbbf24', '#f472b6', '#34d399', '#fb7185'];

export function CategoryBarChart({ products }: { products: Product[] }) {
  const data = Object.entries(
    products.reduce<Record<string, number>>((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {})
  )
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="surface h-[330px] p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="muted-label">Overview</p>
          <h3 className="text-lg font-semibold text-white">Products by category</h3>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} angle={-20} textAnchor="end" height={55} />
          <YAxis stroke="#94a3b8" />
          <Tooltip
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
            formatter={(value: number) => [`${value}`, 'Products']}
          />
          <Bar dataKey="count" radius={[8, 8, 0, 0]} fill="#2dd4bf" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PriceBarChart({ products }: { products: Product[] }) {
  const grouped = products.reduce<Record<string, number[]>>((acc, product) => {
    if (!acc[product.category]) acc[product.category] = [];
    acc[product.category].push(product.price);
    return acc;
  }, {});

  const data = Object.entries(grouped)
    .map(([name, prices]) => ({
      name,
      avgPrice: prices.reduce((sum, price) => sum + price, 0) / prices.length
    }))
    .sort((a, b) => b.avgPrice - a.avgPrice);

  return (
    <div className="surface h-[330px] p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="muted-label">Pricing</p>
          <h3 className="text-lg font-semibold text-white">Average price by category</h3>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} angle={-20} textAnchor="end" height={55} />
          <YAxis stroke="#94a3b8" />
          <Tooltip
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Avg price']}
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
          />
          <Bar dataKey="avgPrice" radius={[8, 8, 0, 0]} fill="#60a5fa" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryDonutChart({ products }: { products: Product[] }) {
  const data = Object.entries(
    products.reduce<Record<string, number>>((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="surface h-[330px] p-5">
      <div className="mb-5">
        <p className="muted-label">Distribution</p>
        <h3 className="text-lg font-semibold text-white">Product distribution by category</h3>
      </div>
      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={52} outerRadius={100} paddingAngle={3}>
            {data.map((entry, index) => (
              <Cell key={`${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [`${value}`, 'Products']}
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TopRatedProducts({ products }: { products: Product[] }) {
  const topProducts = [...products].sort((a, b) => b.rating - a.rating).slice(0, 5);

  return (
    <div className="surface p-5">
      <div className="mb-5">
        <p className="muted-label">Leaders</p>
        <h3 className="text-lg font-semibold text-white">Top-rated products</h3>
      </div>
      <div className="space-y-4">
        {topProducts.map((product, index) => (
          <div key={product.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold text-cyan-300">
                #{index + 1}
              </div>
              <div>
                <p className="font-medium text-white">{product.title}</p>
                <p className="text-sm text-slate-400">{product.category}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-amber-300">{product.rating.toFixed(1)}</p>
              <p className="text-xs text-slate-400">rating</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
