import api, { unwrap } from '../axios';
import type { Product } from '../../types';
export const wishlistService = {
  get: () => unwrap(api.get<{ count?: number; data: Product[] }>('/v1/wishlist')),
  add: (productId: string) => unwrap(api.post<{ data: string[] }>('/v1/wishlist', { productId })),
  remove: (productId: string) => unwrap(api.delete<{ data: string[] }>(`/v1/wishlist/${productId}`)),
};
