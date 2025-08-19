import axios from 'axios';

// Always use same-origin "/api"; vite dev server proxies to backend
const axiosInstance = axios.create({
  baseURL: '/api',
  withCredentials: true,
  timeout: 15000,
});

// Simple response error pass-through
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err)
);

export default axiosInstance;
