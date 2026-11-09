import { FontAwesomeIcon as FA } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfStroke, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarR } from '@fortawesome/free-regular-svg-icons';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export const container = 'mx-auto w-full max-w-[1536px] px-4 sm:px-6';
export const inputCls = 'w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20';
export const btnPrimary = 'inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60';
export const btnLight = 'inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50';

export function Stars({ value = 0, size = 'text-sm' }: { value?: number; size?: string }) {
  return (
    <span className={`inline-flex gap-0.5 text-yellow-400 ${size}`}>
      {[1, 2, 3, 4, 5].map((i) => <FA key={i} icon={value >= i - 0.25 ? faStar : value >= i - 0.75 ? faStarHalfStroke : faStarR} />)}
    </span>
  );
}

export function SectionTitle({ a, b, right }: { a: string; b: string; right?: ReactNode }) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900">
        <span className="h-7 w-1 rounded-full bg-green-600" />{a} <span className="-ml-1 text-green-600">{b}</span>
      </h2>
      {right}
    </div>
  );
}

export function Spinner({ className = 'py-20' }: { className?: string }) {
  return <div className={`flex justify-center text-3xl text-green-600 ${className}`}><FA icon={faSpinner} spin /></div>;
}

export function ErrorBox({ message }: { message: string }) {
  return <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{message}</div>;
}

export function EmptyState({ icon, title, text, children, round }: { icon: IconDefinition; title: string; text: string; children?: ReactNode; round?: boolean }) {
  return (
    <div className="flex flex-col items-center px-4 py-20 text-center">
      <div className={`mb-8 flex h-20 w-20 items-center justify-center bg-slate-100 text-3xl text-slate-300 ${round ? 'rounded-full h-24 w-24' : 'rounded-2xl'}`}><FA icon={icon} /></div>
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      <p className="mt-3 max-w-sm text-sm text-slate-500">{text}</p>
      <div className="mt-6 flex w-full max-w-sm flex-col gap-3">{children}</div>
    </div>
  );
}

export function Field({ label, error, required, children }: { label: string; error?: string; required?: boolean; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}{required && <span className="text-red-500">*</span>}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  );
}

export function PageBanner({ title, subtitle, icon, image, crumbs, purple }: {
  title: string; subtitle: string; icon?: IconDefinition; image?: string; crumbs: { label: string; to?: string }[]; purple?: boolean;
}) {
  return (
    <div className={`bg-linear-to-br ${purple ? 'from-purple-600 via-purple-500 to-fuchsia-400' : 'from-green-600 via-green-500 to-green-400'} text-white`}>
      <div className={`${container} py-10`}>
        <nav className="mb-4 flex items-center gap-2 text-xs text-white/80">
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span>/</span>}
              {c.to ? <Link to={c.to} className="hover:underline">{c.label}</Link> : <span className="font-semibold text-white">{c.label}</span>}
            </span>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white/20 text-2xl">
            {image ? <img src={image} alt="" className="h-9 w-9 rounded object-cover" /> : icon && <FA icon={icon} />}
          </div>
          <div>
            <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
            <p className="mt-1 text-sm text-white/90">{subtitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
