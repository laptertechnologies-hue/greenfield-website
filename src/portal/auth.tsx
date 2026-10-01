import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User } from './data';

interface AuthCtx { user: User | null; signIn: (u: User) => void; signOut: () => void; }
const Ctx = createContext<AuthCtx>({ user: null, signIn: () => {}, signOut: () => {} });
const KEY = 'gfss-portal-session';

function load(): User | null {
  try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(load);
  const signIn = (u: User) => { setUser(u); try { localStorage.setItem(KEY, JSON.stringify(u)); } catch { /* ignore */ } };
  const signOut = () => { setUser(null); try { localStorage.removeItem(KEY); } catch { /* ignore */ } };
  return <Ctx.Provider value={{ user, signIn, signOut }}>{children}</Ctx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(Ctx);
