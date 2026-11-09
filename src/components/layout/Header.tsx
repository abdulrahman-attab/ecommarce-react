import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon as FA } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faChevronDown, faChevronUp, faHeart, faCartShopping, faHeadset, faUser, faBars, faXmark, faRightFromBracket, faBoxOpen, faKey } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartR } from '@fortawesome/free-regular-svg-icons';
import { container } from '../common';
import Logo from './Logo';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCategories } from '../../hooks/useCategories';

const PREFERRED = ['Electronics', "Women's Fashion", "Men's Fashion", 'Beauty & Health'];

export default function Header() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const { ids } = useWishlist();
  const cats = useCategories();
  const nav = useNavigate();
  const loc = useLocation();
  const [q, setQ] = useState('');
  const [catOpen, setCatOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  useEffect(() => { setCatOpen(false); setMenu(false); setUserOpen(false); }, [loc.pathname, loc.search]);

  const dropdown = (() => {
    const picked = PREFERRED.map((n) => cats.find((c) => c.name === n)).filter(Boolean) as typeof cats;
    return picked.length ? picked : cats.slice(0, 4);
  })();
  const submit = (e: FormEvent) => { e.preventDefault(); if (q.trim()) nav(`/products?keyword=${encodeURIComponent(q.trim())}`); };
  const link = ({ isActive }: { isActive: boolean }) => `text-sm font-medium transition hover:text-green-600 ${isActive ? 'text-green-600' : 'text-slate-700'}`;
  const iconWrap = (active: boolean) => `relative flex h-10 w-10 items-center justify-center rounded-full text-lg transition hover:text-green-600 ${active ? 'bg-green-50 text-green-600' : 'text-slate-700'}`;
  const badge = 'absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-green-600 px-1 text-[10px] font-bold text-white';

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className={`${container} flex h-16 items-center gap-4 lg:gap-8`}>
        <Logo />
        <form onSubmit={submit} className="relative hidden max-w-xl flex-1 md:block">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search for products, brands and more..." className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-5 pr-14 text-sm outline-none placeholder:text-slate-400 focus:border-green-500 focus:bg-white" />
          <button aria-label="Search" className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-green-600 text-xs text-white"><FA icon={faMagnifyingGlass} /></button>
        </form>
        <nav className="ml-auto hidden items-center gap-6 lg:flex">
          <NavLink to="/" end className={link}>Home</NavLink>
          <NavLink to="/products" end className={link}>Shop</NavLink>
          <div className="relative" onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
            <button onClick={() => setCatOpen((o) => !o)} className={`flex items-center gap-1.5 text-sm font-medium hover:text-green-600 ${catOpen ? 'text-green-600' : 'text-slate-700'}`}>
              Categories <FA icon={catOpen ? faChevronUp : faChevronDown} className="text-[10px]" />
            </button>
            {catOpen && (
              <div className="absolute left-1/2 top-full w-56 -translate-x-1/2 pt-3">
                <div className="rounded-xl bg-white p-2 shadow-xl ring-1 ring-slate-100">
                  <Link to="/categories" className="block rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-green-50 hover:text-green-600">All Categories</Link>
                  {dropdown.map((c) => <Link key={c._id} to={`/products?category=${c._id}`} className="block rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-green-50 hover:text-green-600">{c.name}</Link>)}
                </div>
              </div>
            )}
          </div>
          <NavLink to="/brands" className={link}>Brands</NavLink>
        </nav>
        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          <Link to="/contact" className="mr-2 hidden items-center gap-2 border-r border-slate-200 pr-4 xl:flex">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50 text-green-600"><FA icon={faHeadset} /></span>
            <span className="text-[11px] leading-tight text-slate-500">Support<br /><b className="text-xs font-semibold text-slate-800">24/7 Help</b></span>
          </Link>
          <NavLink to="/wishlist" title="Wishlist" className={({ isActive }) => iconWrap(isActive)}>
            <FA icon={ids.size || loc.pathname === '/wishlist' ? faHeart : faHeartR} />{ids.size > 0 && <span className={badge}>{ids.size}</span>}
          </NavLink>
          <NavLink to="/cart" title="Cart" className={({ isActive }) => iconWrap(isActive)}>
            <FA icon={faCartShopping} />{count > 0 && <span className={badge}>{count}</span>}
          </NavLink>
          {user ? (
            <div className="relative hidden sm:block">
              <button onClick={() => setUserOpen((o) => !o)} className="ml-2 flex items-center gap-2 rounded-full bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700"><FA icon={faUser} className="text-xs" />{user.name.split(' ')[0]}</button>
              {userOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 rounded-xl bg-white p-2 shadow-xl ring-1 ring-slate-100">
                  <Link to="/profile" className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm hover:bg-green-50"><FA icon={faUser} className="w-4 text-green-600" />My Account</Link>
                  <Link to="/profile/orders" className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm hover:bg-green-50"><FA icon={faBoxOpen} className="w-4 text-green-600" />Orders</Link>
                  <Link to="/change-password" className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm hover:bg-green-50"><FA icon={faKey} className="w-4 text-green-600" />Change Password</Link>
                  <button onClick={logout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm hover:bg-green-50"><FA icon={faRightFromBracket} className="w-4 text-green-600" />Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="ml-2 hidden items-center gap-2 rounded-full bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700 sm:flex"><FA icon={faUser} className="text-xs" />Sign In</Link>
          )}
          <button aria-label="Menu" onClick={() => setMenu((m) => !m)} className="ml-1 flex h-10 w-10 items-center justify-center text-xl text-slate-700 lg:hidden"><FA icon={menu ? faXmark : faBars} /></button>
        </div>
      </div>
      {menu && (
        <div className="border-t border-slate-100 bg-white lg:hidden">
          <div className={`${container} space-y-1 py-4`}>
            <form onSubmit={submit} className="relative mb-3">
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search for products, brands and more..." className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-5 pr-12 text-sm outline-none" />
              <button aria-label="Search" className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-green-600 text-xs text-white"><FA icon={faMagnifyingGlass} /></button>
            </form>
            {[['Home', '/'], ['Shop', '/products'], ['Categories', '/categories'], ['Brands', '/brands'], ['Wishlist', '/wishlist'], ['Cart', '/cart']].map(([l, t]) => <Link key={t} to={t} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-green-50">{l}</Link>)}
            {user ? (
              <>
                <Link to="/profile" className="block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-green-50">My Account</Link>
                <button onClick={logout} className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium hover:bg-green-50">Sign Out</button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link to="/login" className="flex-1 rounded-lg bg-green-600 px-4 py-2.5 text-center text-sm font-semibold text-white">Sign In</Link>
                <Link to="/signup" className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold">Sign Up</Link>
              </div>
            )}
            <Link to="/contact" className="block rounded-lg bg-green-50 px-3 py-2.5 text-sm font-medium text-green-700">Need Help? Contact Support</Link>
          </div>
        </div>
      )}
    </header>
  );
}
