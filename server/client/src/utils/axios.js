import axios from 'axios';

// Prefer explicit VITE_BASE_URL (for separate frontend/backend hosts in prod),
// fall back to same-origin '/api' which is proxied in Vite dev.
const baseURL = import.meta.env?.VITE_BASE_URL || '/api';

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 15000,
});

// Simple response error pass-through
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err)
);

export default axiosInstance;
