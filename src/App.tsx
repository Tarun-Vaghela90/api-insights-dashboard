import { useState } from 'react';
import { Navigate, Outlet, Route, Routes, useOutletContext } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from './lib/api';
import { Sidebar, TopBar } from './components/layout/Sidebar';
import { OverviewMetrics } from './components/ui/Card';
import { CategoryBarChart, CategoryDonutChart, PriceBarChart, TopRatedProducts } from './components/charts/OverviewCharts';
import type { Product } from './types';

function DashboardLayout() {
  const [search, setSearch] = useState('');

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <TopBar search={search} onSearchChange={setSearch} />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet context={{ search }} />
        </main>
      </div>
    </div>
  );
}

function OverviewPage() {
  const { data: products = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  });

  if (isLoading) return <div className="text-slate-300">Loading dashboard...</div>;
  if (isError) return <QueryError message={error instanceof Error ? error.message : 'Unable to load products.'} onRetry={() => void refetch()} />;

  return (
    <div className="space-y-6">
      <OverviewMetrics products={products} />
      <div className="grid gap-4 xl:grid-cols-[1.7fr_1fr]">
        <CategoryBarChart products={products} />
        <TopRatedProducts products={products} />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <PriceBarChart products={products} />
        <CategoryDonutChart products={products} />
      </div>
    </div>
  );
}

function QueryError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div role="alert" className="surface space-y-3 p-6">
      <h2 className="text-lg font-semibold text-white">Could not load dashboard data</h2>
      <p className="text-sm text-slate-400">{message}</p>
      <button onClick={onRetry} className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-cyan-400">
        Try again
      </button>
    </div>
  );
}

function ProductsPage() {
  const { data: products = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  });
  const { search } = useOutletContext<{ search: string }>();
  const normalizedSearch = search.trim().toLowerCase();
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(normalizedSearch) ||
    product.category.toLowerCase().includes(normalizedSearch) ||
    product.brand.toLowerCase().includes(normalizedSearch)
  );

  if (isLoading) return <div className="text-slate-300">Loading products...</div>;
  if (isError) return <QueryError message={error instanceof Error ? error.message : 'Unable to load products.'} onRetry={() => void refetch()} />;

  return (
    <div className="space-y-6">
      <div className="surface p-5">
        <h2 className="text-xl font-semibold text-white">Products catalog</h2>
        <p className="mt-1 text-sm text-slate-400">{filteredProducts.length} products found</p>
      </div>
      {filteredProducts.length === 0 ? (
        <div className="surface p-8 text-center text-slate-400">No products match your search.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product: Product) => (
            <article key={product.id} className="surface overflow-hidden">
              <img src={product.thumbnail} alt={product.title} className="h-44 w-full object-cover" />
              <div className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{product.title}</h3>
                    <p className="text-sm text-slate-400">{product.brand}</p>
                  </div>
                  <span className="rounded-full bg-cyan-500/10 px-2 py-1 text-xs font-medium text-cyan-300">{product.category}</span>
                </div>
                <p className="text-sm text-slate-400">{product.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">${product.price}</span>
                  <span className="text-amber-300">★ {product.rating}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function CategoriesPage() {
  const { data: products = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  });

  if (isLoading) return <div className="text-slate-300">Loading categories...</div>;
  if (isError) return <QueryError message={error instanceof Error ? error.message : 'Unable to load products.'} onRetry={() => void refetch()} />;

  const summary = Object.entries(
    products.reduce<Record<string, { count: number; total: number; avgRating: number }>>((acc, product) => {
      const item = acc[product.category] || { count: 0, total: 0, avgRating: 0 };
      item.count += 1;
      item.total += product.price;
      item.avgRating += product.rating;
      acc[product.category] = item;
      return acc;
    }, {})
  ).map(([category, values]) => ({
    category,
    count: values.count,
    avgPrice: values.total / values.count,
    avgRating: values.avgRating / values.count
  }));

  return (
    <div className="space-y-6">
      <div className="surface p-5"><h2 className="text-xl font-semibold text-white">Categories</h2></div>
      <div className="surface overflow-x-auto">
        <table className="min-w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900/80 text-slate-400">
            <tr><th className="px-4 py-3">Category</th><th className="px-4 py-3">Products</th><th className="px-4 py-3">Avg. Price</th><th className="px-4 py-3">Avg. Rating</th></tr>
          </thead>
          <tbody>
            {summary.map((item) => (
              <tr key={item.category} className="border-t border-slate-800">
                <td className="px-4 py-3 font-medium text-white">{item.category}</td><td className="px-4 py-3">{item.count}</td><td className="px-4 py-3">${item.avgPrice.toFixed(2)}</td><td className="px-4 py-3">{item.avgRating.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AnalyticsPage() {
  const { data: products = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  });

  if (isLoading) return <div className="text-slate-300">Loading analytics...</div>;
  if (isError) return <QueryError message={error instanceof Error ? error.message : 'Unable to load products.'} onRetry={() => void refetch()} />;

  const summary = Object.entries(
    products.reduce<Record<string, { total: number; count: number }>>((acc, product) => {
      acc[product.category] = acc[product.category] || { total: 0, count: 0 };
      acc[product.category].total += product.price;
      acc[product.category].count += 1;
      return acc;
    }, {})
  ).map(([category, values]) => ({ category, averagePrice: values.total / values.count }));

  return (
    <div className="space-y-6">
      <div className="surface p-5"><h2 className="text-xl font-semibold text-white">Analytics</h2></div>
      <div className="surface p-5">
        <h3 className="mb-4 text-lg font-semibold text-white">Average price by category</h3>
        <div className="space-y-4">
          {summary.map((item) => (
            <div key={item.category}>
              <div className="mb-1 flex items-center justify-between text-sm text-slate-300"><span>{item.category}</span><span>${item.averagePrice.toFixed(2)}</span></div>
              <div className="h-2.5 rounded-full bg-slate-800">
                <div className="h-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-teal-400" style={{ width: `${Math.min(item.averagePrice / 150, 1) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<Navigate to="/overview" replace />} />
        <Route path="/overview" element={<OverviewPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/overview" replace />} />
    </Routes>
  );
}
