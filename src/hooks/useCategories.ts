import { useEffect, useState } from 'react';
import { categoryService } from '../api/services/categoryService';
import type { Named } from '../types';
let cache: Promise<Named[]> | null = null; 
export function useCategories() {
  const [data, setData] = useState<Named[]>([]);
  useEffect(() => {
    if (!cache) cache = categoryService.list();
    cache.then(setData).catch(() => { cache = null; });
  }, []);
  return data;
}
