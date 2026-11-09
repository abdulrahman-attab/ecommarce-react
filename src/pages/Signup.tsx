import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FontAwesomeIcon as FA } from '@fortawesome/react-fontawesome';
import { faStar, faTruckFast, faShieldHalved, faUserPlus, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { Field, inputCls } from '../components/common';
import { signupSchema } from '../schemas/schemas';
import { authService } from '../api/services/authService';
import { errMsg } from '../api/axios';
import { useToast } from '../context/ToastContext';

type V = z.infer<typeof signupSchema>;
const strength = (p: string) => {
  const s = [p.length >= 8, /[0-9]/.test(p), /[^A-Za-z0-9]/.test(p), /[A-Z]/.test(p) && /[a-z]/.test(p)].filter(Boolean).length;
  return p ? [{ l: 'Weak', c: 'bg-red-400', w: '25%' }, { l: 'Weak', c: 'bg-red-400', w: '25%' }, { l: 'Fair', c: 'bg-yellow-400', w: '50%' }, { l: 'Good', c: 'bg-green-400', w: '75%' }, { l: 'Strong', c: 'bg-green-600', w: '100%' }][s] : { l: 'Weak', c: 'bg-slate-200', w: '0%' };
};

export default function Signup() {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<V>({ resolver: zodResolver(signupSchema), defaultValues: { terms: false } });
  const [apiErr, setApiErr] = useState('');
  const toast = useToast();
  const nav = useNavigate();
  const st = strength(watch('password') || '');

  const onSubmit = async (v: V) => {
    setApiErr('');
    try {
      await authService.signup({ name: v.name, email: v.email, password: v.password, rePassword: v.rePassword, phone: v.phone });
      toast('Account created! Please sign in.');
      nav('/login');
    } catch (e) { setApiErr(errMsg(e, 'Registration failed')); }
  };
  const social = (n: string) => toast(`${n} sign-up is not supported by the backend`, 'info');

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-2">
      <div className="hidden pt-2 lg:block">
        <h1 className="text-4xl font-bold text-slate-800">Welcome to <span className="text-green-600">FreshCart</span></h1>
        <p className="mt-3 text-lg text-slate-600">Join thousands of happy customers who enjoy fresh groceries delivered right to their doorstep.</p>
        <ul className="mt-8 space-y-5">
          {[[faStar, 'Premium Quality', 'Premium quality products sourced from trusted suppliers.'], [faTruckFast, 'Fast Delivery', 'Same-day delivery available in most areas'], [faShieldHalved, 'Secure Shopping', 'Your data and payments are completely secure']].map(([i, t, s]) => (
            <li key={t as string} className="flex items-center gap-4"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100 text-green-600"><FA icon={i as typeof faStar} /></span><div><p className="font-semibold text-slate-800">{t as string}</p><p className="text-sm text-slate-500">{s as string}</p></div></li>
          ))}
        </ul>
        <div className="mt-8 rounded-xl bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-200 text-lg">👩</span><div><p className="text-sm font-medium">Sarah Johnson</p><p className="text-xs text-yellow-400">★★★★★</p></div></div>
          <p className="mt-3 text-sm italic text-slate-600">&quot;FreshCart has transformed my shopping experience. The quality of the products is outstanding, and the delivery is always on time. Highly recommend!&quot;</p>
        </div>
      </div>
      <div className="rounded-2xl bg-white p-8 shadow-xl">
        <h2 className="text-center text-2xl font-bold text-slate-900">Create Your Account</h2>
        <p className="mt-1 text-center text-sm text-slate-500">Start your fresh journey with us today</p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button type="button" onClick={() => social('Google')} className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 py-2.5 text-sm font-medium hover:bg-slate-50"><FA icon={faGoogle} className="text-red-500" />Google</button>
          <button type="button" onClick={() => social('Facebook')} className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 py-2.5 text-sm font-medium hover:bg-slate-50"><FA icon={faFacebook} className="text-blue-600" />Facebook</button>
        </div>
        <div className="my-5 flex items-center gap-3 text-xs text-slate-400"><span className="h-px flex-1 bg-slate-200" />or<span className="h-px flex-1 bg-slate-200" /></div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Field label="Name" required error={errors.name?.message}><input placeholder="Ali" className={inputCls} {...register('name')} /></Field>
          <Field label="Email" required error={errors.email?.message}><input type="email" placeholder="ali@example.com" className={inputCls} {...register('email')} /></Field>
          <div>
            <Field label="Password" required error={errors.password?.message}><input type="password" placeholder="create a strong password" className={inputCls} {...register('password')} /></Field>
            <div className="mt-2 flex items-center gap-3"><div className="h-1 flex-1 rounded bg-slate-200"><div className={`h-1 rounded ${st.c}`} style={{ width: st.w }} /></div><span className="text-xs text-slate-600">{st.l}</span></div>
            <p className="mt-1 text-[11px] text-slate-400">Must be at least 8 characters with numbers and symbols</p>
          </div>
          <Field label="Confirm Password" required error={errors.rePassword?.message}><input type="password" placeholder="confirm your password" className={inputCls} {...register('rePassword')} /></Field>
          <Field label="Phone Number" required error={errors.phone?.message}><input placeholder="+1 234 567 8900" className={inputCls} {...register('phone')} /></Field>
          <div>
            <label className="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" className="h-4 w-4 accent-green-600" {...register('terms')} />I agree to the <span className="text-green-600">Terms of Service</span> and <span className="text-green-600">Privacy Policy</span> <span className="text-red-500">*</span></label>
            {errors.terms && <span className="mt-1 block text-xs text-red-500">{errors.terms.message}</span>}
          </div>
          {apiErr && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{apiErr}</p>}
          <button disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-60"><FA icon={isSubmitting ? faSpinner : faUserPlus} spin={isSubmitting} />Create My Account</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">Already have an account? <Link to="/login" className="font-semibold text-green-600">Sign In</Link></p>
      </div>
    </div>
  );
}
