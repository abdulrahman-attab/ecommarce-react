import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { wishlistService } from '../api/services/wishlistService';
import { useAuth } from './AuthContext';
import type { Product } from '../types';

interface WishCtx { ids: Set<string>; products: Product[]; loading: boolean; toggle: (id: string) => Promise<boolean>; refresh: () => Promise<void> }
const Ctx = createContext<WishCtx>(null as unknown as WishCtx);
export const useWishlist = () => useContext(Ctx);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [ids, setIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const r = await wishlistService.get();
      setProducts(r.data ?? []); setIds(new Set((r.data ?? []).map((p) => p._id)));
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { if (token) refresh().catch(() => {}); else { setProducts([]); setIds(new Set()); } }, [token, refresh]);

  const toggle = async (id: string) => {
    const has = ids.has(id);
    const r = has ? await wishlistService.remove(id) : await wishlistService.add(id);
    if (Array.isArray(r.data) && r.data.every((x) => typeof x === 'string')) setIds(new Set(r.data));
    else await refresh();
    if (has) setProducts((p) => p.filter((x) => x._id !== id));
    return !has;
  };
  return <Ctx.Provider value={{ ids, products, loading, toggle, refresh }}>{children}</Ctx.Provider>;
}
