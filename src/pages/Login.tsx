import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FontAwesomeIcon as FA } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash, faTruck, faShieldHalved, faClock, faUsers, faStar, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { Field, inputCls } from '../components/common';
import { loginSchema } from '../schemas/schemas';
import { authService } from '../api/services/authService';
import { errMsg } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { safeCallback } from '../utils/format';

type V = z.infer<typeof loginSchema>;
export default function Login() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<V>({ resolver: zodResolver(loginSchema), defaultValues: { remember: false } });
  const [show, setShow] = useState(false);
  const [apiErr, setApiErr] = useState('');
  const { login } = useAuth();
  const toast = useToast();
  const nav = useNavigate();
  const [sp] = useSearchParams();

  const onSubmit = async (v: V) => {
    setApiErr('');
    try {
      const r = await authService.signin({ email: v.email, password: v.password });
      login(r.token, r.user, v.remember); // response shape {token,user} UNVERIFIED
      toast('Welcome back!');
      nav(safeCallback(sp.get('callbackUrl')), { replace: true });
    } catch (e) { setApiErr(errMsg(e, 'Login failed')); }
  };
  const social = (n: string) => toast(`${n} sign-in is not supported by the backend`, 'info');

  return (
    <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 lg:grid-cols-2">
      <div className="hidden text-center lg:block">
        <div className="overflow-hidden rounded-2xl bg-white p-6 shadow-lg"><img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/2e5810ff3e-e750761ebcd4ae5907db.png" alt="Fresh vegetables shopping cart" className="mx-auto h-72 object-contain" /></div>
        <h2 className="mt-8 text-2xl font-bold text-slate-800">FreshCart - Your One-Stop Shop for Fresh Products</h2>
        <p className="mx-auto mt-3 max-w-md text-slate-500">Join thousands of happy customers who trust FreshCart for their daily grocery needs</p>
        <div className="mt-5 flex justify-center gap-6 text-xs text-slate-600">
          <span className="flex items-center gap-2"><FA icon={faTruck} className="text-green-600" />Free Delivery</span>
          <span className="flex items-center gap-2"><FA icon={faShieldHalved} className="text-green-600" />Secure Payment</span>
          <span className="flex items-center gap-2"><FA icon={faClock} className="text-green-600" />24/7 Support</span>
        </div>
      </div>
      <div className="rounded-2xl bg-white p-8 shadow-xl">
        <p className="text-center text-2xl font-bold"><span className="text-green-600">Fresh</span>Cart</p>
        <h1 className="mt-3 text-center text-2xl font-bold text-slate-900">Welcome Back!</h1>
        <p className="mt-1 text-center text-sm text-slate-500">Sign in to continue your fresh shopping experience</p>
        <button type="button" onClick={() => social('Google')} className="mt-6 flex w-full items-center justify-center gap-3 rounded-lg border border-slate-200 py-3 text-sm font-medium hover:bg-slate-50"><FA icon={faGoogle} className="text-red-500" />Continue with Google</button>
        <button type="button" onClick={() => social('Facebook')} className="mt-3 flex w-full items-center justify-center gap-3 rounded-lg border border-slate-200 py-3 text-sm font-medium hover:bg-slate-50"><FA icon={faFacebook} className="text-blue-600" />Continue with Facebook</button>
        <div className="my-5 flex items-center gap-3 text-[11px] text-slate-400"><span className="h-px flex-1 bg-slate-200" />OR CONTINUE WITH EMAIL<span className="h-px flex-1 bg-slate-200" /></div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Field label="Email Address" error={errors.email?.message}>
            <div className="relative"><FA icon={faEnvelope} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input type="email" placeholder="Enter your email" className={`${inputCls} pl-11`} {...register('email')} /></div>
          </Field>
          <div>
            <div className="mb-1.5 flex justify-between text-sm"><span className="font-medium text-slate-700">Password</span><Link to="/forget-password" className="font-medium text-green-600 hover:underline">Forgot Password?</Link></div>
            <div className="relative"><FA icon={faLock} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input type={show ? 'text' : 'password'} placeholder="Enter your password" className={`${inputCls} px-11`} {...register('password')} />
              <button type="button" aria-label="Toggle password" onClick={() => setShow((s) => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"><FA icon={show ? faEyeSlash : faEye} /></button></div>
            {errors.password && <span className="mt-1 block text-xs text-red-500">{errors.password.message}</span>}
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" className="h-4 w-4 accent-green-600" {...register('remember')} />Keep me signed in</label>
          {apiErr && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{apiErr}</p>}
          <button disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-60">{isSubmitting && <FA icon={faSpinner} spin />}Sign In</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">New to FreshCart? <Link to="/signup" className="font-semibold text-green-600 hover:underline">Create an account</Link></p>
        <div className="mt-4 flex justify-center gap-5 text-[11px] text-slate-500"><span><FA icon={faLock} className="mr-1" />SSL Secured</span><span><FA icon={faUsers} className="mr-1" />50K+ Users</span><span><FA icon={faStar} className="mr-1" />4.9 Rating</span></div>
      </div>
    </div>
  );
}
