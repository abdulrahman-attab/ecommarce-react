import api, { unwrap } from '../axios';
import type { Named } from '../../types';
export const brandService = {
  list: () => unwrap(api.get<{ data: Named[] }>('/v1/brands', { params: { limit: 100 } })).then((r) => r.data),
  get: (id: string) => unwrap(api.get<{ data: Named }>(`/v1/brands/${id}`)).then((r) => r.data),
};
