import { createContext, useEffect, useState } from 'react';
import { API_URL } from '../lib/api';
import { getItemFromLocalStorage, setItemsInLocalStorage, removeItemFromLocalStorage } from '../utils';

const initialState = {
  user: null,
  register: async () => ({ success: false }),
  login: async () => ({ success: false }),
  googleLogin: async () => ({ success: false }),
  logout: async () => ({ success: true }),
  fetchMe: async () => {},
  loading: false,
};

export const UserContext = createContext(initialState);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Bootstrap auth from stored token
  useEffect(() => {
    const token = getItemFromLocalStorage('token');
    if (token) {
      fetchMe(token);
    } else {
      setInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMe = async (token) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch user');
      const data = await res.json();
      setUser(data?.data?.user || null);
    } catch (err) {
      setUser(null);
      removeItemFromLocalStorage('token');
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  const register = async ({ name, email, password, passwordConfirm, phone }) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, password, passwordConfirm, phone }),
      });
      const data = await res.json();
      const token = data?.token;
      const me = data?.data?.user;
      if (token) {
        setItemsInLocalStorage('token', token);
      }
      setUser(me || null);
      return { success: res.ok, message: data?.message || 'Registered' };
    } catch (error) {
      return { success: false, message: 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const login = async ({ email, password }) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      const token = data?.token;
      const me = data?.data?.user;
      if (token) {
        setItemsInLocalStorage('token', token);
      }
      setUser(me || null);
      return { success: res.ok, message: data?.message || 'Logged in' };
    } catch (error) {
      return { success: false, message: 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (input) => {
    try {
      setLoading(true);
      const payload = typeof input === 'string' ? { credential: input } : input;
      const res = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      const token = data?.token;
      const me = data?.data?.user;
      if (token) {
        setItemsInLocalStorage('token', token);
      }
      setUser(me || null);
      return { success: res.ok, message: data?.message || 'Google login successful' };
    } catch (error) {
      return { success: false, message: 'Google login failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (_) {
      // ignore network errors on logout
    } finally {
      setUser(null);
      removeItemFromLocalStorage('token');
    }
    return { success: true, message: 'Logged out' };
  };

  const auth = {
    user,
    loading: loading || !initialized,
    register,
    login,
    googleLogin,
    logout,
    fetchMe,
  };

  return <UserContext.Provider value={auth}>{children}</UserContext.Provider>;
};
