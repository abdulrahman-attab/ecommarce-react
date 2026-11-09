import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon as FA } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faTruck, faShieldHalved, faRotateLeft, faHeadset, faArrowRight, faEnvelope, faLeaf, faTag, faMobileScreen } from '@fortawesome/free-solid-svg-icons';
import { faApple, faGooglePlay } from '@fortawesome/free-brands-svg-icons';
import { container, SectionTitle, Spinner, ErrorBox, inputCls } from '../components/common';
import { ProductGrid } from '../components/ProductCard';
import { productService } from '../api/services/productService';
import { useCategories } from '../hooks/useCategories';
import { useFetch } from '../hooks/useFetch';
import { useToast } from '../context/ToastContext';

const HERO_IMAGE = '';
const slides = [
  { t: 'Fresh Products Delivered to your Door', s: 'Get 20% off your first order', a: ['Shop Now', '/products'], b: ['View Deals', '/deals'] },
  { t: 'Premium Quality Guaranteed', s: 'Fresh from farm to your table', a: ['Shop Now', '/products'], b: ['Learn More', '/about'] },
  { t: 'Fast & Free Delivery', s: 'Same day delivery available', a: ['Order Now', '/products'], b: ['Delivery Info', '/delivery'] },
];

function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((x) => (x + 1) % slides.length), 5000); return () => clearInterval(t); }, []);
  const go = (d: number) => setI((x) => (x + d + slides.length) % slides.length);
  const s = slides[i];
  return (
    <section className="relative h-75 overflow-hidden bg-linear-to-r from-green-700 via-green-600 to-green-500 text-white sm:h-100" style={HERO_IMAGE ? { backgroundImage: `linear-gradient(90deg,rgba(22,163,74,.9),rgba(22,163,74,.6)),url(${HERO_IMAGE})`, backgroundSize: 'cover' } : undefined}>
      <div className="flex h-full flex-col justify-center px-8 sm:px-8">
        <h1 className="max-w-md text-3xl font-bold leading-tight sm:text-4xl">{s.t}</h1>
        <p className="mt-3 text-sm sm:text-base">{s.s}</p>
        <div className="mt-5 flex gap-3">
          <Link to={s.a[1]} className="rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-green-600 shadow hover:bg-green-50">{s.a[0]}</Link>
          <Link to={s.b[1]} className="rounded-lg border border-white/80 px-6 py-2.5 text-sm font-semibold hover:bg-white/10">{s.b[0]}</Link>
        </div>
      </div>
      <button aria-label="Previous" onClick={() => go(-1)} className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-green-600 shadow"><FA icon={faChevronLeft} /></button>
      <button aria-label="Next" onClick={() => go(1)} className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-green-600 shadow"><FA icon={faChevronRight} /></button>
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((_, k) => <button key={k} aria-label={`Slide ${k + 1}`} onClick={() => setI(k)} className={`h-2 rounded-full bg-white transition-all ${k === i ? 'w-6' : 'w-2 opacity-60'}`} />)}
      </div>
    </section>
  );
}

function Features() {
  const f = [
    [faTruck, 'Free Shipping', 'On orders over 500 EGP', 'bg-blue-50 text-blue-500'], [faShieldHalved, 'Secure Payment', '100% secure transactions', 'bg-green-50 text-green-600'],
    [faRotateLeft, 'Easy Returns', '14-day return policy', 'bg-orange-50 text-orange-500'], [faHeadset, '24/7 Support', 'Dedicated support team', 'bg-purple-50 text-purple-500'],
  ] as const;
  return (
    <section className={`${container} grid gap-5 py-8 sm:grid-cols-2 lg:grid-cols-4`}>
      {f.map(([icon, t, s, c]) => (
        <div key={t} className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm">
          <span className={`flex h-12 w-12 items-center justify-center rounded-full ${c}`}><FA icon={icon} /></span>
          <div><h3 className="text-sm font-semibold text-slate-900">{t}</h3><p className="text-xs text-slate-500">{s}</p></div>
        </div>
      ))}
    </section>
  );
}

function Categories() {
  const cats = useCategories();
  return (
    <section className={`${container} py-8`}>
      <SectionTitle a="Shop By" b="Category" right={<Link to="/categories" className="flex items-center gap-2 text-sm font-medium text-green-600 hover:underline">View All Categories <FA icon={faArrowRight} /></Link>} />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {cats.map((c) => (
          <Link key={c._id} to={`/categories/${c._id}`} className="flex flex-col items-center rounded-xl bg-white p-5 text-center shadow-sm transition hover:shadow-md">
            <img src={c.image} alt={c.name} className="mb-3 h-16 w-16 rounded-full object-cover" />
            <span className="text-sm font-medium text-slate-700">{c.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Promos() {
  const cards = [
    { tag: '🔥 Deal of the Day', t: 'Fresh Organic Fruits', d: 'Get up to 40% off on selected organic fruits', o: '40% OFF', c: 'ORGANIC40', b: 'Shop Now', to: '/products', bg: 'from-emerald-500 to-green-700', txt: 'text-green-600' },
    { tag: '✨ New Arrivals', t: 'Exotic Vegetables', d: 'Discover our latest collection of premium vegetables', o: '25% OFF', c: 'FRESH25', b: 'Explore Now', to: '/products?sort=newest', bg: 'from-orange-500 to-rose-500', txt: 'text-orange-500' },
  ];
  return (
    <section className={`${container} grid gap-5 py-8 md:grid-cols-2`}>
      {cards.map((c) => (
        <div key={c.t} className={`relative overflow-hidden rounded-2xl bg-linear-to-br ${c.bg} p-8 text-white`}>
          <span className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10" />
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium">{c.tag}</span>
          <h3 className="mt-4 text-3xl font-bold">{c.t}</h3>
          <p className="mt-1 text-sm text-white/90">{c.d}</p>
          <p className="mt-4 flex items-baseline gap-3"><span className="text-3xl font-extrabold">{c.o}</span><span className="text-xs">Use code: <b>{c.c}</b></span></p>
          <Link to={c.to} className={`mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold ${c.txt}`}>{c.b} <FA icon={faArrowRight} /></Link>
        </div>
      ))}
    </section>
  );
}

function Featured() {
  const { data, loading, error } = useFetch(() => productService.list({ limit: 40 }), []);
  return (
    <section className={`${container} py-8`}>
      <SectionTitle a="Featured" b="Products" />
      {loading ? <Spinner /> : error ? <ErrorBox message={error} /> : <ProductGrid items={data?.data ?? []} />}
    </section>
  );
}

function NewsletterApp() {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return toast('Enter a valid email address', 'error');
    toast('Newsletter signup is not connected to a backend yet', 'info'); 
  };
  return (
    <section className={`${container} py-10`}>
      <div className="grid gap-8 rounded-3xl bg-linear-to-br from-green-50 via-white to-green-50 p-6 shadow-sm sm:p-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500 text-white"><FA icon={faEnvelope} /></span>
            <div><p className="text-xs font-bold tracking-wide text-green-600">NEWSLETTER</p><p className="text-xs text-slate-500">50,000+ subscribers</p></div>
          </div>
          <h2 className="mt-5 text-3xl font-bold text-slate-900 sm:text-4xl">Get the Freshest Updates <span className="text-green-600">Delivered Free</span></h2>
          <p className="mt-3 text-slate-500">Weekly recipes, seasonal offers &amp; exclusive member perks.</p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm">
            {[[faLeaf, 'Fresh Picks Weekly'], [faTruck, 'Free Delivery Codes'], [faTag, 'Members-Only Deals']].map(([i, t]) => (
              <span key={t as string} className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm"><FA icon={i as typeof faLeaf} className="text-green-600" />{t as string}</span>
            ))}
          </div>
          <form onSubmit={submit} className="mt-6 flex max-w-xl gap-3">
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={`${inputCls} rounded-xl py-3.5`} />
            <button className="flex shrink-0 items-center gap-2 rounded-xl bg-linear-to-r from-green-600 to-emerald-500 px-6 text-sm font-semibold text-white">Subscribe <FA icon={faArrowRight} /></button>
          </form>
          <p className="mt-3 text-xs text-slate-400">✨ Unsubscribe anytime. No spam, ever.</p>
        </div>
        <div className="rounded-2xl bg-slate-900 p-7 text-white">
          <span className="inline-flex items-center gap-2 rounded-md bg-green-500/20 px-2.5 py-1 text-[10px] font-bold tracking-wide text-green-400"><FA icon={faMobileScreen} />MOBILE APP</span>
          <h3 className="mt-4 text-2xl font-bold">Shop Faster on Our App</h3>
          <p className="mt-2 text-sm text-slate-400">Get app-exclusive deals &amp; 15% off your first order.</p>
          {[[faApple, 'DOWNLOAD ON', 'App Store'], [faGooglePlay, 'GET IT ON', 'Google Play']].map(([i, s, t]) => (
            <a key={t as string} href="#" className="mt-4 flex items-center gap-3 rounded-xl bg-slate-800 px-4 py-3 hover:bg-slate-700">
              <FA icon={i as typeof faApple} className="text-xl" /><span className="leading-tight"><span className="block text-[9px] text-slate-400">{s as string}</span><span className="text-sm font-semibold">{t as string}</span></span>
            </a>
          ))}
          <p className="mt-5 text-xs text-slate-400"><span className="text-yellow-400">★★★★★</span> 4.9 • 100K+ downloads</p>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return <><Hero /><Features /><Categories /><Promos /><Featured /><NewsletterApp /></>;
}
