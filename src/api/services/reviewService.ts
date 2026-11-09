import api, { unwrap } from '../axios';
import type { Review } from '../../types';
export const reviewService = {
  forProduct: (id: string) => unwrap(api.get<{ data: Review[] }>(`/v1/products/${id}/reviews`)).then((r) => r.data),
  create: (id: string, b: { review: string; rating: number }) => unwrap(api.post(`/v1/products/${id}/reviews`, b)),
  remove: (reviewId: string) => unwrap(api.delete(`/v1/reviews/${reviewId}`)),
};
