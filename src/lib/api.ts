import axios from 'axios';
import type { ProductCatalog, ProductsResponse } from '../types';

const api = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 15000
});

const PAGE_SIZE = 100;

// Load every API page so dashboard KPIs and category analytics represent the full catalog.
export async function fetchProducts(): Promise<ProductCatalog> {
  const firstPage = await api.get<ProductsResponse>(`/products?limit=${PAGE_SIZE}&skip=0`);
  const { products, total } = firstPage.data;
  const allProducts = [...products];

  for (let skip = products.length; skip < total; skip += PAGE_SIZE) {
    const { data } = await api.get<ProductsResponse>(`/products?limit=${PAGE_SIZE}&skip=${skip}`);
    allProducts.push(...data.products);
  }

  return { products: allProducts, total };
}
