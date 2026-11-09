import api, { unwrap } from '../axios';
import type { Product } from '../../types';
export type ProductParams = Record<string, string | number | undefined>;
export const productService = {
  list: (params: ProductParams = {}) => unwrap(api.get<{ results?: number; metadata?: unknown; data: Product[] }>('/v1/products', { params })),
  get: (id: string) => unwrap(api.get<{ data: Product }>(`/v1/products/${id}`)).then((r) => r.data),
};
