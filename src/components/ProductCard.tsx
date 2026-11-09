import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon as FA } from '@fortawesome/react-fontawesome';
import { faPlus, faRotate, faEye, faHeart, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartR } from '@fortawesome/free-regular-svg-icons';
import type { Product } from '../types';
import { Stars } from './common';
import { discountOf, price } from '../utils/format';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useRequireAuth } from '../hooks/useRequireAuth';
import { errMsg } from '../api/axios';

export default function ProductCard({ p }: { p: Product }) {
  const { ids, toggle } = useWishlist();
  const { add } = useCart();
  const toast = useToast();
  const requireAuth = useRequireAuth();
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);
  const d = discountOf(p);
  const liked = ids.has(p._id);

  const onHeart = async () => {
    if (!requireAuth()) return;
    try { toast((await toggle(p._id)) ? 'Added to wishlist' : 'Removed from wishlist'); } catch (e) { toast(errMsg(e), 'error'); }
  };
  const onAdd = async () => {
    if (!requireAuth()) return;
    setBusy(true);
    try { await add(p._id); toast('Added to cart'); } catch (e) { toast(errMsg(e), 'error'); } finally { setBusy(false); }
  };
  const iconBtn = 'flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs text-slate-600 shadow-sm ring-1 ring-slate-100 transition hover:text-green-600';

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:shadow-md">
      {d.has && <span className="absolute left-2 top-2 z-10 rounded bg-red-500 px-2 py-0.5 text-xs font-bold text-white">-{d.pct}%</span>}
      <div className="absolute right-3 top-3 z-10 flex flex-col gap-2">
        <button aria-label="Wishlist" onClick={onHeart} className={`${iconBtn} ${liked ? 'text-red-500' : ''}`}><FA icon={liked ? faHeart : faHeartR} /></button>
        <button aria-label="Compare" onClick={() => toast('Compare is not available yet', 'info')} className={iconBtn}><FA icon={faRotate} /></button>
        <button aria-label="Quick view" onClick={() => nav(`/products/${p._id}`)} className={iconBtn}><FA icon={faEye} /></button>
      </div>
      <Link to={`/products/${p._id}`} className="block h-60 bg-white">
        <img src={p.imageCover} alt={p.title} loading="lazy" className="h-full w-full object-contain" />
      </Link>
      <div className="flex flex-1 flex-col p-4 pt-3">
        <span className="text-xs text-slate-500">{p.category?.name}</span>
        <Link to={`/products/${p._id}`} className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-slate-800 hover:text-green-600">{p.title}</Link>
        <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
          <Stars value={p.ratingsAverage} /> <span>{p.ratingsAverage ?? 0} ({p.ratingsQuantity ?? 0})</span>
        </div>
        <div className="mt-auto flex items-end justify-between pt-3">
          <div className="flex items-baseline gap-2">
            <span className={`text-lg font-bold ${d.has ? 'text-green-600' : 'text-slate-900'}`}>{price(d.current)}</span>
            {d.has && <span className="text-xs text-slate-400 line-through">{price(p.price)}</span>}
          </div>
          <button aria-label="Add to cart" onClick={onAdd} disabled={busy} className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-white transition hover:bg-green-700 disabled:opacity-60">
            <FA icon={busy ? faSpinner : faPlus} spin={busy} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProductGrid({ items }: { items: Product[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((p) => <ProductCard key={p._id} p={p} />)}
    </div>
  );
}
