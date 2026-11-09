import { Link } from 'react-router-dom';
import { FontAwesomeIcon as FA } from '@fortawesome/react-fontawesome';
import { faHeart, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { btnLight, btnPrimary, container, EmptyState, SectionTitle, Spinner } from '../components/common';
import { ProductGrid } from '../components/ProductCard';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

export default function Wishlist() {
  const { products, loading } = useWishlist();
  const { token } = useAuth();
  if (loading && !products.length) return <Spinner />;
  if (!products.length) {
    return (
      <EmptyState icon={faHeart} title="Your wishlist is empty" text="Browse products and save your favorites here. Sign in to sync your wishlist across devices.">
        <Link to="/products" className={btnPrimary}>Browse Products <FA icon={faArrowRight} /></Link>
        {!token && <Link to="/login" className={btnLight}>Sign In</Link>}
      </EmptyState>
    );
  }
  return <div className={`${container} py-8`}><SectionTitle a="My" b="Wishlist" /><ProductGrid items={products} /></div>;
}
