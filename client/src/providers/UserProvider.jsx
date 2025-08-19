import { createContext, useEffect, useState } from 'react';
import axiosInstance from '../utils/axios';
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
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchMe();
    } else {
      setInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMe = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/auth/me');
      setUser(res.data?.data?.user || null);
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
      const res = await axiosInstance.post('/auth/register', {
        name,
        email,
        password,
        passwordConfirm,
        phone,
      });
      const token = res.data?.token;
      const me = res.data?.data?.user;
      if (token) {
        setItemsInLocalStorage('token', token);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      setUser(me || null);
      return { success: true, message: res.data?.message || 'Registered' };
    } catch (error) {
      const msg = error?.response?.data?.message || 'Registration failed';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const login = async ({ email, password }) => {
    try {
      setLoading(true);
      const res = await axiosInstance.post('/auth/login', { email, password });
      const token = res.data?.token;
      const me = res.data?.data?.user;
      if (token) {
        setItemsInLocalStorage('token', token);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      setUser(me || null);
      return { success: true, message: res.data?.message || 'Logged in' };
    } catch (error) {
      const msg = error?.response?.data?.message || 'Login failed';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (input) => {
    try {
      setLoading(true);
      const payload = typeof input === 'string'
        ? { credential: input }
        : input;
      const res = await axiosInstance.post('/auth/google', payload);
      const token = res.data?.token;
      const me = res.data?.data?.user;
      if (token) {
        setItemsInLocalStorage('token', token);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      setUser(me || null);
      return { success: true, message: res.data?.message || 'Google login successful' };
    } catch (error) {
      const msg = error?.response?.data?.message || 'Google login failed';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (_) {
      // ignore network errors on logout
    } finally {
      setUser(null);
      removeItemFromLocalStorage('token');
      delete axiosInstance.defaults.headers.common['Authorization'];
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
