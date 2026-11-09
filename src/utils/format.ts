export const price = (n: number) => `${n} EGP`;
export const discountOf = (p: { price: number; priceAfterDiscount?: number }) => {
  const has = p.priceAfterDiscount != null && p.priceAfterDiscount < p.price;
  const current = has ? (p.priceAfterDiscount as number) : p.price;
  return { has, current, pct: has ? Math.round((1 - current / p.price) * 100) : 0 };
};
export const safeCallback = (v: string | null) => (v && v.startsWith('/') && !v.startsWith('//') ? v : '/');
