import api, { unwrap } from '../axios';
import type { Order, ShippingAddress } from '../../types';
export const orderService = {
  createCash: (cartId: string, shippingAddress: ShippingAddress) => unwrap(api.post(`/v1/orders/${cartId}`, { shippingAddress })),
  byUser: (userId: string) => unwrap(api.get<Order[] | { data: Order[] }>(`/v1/orders/user/${userId}`)).then((d) => (Array.isArray(d) ? d : d.data ?? [])),
};
export const paymentService = {
  checkoutSession: (cartId: string, shippingAddress: ShippingAddress, returnUrl: string) =>
    unwrap(api.post<{ status?: string; session?: { url?: string } }>(`/v1/orders/checkout-session/${cartId}`, { shippingAddress }, { params: { url: returnUrl } })),
};
