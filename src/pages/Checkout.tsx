import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FontAwesomeIcon as FA } from '@fortawesome/react-fontawesome';
import { faMoneyBill, faCreditCard, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { container, ErrorBox, Field, inputCls, SectionTitle, Spinner, btnPrimary } from '../components/common';
import { checkoutSchema } from '../schemas/schemas';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useFetch } from '../hooks/useFetch';
import { addressService } from '../api/services/addressService';
import { orderService, paymentService } from '../api/services/orderService';
import { errMsg } from '../api/axios';
import { price } from '../utils/format';

type V = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const { cart, cartId, loading, refresh } = useCart();
  const toast = useToast();
  const nav = useNavigate();
  const [err, setErr] = useState('');
  const addresses = useFetch(() => addressService.list().catch(() => []), []);
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<V>({ resolver: zodResolver(checkoutSchema), defaultValues: { payment: 'cash' } });
  const payment = watch('payment');

  if (loading && !cart) return <Spinner />;
  const items = cart?.products ?? [];
  if (!items.length || !cartId) return <div className="py-24 text-center"><p className="mb-4 text-slate-600">Your cart is empty.</p><Link to="/products" className={btnPrimary}>Start Shopping</Link></div>;

  const onSubmit = async (v: V) => {
    setErr('');
    const shippingAddress = { details: v.details, phone: v.phone, city: v.city };
    try {
      if (v.payment === 'cash') {
        await orderService.createCash(cartId, shippingAddress);
        await refresh().catch(() => {});
        toast('Order placed successfully');
        nav('/profile/orders');
      } else {
        const r = await paymentService.checkoutSession(cartId, shippingAddress, `${window.location.origin}/profile/orders`);
        const url = r?.session?.url;
        if (!url) throw new Error('The payment provider did not return a checkout URL');
        window.location.href = url;
      }
    } catch (e) { setErr(errMsg(e, 'Could not place the order')); }
  };

  return (
    <div className={`${container} py-8`}>
      <SectionTitle a="Secure" b="Checkout" />
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold">Shipping Address</h3>
            {!!addresses.data?.length && (
              <div className="mb-4 flex flex-wrap gap-2">
                {addresses.data.map((a) => <button type="button" key={a._id} onClick={() => { setValue('details', a.details); setValue('phone', a.phone); setValue('city', a.city); }} className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">{a.name}</button>)}
              </div>
            )}
            <div className="space-y-4">
              <Field label="Address Details" error={errors.details?.message}><input className={inputCls} placeholder="Street, building, apartment" {...register('details')} /></Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Phone" error={errors.phone?.message}><input className={inputCls} placeholder="01xxxxxxxxx" {...register('phone')} /></Field>
                <Field label="City" error={errors.city?.message}><input className={inputCls} placeholder="Cairo" {...register('city')} /></Field>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold">Payment Method</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {([['cash', faMoneyBill, 'Cash on Delivery', 'Pay when you receive your order'], ['online', faCreditCard, 'Online Payment', 'Pay securely with your card']] as const).map(([val, icon, t, s]) => (
                <label key={val} className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 ${payment === val ? 'border-green-600 bg-green-50' : 'border-slate-200'}`}>
                  <input type="radio" value={val} className="accent-green-600" {...register('payment')} />
                  <FA icon={icon} className="text-green-600" /><span><span className="block text-sm font-semibold">{t}</span><span className="text-xs text-slate-500">{s}</span></span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <aside className="h-fit rounded-xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold">Order Summary</h3>
          <div className="space-y-3">{items.map((i) => <div key={i._id} className="flex items-center gap-3 text-sm"><img src={i.product.imageCover} alt="" className="h-12 w-12 rounded object-contain" /><span className="line-clamp-1 flex-1">{i.product.title} × {i.count}</span><span className="font-semibold">{price(i.price * i.count)}</span></div>)}</div>
          <div className="mt-4 flex justify-between border-t border-slate-100 pt-4 text-lg font-bold"><span>Total</span><span className="text-green-600">{price(cart!.totalCartPrice)}</span></div>
          {err && <div className="mt-4"><ErrorBox message={err} /></div>}
          <button disabled={isSubmitting} className={`${btnPrimary} mt-5 w-full`}>{isSubmitting && <FA icon={faSpinner} spin />}{payment === 'cash' ? 'Place Order' : 'Pay Now'}</button>
        </aside>
      </form>
    </div>
  );
}
