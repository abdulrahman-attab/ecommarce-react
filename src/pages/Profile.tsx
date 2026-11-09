import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FontAwesomeIcon as FA } from '@fortawesome/react-fontawesome';
import { faTrash, faBoxOpen, faKey } from '@fortawesome/free-solid-svg-icons';
import { btnPrimary, container, Field, inputCls, SectionTitle } from '../components/common';
import { addressSchema, profileSchema } from '../schemas/schemas';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useFetch } from '../hooks/useFetch';
import { authService } from '../api/services/authService';
import { addressService } from '../api/services/addressService';
import { errMsg } from '../api/axios';

type P = z.infer<typeof profileSchema>;
type A = z.infer<typeof addressSchema>;

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const toast = useToast();
  const [reload, setReload] = useState(0);
  const addrs = useFetch(() => addressService.list(), [reload]);
  const pf = useForm<P>({ resolver: zodResolver(profileSchema), defaultValues: { name: user?.name ?? '', email: user?.email ?? '', phone: '' } });
  const af = useForm<A>({ resolver: zodResolver(addressSchema) });

  return (
    <div className={`${container} py-8`}>
      <SectionTitle a="My" b="Account" />
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold">Account Details</h3>
          <form noValidate className="space-y-4" onSubmit={pf.handleSubmit(async (v) => { try { await authService.updateMe(v); updateUser({ name: v.name, email: v.email }); toast('Profile updated'); } catch (e) { toast(errMsg(e), 'error'); } })}>
            <Field label="Name" error={pf.formState.errors.name?.message}><input className={inputCls} {...pf.register('name')} /></Field>
            <Field label="Email" error={pf.formState.errors.email?.message}><input className={inputCls} {...pf.register('email')} /></Field>
            <Field label="Phone" error={pf.formState.errors.phone?.message}><input className={inputCls} placeholder="01xxxxxxxxx" {...pf.register('phone')} /></Field>
            <button disabled={pf.formState.isSubmitting} className={btnPrimary}>Save Changes</button>
          </form>
          <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-5 text-sm">
            <Link to="/profile/orders" className="flex items-center gap-2 text-green-600"><FA icon={faBoxOpen} />My Orders</Link>
            <Link to="/change-password" className="flex items-center gap-2 text-green-600"><FA icon={faKey} />Change Password</Link>
            <button onClick={logout} className="ml-auto text-slate-500 hover:text-red-500">Sign Out</button>
          </div>
        </section>
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold">Saved Addresses</h3>
          <div className="space-y-3">
            {addrs.data?.map((a) => (
              <div key={a._id} className="flex items-start justify-between rounded-lg border border-slate-200 p-3 text-sm">
                <div><p className="font-semibold">{a.name}</p><p className="text-slate-500">{a.details}, {a.city} · {a.phone}</p></div>
                <button aria-label="Remove address" onClick={async () => { try { await addressService.remove(a._id); setReload((r) => r + 1); } catch (e) { toast(errMsg(e), 'error'); } }} className="text-slate-400 hover:text-red-500"><FA icon={faTrash} /></button>
              </div>
            ))}
            {addrs.data && !addrs.data.length && <p className="text-sm text-slate-500">No saved addresses yet.</p>}
          </div>
          <form noValidate className="mt-5 grid gap-3 border-t border-slate-100 pt-5 sm:grid-cols-2" onSubmit={af.handleSubmit(async (v) => { try { await addressService.add(v); af.reset(); setReload((r) => r + 1); toast('Address added'); } catch (e) { toast(errMsg(e), 'error'); } })}>
            <Field label="Name" error={af.formState.errors.name?.message}><input className={inputCls} placeholder="Home" {...af.register('name')} /></Field>
            <Field label="City" error={af.formState.errors.city?.message}><input className={inputCls} {...af.register('city')} /></Field>
            <div className="sm:col-span-2"><Field label="Details" error={af.formState.errors.details?.message}><input className={inputCls} {...af.register('details')} /></Field></div>
            <Field label="Phone" error={af.formState.errors.phone?.message}><input className={inputCls} {...af.register('phone')} /></Field>
            <div className="flex items-end"><button className={btnPrimary}>Add Address</button></div>
          </form>
        </section>
      </div>
    </div>
  );
}
