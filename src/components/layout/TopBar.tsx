import { Link } from 'react-router-dom';
import { FontAwesomeIcon as FA } from '@fortawesome/react-fontawesome';
import { faTruck, faGift, faPhone, faEnvelope, faUser, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { container } from '../common';
import { useAuth } from '../../context/AuthContext';

export default function TopBar() {
  const { user, logout } = useAuth();
  return (
    <div className="hidden border-b border-slate-100 bg-white text-xs text-slate-600 md:block">
      <div className={`${container} flex items-center justify-between py-2`}>
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-2"><FA icon={faTruck} className="text-green-600" />Free Shipping on Orders 500 EGP</span>
          <span className="flex items-center gap-2"><FA icon={faGift} className="text-green-600" />New Arrivals Daily</span>
        </div>
        <div className="flex items-center gap-5">
          <a href="tel:+18001234567" className="flex items-center gap-2 hover:text-green-600"><FA icon={faPhone} className="text-green-600" />+1 (800) 123-4567</a>
          <a href="mailto:support@freshcart.com" className="flex items-center gap-2 hover:text-green-600"><FA icon={faEnvelope} className="text-slate-400" />support@freshcart.com</a>
          <span className="h-4 w-px bg-slate-200" />
          {user ? (
            <>
              <Link to="/profile" className="flex items-center gap-1.5 hover:text-green-600"><FA icon={faUser} />{user.name}</Link>
              <button onClick={logout} className="hover:text-green-600">Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="flex items-center gap-1.5 hover:text-green-600"><FA icon={faUser} />Sign In</Link>
              <Link to="/signup" className="flex items-center gap-1.5 hover:text-green-600"><FA icon={faUserPlus} />Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
