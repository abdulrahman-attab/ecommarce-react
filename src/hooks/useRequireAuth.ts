import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function useRequireAuth() {
  const { token } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const toast = useToast();
  return () => {
    if (token) return true;
    toast('Please sign in first', 'info');
    nav(`/login?callbackUrl=${encodeURIComponent(loc.pathname + loc.search)}`);
    return false;
  };
}
