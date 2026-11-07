import { useEffect, useState } from 'react';
import { Navigate, Outlet, Route, Routes, useOutletContext } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from './lib/api';
import { Sidebar, TopBar } from './components/layout/Sidebar';
import { OverviewMetrics } from './components/ui/Card';
import { CategoryBarChart, CategoryDonutChart, PriceBarChart, TopRatedProducts } from './components/charts/OverviewCharts';
import type { Product } from './types';

type Theme = 'dark' | 'light';

function DashboardLayout() {
  const [search, setSearch] = useState('');
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const storedTheme = localStorage.getItem('api-insights-theme');
      return storedTheme === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('api-insights-theme', theme);
    } catch {
      // Some browsers block storage access; theme still works in memory.
    }
  }, [theme]);

  return (
    <div className={`dashboard-shell theme-${theme} flex min-h-screen`}>
      <Sidebar />
      <div className="dashboard-main flex min-w-0 flex-1 flex-col">
        <TopBar
          search={search}
          onSearchChange={setSearch}
          theme={theme}
          onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
        />
        <main className="mx-auto w-full max-w-[1600px] flex-1 overflow-auto p-4 md:p-8">
          <Outlet context={{ search }} />
        </main>
      </div>
    </div>
  );
}

function PageHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="page-heading mb-7">
      <p className="muted-label">{eyebrow}</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-400 sm:text-base">{description}</p>
    </div>
  );
}

function OverviewPage() {
  const { data: products = [], isLoading, isError, error, refetch } = useQuery({ queryKey: ['products'], queryFn: fetchProducts });
  if (isLoading) return <div className="text-slate-300">Loading dashboard...</div>;
  if (isError) return <QueryError message={error instanceof Error ? error.message : 'Unable to load products.'} onRetry={() => void refetch()} />;

  return (
    <div className="space-y-7">
      <PageHeading eyebrow="OVERVIEW" title="Good morning, Tarun" description="Here’s a clear view of your product catalog and its performance." />
      <OverviewMetrics products={products} />
      <div className="grid gap-5 xl:grid-cols-[1.7fr_1fr]"><CategoryBarChart products={products} /><TopRatedProducts products={products} /></div>
      <div className="grid gap-5 xl:grid-cols-2"><PriceBarChart products={products} /><CategoryDonutChart products={products} /></div>
    </div>
  );
}

function QueryError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div role="alert" className="surface space-y-3 p-6">
      <h2 className="text-lg font-semibold text-white">Could not load dashboard data</h2>
      <p className="text-sm text-slate-400">{message}</p>
      <button onClick={onRetry} className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-cyan-400">Try again</button>
    </div>
  );
}

function ProductsPage() {
  const { data: products = [], isLoading, isError, error, refetch } = useQuery({ queryKey: ['products'], queryFn: fetchProducts });
  const { search } = useOutletContext<{ search: string }>();
  const normalizedSearch = search.trim().toLowerCase();
  const filteredProducts = products.filter((product) => product.title.toLowerCase().includes(normalizedSearch) || product.category.toLowerCase().includes(normalizedSearch) || product.brand.toLowerCase().includes(normalizedSearch));
  if (isLoading) return <div className="text-slate-300">Loading products...</div>;
  if (isError) return <QueryError message={error instanceof Error ? error.message : 'Unable to load products.'} onRetry={() => void refetch()} />;

  return (
    <div className="space-y-6">
      <PageHeading eyebrow="CATALOG" title="Products" description="Browse and search the products available in the catalog." />
      <div className="surface flex items-center justify-between p-4"><span className="text-sm text-slate-400">Matching products</span><span className="text-sm font-semibold text-white">{filteredProducts.length} of {products.length}</span></div>
      {filteredProducts.length === 0 ? <div className="surface p-8 text-center text-slate-400">No products match your search.</div> : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product: Product) => (
            <article key={product.id} className="surface overflow-hidden transition duration-200 hover:-translate-y-0.5 hover:border-slate-600">
              <img src={product.thumbnail} alt={product.title} className="h-48 w-full bg-slate-800 object-cover" loading="lazy" />
              <div className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-3"><div><h2 className="font-semibold text-white">{product.title}</h2><p className="mt-1 text-sm text-slate-400">{product.brand}</p></div><span className="rounded-full bg-cyan-500/10 px-2.5 py-1 text-xs font-medium text-cyan-300">{product.category}</span></div>
                <p className="line-clamp-2 min-h-10 text-sm leading-5 text-slate-400">{product.description}</p>
                <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-sm"><span className="font-semibold text-white">${product.price.toFixed(2)}</span><span className="text-amber-400">★ {product.rating.toFixed(1)}</span></div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function CategoriesPage() {
  const { data: products = [], isLoading, isError, error, refetch } = useQuery({ queryKey: ['products'], queryFn: fetchProducts });
  if (isLoading) return <div className="text-slate-300">Loading categories...</div>;
  if (isError) return <QueryError message={error instanceof Error ? error.message : 'Unable to load products.'} onRetry={() => void refetch()} />;
  const summary = Object.entries(products.reduce<Record<string, { count: number; total: number; avgRating: number }>>((acc, product) => {
    const item = acc[product.category] || { count: 0, total: 0, avgRating: 0 };
    item.count += 1; item.total += product.price; item.avgRating += product.rating; acc[product.category] = item; return acc;
  }, {})).map(([category, values]) => ({ category, count: values.count, avgPrice: values.total / values.count, avgRating: values.avgRating / values.count }));

  return (
    <div className="space-y-6">
      <PageHeading eyebrow="CATALOG BREAKDOWN" title="Categories" description="Compare catalog size, pricing, and ratings across product categories." />
      <div className="surface overflow-x-auto"><table className="min-w-full text-left text-sm text-slate-300"><thead className="bg-slate-900/80 text-xs uppercase tracking-wide text-slate-400"><tr><th className="px-5 py-4">Category</th><th className="px-5 py-4">Products</th><th className="px-5 py-4">Average price</th><th className="px-5 py-4">Average rating</th></tr></thead><tbody>{summary.map((item) => <tr key={item.category} className="border-t border-slate-800"><td className="px-5 py-4 font-medium capitalize text-white">{item.category}</td><td className="px-5 py-4">{item.count}</td><td className="px-5 py-4">${item.avgPrice.toFixed(2)}</td><td className="px-5 py-4">{item.avgRating.toFixed(2)} <span className="text-amber-400">★</span></td></tr>)}</tbody></table></div>
    </div>
  );
}

function AnalyticsPage() {
  const { data: products = [], isLoading, isError, error, refetch } = useQuery({ queryKey: ['products'], queryFn: fetchProducts });
  if (isLoading) return <div className="text-slate-300">Loading analytics...</div>;
  if (isError) return <QueryError message={error instanceof Error ? error.message : 'Unable to load products.'} onRetry={() => void refetch()} />;
  const summary = Object.entries(products.reduce<Record<string, { total: number; count: number }>>((acc, product) => {
    acc[product.category] = acc[product.category] || { total: 0, count: 0 }; acc[product.category].total += product.price; acc[product.category].count += 1; return acc;
  }, {})).map(([category, values]) => ({ category, averagePrice: values.total / values.count }));
  const maxPrice = Math.max(...summary.map((item) => item.averagePrice), 1);

  return (
    <div className="space-y-6">
      <PageHeading eyebrow="INSIGHTS" title="Analytics" description="Explore average product pricing across your catalog categories." />
      <div className="surface p-5 sm:p-7"><div className="mb-6"><h2 className="text-lg font-semibold text-white">Average price by category</h2><p className="mt-1 text-sm text-slate-400">Category-level pricing calculated from live product data.</p></div><div className="space-y-5">{summary.map((item) => <div key={item.category}><div className="mb-2 flex items-center justify-between text-sm"><span className="capitalize text-slate-300">{item.category}</span><span className="font-medium text-white">${item.averagePrice.toFixed(2)}</span></div><div className="h-2.5 rounded-full bg-slate-800"><div className="h-full rounded-full bg-cyan-500 transition-all" style={{ width: `${(item.averagePrice / maxPrice) * 100}%` }} /></div></div>)}</div></div>
    </div>
  );
}

export default function App() {
  return <Routes><Route element={<DashboardLayout />}><Route index element={<Navigate to="/overview" replace />} /><Route path="/overview" element={<OverviewPage />} /><Route path="/products" element={<ProductsPage />} /><Route path="/categories" element={<CategoriesPage />} /><Route path="/analytics" element={<AnalyticsPage />} /></Route><Route path="*" element={<Navigate to="/overview" replace />} /></Routes>;
}
