import axios from 'axios';
import type { Product, ProductsResponse } from '../types';

const api = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 15000
});

export async function fetchProducts(): Promise<Product[]> {
  const { data } = await api.get<ProductsResponse>('/products?limit=100');
  return data.products;
}
