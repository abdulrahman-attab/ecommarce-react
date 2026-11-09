import { Link } from 'react-router-dom';
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import { btnPrimary, container, EmptyState, ErrorBox, SectionTitle, Spinner } from '../components/common';
import { useAuth } from '../context/AuthContext';
import { useFetch } from '../hooks/useFetch';
import { orderService } from '../api/services/orderService';
import { price } from '../utils/format';

export default function Orders() {
  const { user } = useAuth();
  const { data, loading, error } = useFetch(() => (user?.id ? orderService.byUser(user.id) : Promise.resolve([])), [user?.id]);
  const orders = [...(data ?? [])].reverse();
  const badge = (ok: boolean, yes: string, no: string) => <span className={`rounded-full px-3 py-1 text-xs font-semibold ${ok ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{ok ? yes : no}</span>;
  return (
    <div className={`${container} py-8`}>
      <SectionTitle a="My" b="Orders" />
      {loading ? <Spinner /> : error ? <ErrorBox message={error} /> : !orders.length ? (
        <EmptyState icon={faBoxOpen} title="No orders yet" text="When you place an order it will show up here."><Link to="/products" className={btnPrimary}>Start Shopping</Link></EmptyState>
      ) : (
        <div className="space-y-5">
          {orders.map((o) => (
            <div key={o._id} className="rounded-xl bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div><p className="text-xs text-slate-500">Order #{o.id ?? o._id.slice(-8)}</p><p className="text-sm text-slate-600">{new Date(o.createdAt).toLocaleDateString()} · {o.paymentMethodType === 'cash' ? 'Cash on Delivery' : 'Online Payment'}</p></div>
                <div className="flex gap-2">{badge(o.isPaid, 'Paid', 'Not paid')}{badge(o.isDelivered, 'Delivered', 'Processing')}</div>
              </div>
              <div className="mt-4 space-y-3">
                {o.cartItems?.map((i) => (
                  <div key={i._id} className="flex items-center gap-3 text-sm"><img src={i.product?.imageCover} alt="" className="h-14 w-14 rounded object-contain" /><span className="flex-1">{i.product?.title} × {i.count}</span><span className="font-semibold">{price(i.price * i.count)}</span></div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4 text-sm">
                <span className="text-slate-500">{o.shippingAddress ? `${o.shippingAddress.details}, ${o.shippingAddress.city}` : ''}</span>
                <span className="text-lg font-bold text-green-600">{price(o.totalOrderPrice)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
