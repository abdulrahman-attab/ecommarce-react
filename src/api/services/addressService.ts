import api, { unwrap } from '../axios';
import type { Address } from '../../types';
export const addressService = {
  list: () => unwrap(api.get<{ data: Address[] }>('/v1/addresses')).then((r) => r.data),
  add: (b: Omit<Address, '_id'>) => unwrap(api.post('/v1/addresses', b)),
  remove: (id: string) => unwrap(api.delete(`/v1/addresses/${id}`)),
};
