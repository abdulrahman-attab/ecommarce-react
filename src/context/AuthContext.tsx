import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { TOKEN_KEY, USER_KEY, getToken } from '../api/axios';
import { authService } from '../api/services/authService';
import { decodeJwt } from '../utils/token';
import type { User } from '../types';

interface AuthCtx {
  user: User | null; token: string | null; ready: boolean;
  login: (t: string, u: User, remember: boolean) => void;
  logout: () => void;
  replaceToken: (t: string) => void;
  updateUser: (u: Partial<User>) => void;
}
const Ctx = createContext<AuthCtx>(null as unknown as AuthCtx);
export const useAuth = () => useContext(Ctx);

const activeStore = () => (localStorage.getItem(TOKEN_KEY) ? localStorage : sessionStorage);
const readUser = (): User | null => { try { return JSON.parse(localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY) || 'null'); } catch { return null; } };
const withId = (u: User, t: string): User => ({ ...u, id: decodeJwt(t)?.id });
const clearAll = () => [localStorage, sessionStorage].forEach((s) => { s.removeItem(TOKEN_KEY); s.removeItem(USER_KEY); });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(getToken());
  const [user, setUser] = useState<User | null>(() => { const t = getToken(); const u = readUser(); return t && u ? withId(u, t) : null; });
  const [ready, setReady] = useState(!getToken());

  const logout = useCallback(() => { clearAll(); setToken(null); setUser(null); }, []);
  const login = useCallback((t: string, u: User, remember: boolean) => {
    clearAll();
    const s = remember ? localStorage : sessionStorage;
    s.setItem(TOKEN_KEY, t); s.setItem(USER_KEY, JSON.stringify(u));
    setToken(t); setUser(withId(u, t));
  }, []);
  const replaceToken = useCallback((t: string) => { activeStore().setItem(TOKEN_KEY, t); setToken(t); }, []);
  const updateUser = useCallback((patch: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      activeStore().setItem(USER_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  useEffect(() => {
    if (getToken()) {
      authService.verifyToken().catch((e) => { if (e?.response) logout(); }).finally(() => setReady(true));
    }
    const h = () => logout();
    window.addEventListener('auth:expired', h);
    return () => window.removeEventListener('auth:expired', h);
  }, [logout]);

  return <Ctx.Provider value={{ user, token, ready, login, logout, replaceToken, updateUser }}>{children}</Ctx.Provider>;
}
