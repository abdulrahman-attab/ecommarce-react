import { createContext, useCallback, useContext, useState } from 'react';
import type { ReactNode } from 'react';
type Kind = 'success' | 'error' | 'info';
const Ctx = createContext<(msg: string, type?: Kind) => void>(() => {});
export const useToast = () => useContext(Ctx);
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<{ id: number; msg: string; type: Kind }[]>([]);
  const push = useCallback((msg: string, type: Kind = 'success') => {
    const id = Date.now() + Math.random();
    setItems((p) => [...p, { id, msg, type }]);
    setTimeout(() => setItems((p) => p.filter((i) => i.id !== id)), 3500);
  }, []);
  return (
    <Ctx.Provider value={push}>
      {children}
      <div className="fixed right-4 top-4 z-100 flex flex-col gap-2">
        {items.map((i) => (
          <div key={i.id} className={`max-w-xs rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg ${i.type === 'success' ? 'bg-green-600' : i.type === 'error' ? 'bg-red-500' : 'bg-slate-700'}`}>{i.msg}</div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
