import api, { unwrap } from '../axios';
import type { CartResponse } from '../../types';

export const cartService = {
  get: () => unwrap(api.get<CartResponse>('/v1/cart')),
  add: (productId: string) => unwrap(api.post('/v1/cart', { productId })),
  update: (productId: string, count: number) => unwrap(api.put<CartResponse>(`/v1/cart/${productId}`, { count: String(count) })),
  remove: (productId: string) => unwrap(api.delete<CartResponse>(`/v1/cart/${productId}`)),
  clear: () => unwrap(api.delete('/v1/cart')),
};
