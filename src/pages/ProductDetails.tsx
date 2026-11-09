import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FontAwesomeIcon as FA } from '@fortawesome/react-fontawesome';
import { faCartShopping, faHeart, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartR } from '@fortawesome/free-regular-svg-icons';
import { container, ErrorBox, inputCls, Spinner, Stars, btnPrimary, btnLight } from '../components/common';
import { reviewSchema } from '../schemas/schemas';
import { productService } from '../api/services/productService';
import { reviewService } from '../api/services/reviewService';
import { useFetch } from '../hooks/useFetch';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useRequireAuth } from '../hooks/useRequireAuth';
import { errMsg } from '../api/axios';
import { discountOf, price } from '../utils/format';

type R = z.infer<typeof reviewSchema>;

export default function ProductDetails() {
  const { id = '' } = useParams();
  const { data: p, loading, error } = useFetch(() => productService.get(id), [id]);
  const reviews = useFetch(() => reviewService.forProduct(id).catch(() => []), [id]);
  const { add } = useCart();
  const { ids, toggle } = useWishlist();
  const { user } = useAuth();
  const toast = useToast();
  const requireAuth = useRequireAuth();
  const [img, setImg] = useState('');
  const [busy, setBusy] = useState(false);
  const [list, setList] = useState<number>(0);
  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<R>({ resolver: zodResolver(reviewSchema), defaultValues: { rating: 5 } });

  if (loading) return <Spinner />;
  if (error || !p) return <div className={`${container} py-10`}><ErrorBox message={error || 'Product not found'} /></div>;
  const d = discountOf(p);
  const gallery = [p.imageCover, ...(p.images ?? [])];
  const liked = ids.has(p._id);
  const revs = reviews.data ?? [];

  const onAdd = async () => { if (!requireAuth()) return; setBusy(true); try { await add(p._id); toast('Added to cart'); } catch (e) { toast(errMsg(e), 'error'); } finally { setBusy(false); } };
  const onHeart = async () => { if (!requireAuth()) return; try { toast((await toggle(p._id)) ? 'Added to wishlist' : 'Removed from wishlist'); } catch (e) { toast(errMsg(e), 'error'); } };
  const submitReview = async (v: R) => {
    if (!requireAuth()) return;
    try { await reviewService.create(p._id, v); const fresh = await reviewService.forProduct(p._id); reviews.setData(fresh); setList((x) => x + 1); reset(); toast('Review added'); } catch (e) { toast(errMsg(e), 'error'); }
  };

  return (
    <div className={`${container} py-8`}>
      <nav className="mb-5 flex flex-wrap gap-2 text-xs text-slate-500"><Link to="/" className="hover:text-green-600">Home</Link>/<Link to="/products" className="hover:text-green-600">Products</Link>/{p.category && <><Link to={`/products?category=${p.category._id}`} className="hover:text-green-600">{p.category.name}</Link>/</>}<span className="text-slate-800">{p.title}</span></nav>
      <div className="grid gap-8 rounded-2xl bg-white p-6 shadow-sm lg:grid-cols-2">
        <div>
          <div className="flex h-96 items-center justify-center rounded-xl bg-white ring-1 ring-slate-100"><img src={img || p.imageCover} alt={p.title} className="max-h-full max-w-full object-contain" /></div>
          {gallery.length > 1 && <div className="mt-3 flex gap-2 overflow-x-auto">{gallery.map((g) => <button key={g} onClick={() => setImg(g)} className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 ${(img || p.imageCover) === g ? 'border-green-600' : 'border-slate-200'}`}><img src={g} alt="" className="h-full w-full object-cover" /></button>)}</div>}
        </div>
        <div>
          {p.category && <Link to={`/products?category=${p.category._id}`} className="text-sm text-green-600">{p.category.name}</Link>}
          <h1 className="mt-1 text-2xl font-bold text-slate-900">{p.title}</h1>
          <div className="mt-3 flex items-center gap-2 text-sm text-slate-500"><Stars value={p.ratingsAverage} size="text-base" />{p.ratingsAverage ?? 0} ({p.ratingsQuantity ?? 0} reviews)</div>
          <div className="mt-4 flex items-baseline gap-3"><span className={`text-3xl font-bold ${d.has ? 'text-green-600' : 'text-slate-900'}`}>{price(d.current)}</span>{d.has && <><span className="text-slate-400 line-through">{price(p.price)}</span><span className="rounded bg-red-500 px-2 py-0.5 text-xs font-bold text-white">-{d.pct}%</span></>}</div>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">{p.description}</p>
          {p.brand && <p className="mt-4 text-sm text-slate-500">Brand: <Link to={`/products?brand=${p.brand._id}`} className="font-medium text-slate-800 hover:text-green-600">{p.brand.name}</Link></p>}
          {p.quantity != null && <p className="mt-1 text-sm text-slate-500">{p.quantity > 0 ? `${p.quantity} in stock` : 'Out of stock'}</p>}
          <div className="mt-6 flex gap-3">
            <button onClick={onAdd} disabled={busy || p.quantity === 0} className={`${btnPrimary} flex-1`}><FA icon={busy ? faSpinner : faCartShopping} spin={busy} />Add to Cart</button>
            <button onClick={onHeart} className={btnLight} aria-label="Wishlist"><FA icon={liked ? faHeart : faHeartR} className={liked ? 'text-red-500' : ''} /></button>
          </div>
        </div>
      </div>
      <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm" key={list}>
        <h2 className="mb-4 text-xl font-bold">Reviews ({revs.length})</h2>
        <div className="space-y-4">
          {revs.map((r) => (
            <div key={r._id} className="rounded-lg border border-slate-100 p-4">
              <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-sm"><b>{r.user?.name}</b><Stars value={r.rating} /></div>
                {user?.id && r.user?._id === user.id && <button aria-label="Delete review" onClick={async () => { try { await reviewService.remove(r._id); reviews.setData(revs.filter((x) => x._id !== r._id)); } catch (e) { toast(errMsg(e), 'error'); } }} className="text-slate-400 hover:text-red-500"><FA icon={faTrash} /></button>}</div>
              <p className="mt-2 text-sm text-slate-600">{r.review}</p>
            </div>
          ))}
          {!revs.length && <p className="text-sm text-slate-500">No reviews yet.</p>}
        </div>
        <form noValidate onSubmit={handleSubmit(submitReview)} className="mt-6 space-y-3 border-t border-slate-100 pt-5">
          <div className="flex items-center gap-3 text-sm"><span>Your rating:</span><Stars value={watch('rating')} size="text-lg" />
            <select className="rounded border border-slate-200 px-2 py-1" value={watch('rating')} onChange={(e) => setValue('rating', Number(e.target.value))}>{[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n}</option>)}</select></div>
          <textarea rows={3} className={inputCls} placeholder="Write your review..." {...register('review')} />
          {errors.review && <span className="block text-xs text-red-500">{errors.review.message}</span>}
          <button disabled={isSubmitting} className={btnPrimary}>Submit Review</button>
        </form>
      </section>
    </div>
  );
}
