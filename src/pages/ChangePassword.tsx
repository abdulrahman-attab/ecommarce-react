import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FontAwesomeIcon as FA } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Field, inputCls } from '../components/common';
import { changePasswordSchema } from '../schemas/schemas';
import { authService } from '../api/services/authService';
import { errMsg } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

type V = z.infer<typeof changePasswordSchema>;

export default function ChangePassword() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<V>({ resolver: zodResolver(changePasswordSchema) });
  const { replaceToken } = useAuth();
  const toast = useToast();
  const [err, setErr] = useState('');
  const onSubmit = async (v: V) => {
    setErr('');
    try {
      const r = await authService.changePassword(v);
      if (r?.token) replaceToken(r.token); 
      toast('Password changed successfully'); reset();
    } catch (e) { setErr(errMsg(e)); }
  };
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="text-center text-2xl font-bold">Change Password</h1>
        <p className="mb-6 mt-1 text-center text-sm text-slate-500">Keep your account secure</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Field label="Current Password" error={errors.currentPassword?.message}><input type="password" className={inputCls} {...register('currentPassword')} /></Field>
          <Field label="New Password" error={errors.password?.message}><input type="password" className={inputCls} {...register('password')} /></Field>
          <Field label="Confirm New Password" error={errors.rePassword?.message}><input type="password" className={inputCls} {...register('rePassword')} /></Field>
          {err && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{err}</p>}
          <button disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-60">{isSubmitting && <FA icon={faSpinner} spin />}Update Password</button>
        </form>
      </div>
    </div>
  );
}
