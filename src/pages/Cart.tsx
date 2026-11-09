import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon as FA } from '@fortawesome/react-fontawesome';
import { faBox, faArrowRight, faMinus, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { btnPrimary, container, EmptyState, SectionTitle, Spinner } from '../components/common';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { errMsg } from '../api/axios';
import { price } from '../utils/format';

export default function Cart() {
  const { cart, loading, update, remove, clear } = useCart();
  const { token } = useAuth();
  const toast = useToast();
  const [busy, setBusy] = useState('');
  const act = async (key: string, fn: () => Promise<void>) => { setBusy(key); try { await fn(); } catch (e) { toast(errMsg(e), 'error'); } finally { setBusy(''); } };

  if (loading && !cart) return <Spinner />;
  const items = cart?.products ?? [];
  if (!items.length) {
    return (
      <EmptyState round icon={faBox} title="Your cart is empty" text={token ? "Looks like you haven't added anything to your cart yet. Start exploring our products!" : 'Sign in to view your cart. Start exploring our products!'}>
        <Link to="/products" className={`${btnPrimary} self-center`}>Start Shopping <FA icon={faArrowRight} /></Link>
      </EmptyState>
    );
  }

  return (
    <div className={`${container} py-8`}>
      <SectionTitle a="Shopping" b="Cart" right={<button onClick={() => act('clear', clear)} className="text-sm text-red-500 hover:underline">Clear cart</button>} />
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          {items.map((it) => (
            <div key={it._id} className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm">
              <Link to={`/products/${it.product._id}`}><img src={it.product.imageCover} alt={it.product.title} className="h-24 w-24 rounded-lg object-contain" /></Link>
              <div className="min-w-0 flex-1">
                <Link to={`/products/${it.product._id}`} className="line-clamp-2 text-sm font-semibold hover:text-green-600">{it.product.title}</Link>
                <p className="text-xs text-slate-500">{it.product.category?.name}</p>
                <p className="mt-1 font-bold text-green-600">{price(it.price)}</p>
              </div>
              <div className="flex items-center overflow-hidden rounded-lg border border-slate-200">
                <button disabled={!!busy || it.count <= 1} onClick={() => act(it._id, () => update(it.product._id, it.count - 1))} className="px-3 py-2 hover:bg-slate-50 disabled:opacity-40" aria-label="Decrease"><FA icon={faMinus} className="text-xs" /></button>
                <span className="w-8 text-center text-sm font-semibold">{it.count}</span>
                <button disabled={!!busy} onClick={() => act(it._id, () => update(it.product._id, it.count + 1))} className="px-3 py-2 hover:bg-slate-50 disabled:opacity-40" aria-label="Increase"><FA icon={faPlus} className="text-xs" /></button>
              </div>
              <p className="hidden w-24 text-right text-sm font-bold sm:block">{price(it.price * it.count)}</p>
              <button disabled={!!busy} onClick={() => act(it._id, () => remove(it.product._id))} className="p-2 text-slate-400 hover:text-red-500" aria-label="Remove"><FA icon={faTrash} /></button>
            </div>
          ))}
        </div>
        <aside className="h-fit rounded-xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold">Order Summary</h3>
          <div className="mt-4 flex justify-between text-sm text-slate-600"><span>Items ({items.reduce((a, i) => a + i.count, 0)})</span><span>{price(cart!.totalCartPrice)}</span></div>
          <div className="mt-4 flex justify-between border-t border-slate-100 pt-4 text-lg font-bold"><span>Total</span><span className="text-green-600">{price(cart!.totalCartPrice)}</span></div>
          <Link to="/checkout" className={`${btnPrimary} mt-5 w-full`}>Proceed to Checkout <FA icon={faArrowRight} /></Link>
          <Link to="/products" className="mt-3 block text-center text-sm text-green-600 hover:underline">Continue Shopping</Link>
        </aside>
      </div>
    </div>
  );
}
