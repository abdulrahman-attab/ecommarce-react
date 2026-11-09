import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Spinner } from './components/common';
import { safeCallback } from './utils/format';

export function ProtectedRoute() {
  const { token, ready } = useAuth();
  const loc = useLocation();
  if (!ready) return <Spinner />;
  if (!token) return <Navigate to={`/login?callbackUrl=${encodeURIComponent(loc.pathname + loc.search)}`} replace />;
  return <Outlet />;
}
export function GuestRoute() {
  const { token } = useAuth();
  const sp = new URLSearchParams(useLocation().search);
  if (token) return <Navigate to={safeCallback(sp.get('callbackUrl'))} replace />;
  return <Outlet />;
}
