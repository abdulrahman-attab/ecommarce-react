export function decodeJwt(token: string): { id?: string; name?: string; role?: string } | null {
  try {
    const p = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(decodeURIComponent(escape(atob(p))));
  } catch { return null; }
}
