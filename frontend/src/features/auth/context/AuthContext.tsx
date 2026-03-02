import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { authLogin, type LoginRes } from '../../../services/api';

type User = LoginRes['user'];

type AuthContextValue = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (u: User | null) => void;
  setToken: (t: string | null) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  const login = useCallback(async (email: string, password: string) => {
    const res = await authLogin(email, password);
    setToken(res.access_token);
    setUser(res.user);
    localStorage.setItem('token', res.access_token);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  }, []);

  useEffect(() => {
    if (!token) {
      queueMicrotask(() => setUser(null));
      return;
    }
    const payload = JSON.parse(atob(token.split('.')[1] ?? '{}'));
    const exp = payload.exp ? payload.exp * 1000 : 0;
    if (exp < Date.now()) {
      queueMicrotask(() => logout());
      return;
    }
    const nextUser = {
      id: payload.sub,
      email: payload.email ?? '',
      name: payload.name ?? '',
      role: payload.role ?? 'patient',
    };
    queueMicrotask(() => setUser(nextUser));
  }, [token, logout]);

  const value: AuthContextValue = { user, token, login, logout, setUser, setToken };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* eslint-disable react-refresh/only-export-components -- useAuth must live with AuthProvider for same context */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
