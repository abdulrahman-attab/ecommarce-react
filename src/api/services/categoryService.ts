import api, { unwrap } from '../axios';
import type { Named } from '../../types';
export const categoryService = {
  list: () => unwrap(api.get<{ data: Named[] }>('/v1/categories')).then((r) => r.data),
  get: (id: string) => unwrap(api.get<{ data: Named }>(`/v1/categories/${id}`)).then((r) => r.data),
};
