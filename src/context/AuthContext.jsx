import { createContext, useContext, useState, useCallback } from 'react';
import { loginUser, registerUser } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const isLoggedIn = !!user;

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const result = await loginUser(email, password);
      if (result.success) {
        setUser(result.user);
        showToast('Successfully signed in!', 'success');
        return { success: true };
      }
      showToast(result.error, 'error');
      return { success: false, error: result.error };
    } catch {
      showToast('An error occurred. Please try again.', 'error');
      return { success: false, error: 'Network error' };
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const register = useCallback(async (data) => {
    setLoading(true);
    try {
      const result = await registerUser(data);
      if (result.success) {
        setUser(result.user);
        showToast('Account created successfully!', 'success');
        return { success: true };
      }
      showToast(result.error, 'error');
      return { success: false, error: result.error };
    } catch {
      showToast('An error occurred. Please try again.', 'error');
      return { success: false, error: 'Network error' };
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const logout = useCallback(() => {
    setUser(null);
    showToast('Signed out successfully.', 'success');
  }, [showToast]);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
