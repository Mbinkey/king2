// Authentication context and session management
import { createContext, useContext } from 'react';

export interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function getSession(): boolean {
  return sessionStorage.getItem('apex_admin_session') === 'authenticated';
}

export function setSession(): void {
  sessionStorage.setItem('apex_admin_session', 'authenticated');
}

export function clearSession(): void {
  sessionStorage.removeItem('apex_admin_session');
}
