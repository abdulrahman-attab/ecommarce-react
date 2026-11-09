import { Link } from 'react-router-dom';
import { FontAwesomeIcon as FA } from '@fortawesome/react-fontawesome';
import { faTruck, faRotateLeft, faShieldHalved, faHeadset, faPhone, faEnvelope, faLocationDot, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faTwitter, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { container } from '../common';
import Logo from './Logo';
import { useCategories } from '../../hooks/useCategories';

export function FeaturesStrip() {
  const items = [
    [faTruck, 'Free Shipping', 'On orders over 500 EGP'], [faRotateLeft, 'Easy Returns', '14-day return policy'],
    [faShieldHalved, 'Secure Payment', '100% secure checkout'], [faHeadset, '24/7 Support', 'Contact us anytime'],
  ] as const;
  return (
    <div className="bg-green-50">
      <div className={`${container} grid grid-cols-2 gap-6 py-8 lg:grid-cols-4`}>
        {items.map(([icon, t, s]) => (
          <div key={t} className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600"><FA icon={icon} /></span>
            <div><h4 className="text-sm font-semibold text-slate-900">{t}</h4><p className="text-xs text-slate-500">{s}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Footer() {
  const cats = useCategories();
  const catLink = (name: string) => { const c = cats.find((x) => x.name === name); return c ? `/products?category=${c._id}` : '/categories'; };
  const col = (title: string, links: [string, string][]) => (
    <div>
      <h4 className="mb-5 text-base font-semibold text-white">{title}</h4>
      <ul className="space-y-3 text-sm text-slate-400">{links.map(([l, t]) => <li key={l}><Link to={t} className="hover:text-white">{l}</Link></li>)}</ul>
    </div>
  );
  return (
    <>
      <FeaturesStrip />
      <footer className="bg-slate-900 text-slate-400">
        <div className={`${container} grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr]`}>
          <div>
            <Logo boxed />
            <p className="mt-5 max-w-sm text-sm leading-relaxed">FreshCart is your one-stop destination for quality products. From fashion to electronics, we bring you the best brands at competitive prices with a seamless shopping experience.</p>
            <ul className="mt-5 space-y-3 text-sm">
              <li className="flex items-center gap-3"><FA icon={faPhone} className="text-green-500" />+1 (800) 123-4567</li>
              <li className="flex items-center gap-3"><FA icon={faEnvelope} className="text-green-500" />support@freshcart.com</li>
              <li className="flex items-center gap-3"><FA icon={faLocationDot} className="text-green-500" />123 Commerce Street, New York, NY 10001</li>
            </ul>
            <div className="mt-6 flex gap-3">
              {[faFacebookF, faTwitter, faInstagram, faYoutube].map((i, k) => <a key={k} href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-sm hover:bg-green-600 hover:text-white"><FA icon={i} /></a>)}
            </div>
          </div>
          {col('Shop', [['All Products', '/products'], ['Categories', '/categories'], ['Brands', '/brands'], ['Electronics', catLink('Electronics')], ["Men's Fashion", catLink("Men's Fashion")], ["Women's Fashion", catLink("Women's Fashion")]])}
          {col('Account', [['My Account', '/profile'], ['Order History', '/profile/orders'], ['Wishlist', '/wishlist'], ['Shopping Cart', '/cart'], ['Sign In', '/login'], ['Create Account', '/signup']])}
          {col('Support', [['Contact Us', '/contact'], ['Help Center', '/help'], ['Shipping Info', '/shipping'], ['Returns & Refunds', '/returns'], ['Track Order', '/track-order']])}
          {col('Legal', [['Privacy Policy', '/privacy'], ['Terms of Service', '/terms'], ['Cookie Policy', '/cookies']])}
        </div>
        <div className="border-t border-slate-800">
          <div className={`${container} flex flex-col items-center justify-between gap-3 py-6 text-sm sm:flex-row`}>
            <p className="text-slate-500">© 2026 FreshCart. All rights reserved.</p>
            <div className="flex gap-6 text-slate-400">{['Visa', 'Mastercard', 'PayPal'].map((n) => <span key={n} className="flex items-center gap-2"><FA icon={faCreditCard} />{n}</span>)}</div>
          </div>
        </div>
      </footer>
    </>
  );
}
