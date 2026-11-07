import { useEffect, useMemo, useState } from 'react';
import { Navigate, Outlet, Route, Routes, useOutletContext } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from './lib/api';
import { Sidebar, TopBar } from './components/layout/Sidebar';
import { DataSourceCard, OverviewMetrics } from './components/ui/Card';
import { CategoryBarChart, CategoryDonutChart, CategoryRatingChart, PriceBarChart, TopRatedProducts } from './components/charts/OverviewCharts';
import type { Product } from './types';

type Theme = 'dark' | 'light';
type ProductOutletContext = { search: string };

function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    try { return localStorage.getItem('api-insights-theme') === 'dark' ? 'dark' : 'light'; }
    catch { return 'light'; }
  });
  useEffect(() => {
    try { localStorage.setItem('api-insights-theme', theme); } catch { /* Storage is optional. */ }
  }, [theme]);
  return { theme, toggleTheme: () => setTheme((current) => current === 'dark' ? 'light' : 'dark') };
}

function DashboardLayout() {
  const [search, setSearch] = useState('');
  const { theme, toggleTheme } = useTheme();
  return <div className={`dashboard-shell theme-${theme} flex min-h-screen`}><Sidebar /><div className="dashboard-main flex min-w-0 flex-1 flex-col"><TopBar search={search} onSearchChange={setSearch} theme={theme} onToggleTheme={toggleTheme} /><main className="mx-auto w-full max-w-[1600px] flex-1 p-4 md:p-8"><Outlet context={{ search }} /></main></div></div>;
}

function PageHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div className="mb-7"><p className="muted-label">{eyebrow}</p><h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h1><p className="mt-2 max-w-2xl text-sm text-slate-400 sm:text-base">{description}</p></div>;
}

function useProductCatalog() {
  return useQuery({ queryKey: ['products'], queryFn: fetchProducts, staleTime: 5 * 60 * 1000 });
}

function QueryError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return <div role="alert" className="surface space-y-3 p-6"><h2 className="text-lg font-semibold text-white">Could not load dashboard data</h2><p className="text-sm text-slate-400">{message}</p><button onClick={onRetry} className="rounded-lg bg-cyan-700 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-800">Try again</button></div>;
}

function OverviewPage() {
  const query = useProductCatalog();
  const products = query.data?.products ?? [];
  return <div className="space-y-6">
    <PageHeading eyebrow="OVERVIEW" title="Good morning" description="A clear view of the sample product catalog and its category insights." />
    {query.isError ? <><DataSourceCard connected={false} description="The API request failed. Check your connection and retry." /><QueryError message={query.error instanceof Error ? query.error.message : 'Unable to load products.'} onRetry={() => void query.refetch()} /></> : query.isLoading ? <div className="surface p-8 text-sm text-slate-500">Loading product data…</div> : <>
      <OverviewMetrics products={products} total={query.data?.total ?? 0} />
      <div className="grid gap-5 xl:grid-cols-[1.65fr_1fr]"><CategoryBarChart products={products} /><TopRatedProducts products={products} /></div>
      <div className="grid gap-5 lg:grid-cols-[1fr_2fr]"><DataSourceCard connected /><div className="grid gap-5 md:grid-cols-2"><PriceBarChart products={products} /><CategoryDonutChart products={products} /></div></div>
      <p className="text-xs text-slate-500">Demonstration data provided by DummyJSON. Statistics use all {query.data?.total.toLocaleString()} products returned by the API.</p>
    </>}
  </div>;
}

function ProductsPage() {
  const { search } = useOutletContext<ProductOutletContext>();
  const query = useProductCatalog();
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const products = query.data?.products ?? [];
  const categories = useMemo(() => [...new Set(products.map((product) => product.category))].sort(), [products]);
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter((product) => (!term || `${product.title} ${product.category} ${product.brand ?? ''}`.toLowerCase().includes(term)) && (category === 'all' || product.category === category));
  }, [products, search, category]);
  useEffect(() => setPage(1), [search, category]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visibleProducts = filtered.slice((page - 1) * pageSize, page * pageSize);
  if (query.isLoading) return <div className="text-slate-500">Loading products…</div>;
  if (query.isError) return <QueryError message={query.error instanceof Error ? query.error.message : 'Unable to load products.'} onRetry={() => void query.refetch()} />;

  return <div className="space-y-6"><PageHeading eyebrow="CATALOG" title="Products" description="Search, filter, and browse the complete sample product catalog." />
    <div className="surface flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-slate-500">Showing {filtered.length ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, filtered.length)} of {filtered.length} matching products</p><label className="flex items-center gap-2 text-sm text-slate-500">Category<select value={category} onChange={(event) => setCategory(event.target.value)} className="dashboard-input rounded-lg border px-3 py-2"><option value="all">All categories</option>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select></label></div>
    {!visibleProducts.length ? <div className="surface p-8 text-center text-slate-500">No products match your search and category filter.</div> : <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{visibleProducts.map((product: Product) => <article key={product.id} className="surface overflow-hidden"><img src={product.thumbnail} alt={product.title} className="h-48 w-full bg-slate-100 object-cover dark:bg-slate-800" loading="lazy" /><div className="space-y-3 p-5"><div className="flex items-start justify-between gap-3"><div><h2 className="font-semibold text-white">{product.title}</h2><p className="mt-1 text-sm text-slate-400">{product.brand || 'Unbranded'}</p></div><span className="rounded-full bg-cyan-500/10 px-2.5 py-1 text-xs capitalize text-cyan-800 dark:text-cyan-200">{product.category}</span></div><p className="line-clamp-2 min-h-10 text-sm leading-5 text-slate-400">{product.description}</p><div className="flex items-center justify-between border-t border-slate-200 pt-3 text-sm dark:border-slate-700"><span className="font-semibold text-white">${product.price.toFixed(2)}</span><span className="text-amber-600">★ {product.rating.toFixed(1)}</span></div></div></article>)}</div>}
    <div className="flex items-center justify-between"><span className="text-sm text-slate-500">Page {page} of {pageCount}</span><div className="flex gap-2"><button disabled={page <= 1} onClick={() => setPage((current) => current - 1)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-200">Previous</button><button disabled={page >= pageCount} onClick={() => setPage((current) => current + 1)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-200">Next</button></div></div>
  </div>;
}

function buildCategorySummary(products: Product[]) {
  const groups = products.reduce<Record<string, { count: number; totalPrice: number; totalRating: number }>>((acc, product) => {
    const item = acc[product.category] ??= { count: 0, totalPrice: 0, totalRating: 0 };
    item.count += 1; item.totalPrice += product.price; item.totalRating += product.rating; return acc;
  }, {});
  return Object.entries(groups).map(([category, value]) => ({ category, count: value.count, avgPrice: value.totalPrice / value.count, avgRating: value.totalRating / value.count })).sort((a, b) => a.category.localeCompare(b.category));
}

function CategoriesPage() {
  const query = useProductCatalog();
  if (query.isLoading) return <div className="text-slate-500">Loading categories…</div>;
  if (query.isError) return <QueryError message={query.error instanceof Error ? query.error.message : 'Unable to load products.'} onRetry={() => void query.refetch()} />;
  const summary = buildCategorySummary(query.data?.products ?? []);
  return <div className="space-y-6"><PageHeading eyebrow="CATALOG BREAKDOWN" title="Categories" description="Compare product counts, average prices, and ratings across the complete catalog." />
    <div className="surface overflow-hidden"><div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm"><thead><tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700"><th className="px-5 py-4 font-medium">Category</th><th className="px-5 py-4 text-right font-medium">Products</th><th className="px-5 py-4 text-right font-medium">Average price</th><th className="px-5 py-4 text-right font-medium">Average rating</th></tr></thead><tbody>{summary.map((item) => <tr key={item.category} className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40"><th scope="row" className="px-5 py-4 font-medium capitalize text-white">{item.category}</th><td className="px-5 py-4 text-right tabular-nums text-slate-600 dark:text-slate-300">{item.count.toLocaleString()}</td><td className="px-5 py-4 text-right tabular-nums text-slate-600 dark:text-slate-300">${item.avgPrice.toFixed(2)}</td><td className="px-5 py-4 text-right tabular-nums text-slate-600 dark:text-slate-300">{item.avgRating.toFixed(2)} <span className="text-amber-600">★</span></td></tr>)}</tbody></table></div><p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500 dark:border-slate-800">Calculated from all {query.data?.total.toLocaleString()} products in DummyJSON demonstration data.</p></div>
  </div>;
}

function AnalyticsPage() {
  const query = useProductCatalog();
  if (query.isLoading) return <div className="text-slate-500">Loading analytics…</div>;
  if (query.isError) return <QueryError message={query.error instanceof Error ? query.error.message : 'Unable to load products.'} onRetry={() => void query.refetch()} />;
  const products = query.data?.products ?? [];
  return <div className="space-y-6"><PageHeading eyebrow="INSIGHTS" title="Analytics" description="Category comparisons calculated from every product returned by the API." /><div className="grid gap-5 xl:grid-cols-2"><PriceBarChart products={products} /><CategoryRatingChart products={products} /><CategoryDonutChart products={products} /><CategoryBarChart products={products} /></div><p className="text-xs text-slate-500">Demonstration data from DummyJSON · {query.data?.total.toLocaleString()} products analyzed</p></div>;
}

export default function App() {
  return <Routes><Route element={<DashboardLayout />}><Route index element={<Navigate to="/overview" replace />} /><Route path="/overview" element={<OverviewPage />} /><Route path="/products" element={<ProductsPage />} /><Route path="/categories" element={<CategoriesPage />} /><Route path="/analytics" element={<AnalyticsPage />} /></Route><Route path="*" element={<Navigate to="/overview" replace />} /></Routes>;
}
