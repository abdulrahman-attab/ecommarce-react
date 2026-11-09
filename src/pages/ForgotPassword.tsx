import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FontAwesomeIcon as FA } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Field, inputCls } from '../components/common';
import { codeSchema, emailSchema, resetSchema } from '../schemas/schemas';
import { authService } from '../api/services/authService';
import { errMsg } from '../api/axios';
import { useToast } from '../context/ToastContext';

export default function ForgotPassword() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [err, setErr] = useState('');
  const toast = useToast();
  const nav = useNavigate();
  const f1 = useForm<{ email: string }>({ resolver: zodResolver(emailSchema) });
  const f2 = useForm<{ resetCode: string }>({ resolver: zodResolver(codeSchema) });
  const f3 = useForm<{ newPassword: string }>({ resolver: zodResolver(resetSchema) });
  const run = async (fn: () => Promise<void>) => { setErr(''); try { await fn(); } catch (e) { setErr(errMsg(e)); } };
  const btn = (busy: boolean, t: string) => <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-60">{busy && <FA icon={faSpinner} spin />}{t}</button>;
  const titles = ['Forgot Password?', 'Verify Code', 'Reset Password'];
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-2xl bg-white p-8 shadow-xl">
        <p className="text-center text-2xl font-bold"><span className="text-green-600">Fresh</span>Cart</p>
        <h1 className="mt-3 text-center text-2xl font-bold">{titles[step - 1]}</h1>
        <p className="mb-6 mt-1 text-center text-sm text-slate-500">{step === 1 ? "Enter your email and we'll send you a reset code" : step === 2 ? 'Enter the code we sent to your email' : 'Choose a new password'}</p>
        {step === 1 && <form className="space-y-4" noValidate onSubmit={f1.handleSubmit((v) => run(async () => { await authService.forgotPassword(v.email); setEmail(v.email); setStep(2); toast('Reset code sent'); }))}>
          <Field label="Email Address" error={f1.formState.errors.email?.message}><input type="email" placeholder="Enter your email" className={inputCls} {...f1.register('email')} /></Field>
          {err && <p className="text-sm text-red-500">{err}</p>}{btn(f1.formState.isSubmitting, 'Send Reset Code')}</form>}
        {step === 2 && <form className="space-y-4" noValidate onSubmit={f2.handleSubmit((v) => run(async () => { await authService.verifyResetCode(v.resetCode); setStep(3); }))}>
          <Field label="Reset Code" error={f2.formState.errors.resetCode?.message}><input placeholder="Enter code" className={inputCls} {...f2.register('resetCode')} /></Field>
          {err && <p className="text-sm text-red-500">{err}</p>}{btn(f2.formState.isSubmitting, 'Verify Code')}</form>}
        {step === 3 && <form className="space-y-4" noValidate onSubmit={f3.handleSubmit((v) => run(async () => { await authService.resetPassword(email, v.newPassword); toast('Password updated. Please sign in.'); nav('/login'); }))}>
          <Field label="New Password" error={f3.formState.errors.newPassword?.message}><input type="password" placeholder="Enter new password" className={inputCls} {...f3.register('newPassword')} /></Field>
          {err && <p className="text-sm text-red-500">{err}</p>}{btn(f3.formState.isSubmitting, 'Reset Password')}</form>}
        <p className="mt-6 text-center text-sm"><Link to="/login" className="font-semibold text-green-600">Back to Sign In</Link></p>
      </div>
    </div>
  );
}
