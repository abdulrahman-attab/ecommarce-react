import { Link } from 'react-router-dom';
import { FontAwesomeIcon as FA } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

export default function Logo({ boxed = false }: { boxed?: boolean }) {
  return (
    <Link to="/" className={`flex items-center gap-2 text-2xl font-bold text-slate-900 ${boxed ? 'rounded-lg bg-white px-3 py-1.5' : ''}`}>
      <FA icon={faCartShopping} className="text-green-600" /> FreshCart
    </Link>
  );
}
