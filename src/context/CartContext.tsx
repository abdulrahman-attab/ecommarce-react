import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';
import { cartService } from '../api/services/cartService';
import { useAuth } from './AuthContext';
import type { Cart, CartResponse } from '../types';

interface CartCtx {
  cart: Cart | null; cartId: string | null; count: number; loading: boolean;
  add: (id: string) => Promise<void>; update: (id: string, count: number) => Promise<void>;
  remove: (id: string) => Promise<void>; clear: () => Promise<void>; refresh: () => Promise<void>;
}
const Ctx = createContext<CartCtx>(null as unknown as CartCtx);
export const useCart = () => useContext(Ctx);

export function CartProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const reset = () => { setCart(null); setCount(0); };
  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const r = await cartService.get();
      setCart(r.data); setCount(r.numOfCartItems ?? r.data?.products?.length ?? 0);
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 404) reset();
      else throw e;
    } finally { setLoading(false); }
  }, []);

  const apply = async (r: CartResponse) => {
    const d = r?.data;
    if (d && Array.isArray(d.products) && d.products.every((p) => typeof (p.product as unknown) === 'object')) {
      setCart(d); setCount(r.numOfCartItems ?? d.products.length);
    } else await refresh();
  };

  useEffect(() => { if (token) refresh().catch(() => {}); else reset(); }, [token, refresh]);

  const value: CartCtx = {
    cart, cartId: cart?._id ?? null, count, loading, refresh,
    add: async (id) => { await cartService.add(id); await refresh(); },
    update: async (id, c) => apply(await cartService.update(id, c)),
    remove: async (id) => apply(await cartService.remove(id)),
    clear: async () => { await cartService.clear(); reset(); },
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
