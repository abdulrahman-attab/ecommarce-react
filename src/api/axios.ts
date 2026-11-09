import axios from 'axios';
import type { AxiosResponse } from 'axios';

export const TOKEN_KEY = 'freshcart_token';
export const USER_KEY = 'freshcart_user';
export const getToken = () => localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || 'https://ecommerce.routemisr.com/api', timeout: 20000 });

api.interceptors.request.use((config) => {
  const t = getToken();
  if (t) config.headers.set('token', t);
  return config;
});
api.interceptors.response.use(
  (r) => r,
  (e) => {
    if (e?.response?.status === 401 && getToken()) window.dispatchEvent(new Event('auth:expired'));
    return Promise.reject(e);
  },
);

export const unwrap = <T>(p: Promise<AxiosResponse<T>>) => p.then((r) => r.data);
export const errMsg = (e: unknown, fallback = 'Something went wrong') => {
  if (axios.isAxiosError(e)) return e.response?.data?.message || e.response?.data?.errors?.msg || e.message || fallback;
  return fallback;
};
export default api;
