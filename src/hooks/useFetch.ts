import { useEffect, useState } from 'react';
import { errMsg } from '../api/axios';
export function useFetch<T>(fn: () => Promise<T>, deps: unknown[]) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let live = true;
    setLoading(true); setError('');
    fn().then((d) => live && setData(d)).catch((e) => live && setError(errMsg(e))).finally(() => live && setLoading(false));
    return () => { live = false; };
  }, deps);
  return { data, loading, error, setData };
}
