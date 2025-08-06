import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
  timeout: 10000, // 10 second timeout
});

// Add request interceptor to prevent duplicate requests
const pendingRequests = new Map();

axiosInstance.interceptors.request.use(
  (config) => {
    const requestKey = `${config.method}:${config.url}:${JSON.stringify(config.params)}`;
    
    // If request is already pending, cancel the new one
    if (pendingRequests.has(requestKey)) {
      const cancel = axios.CancelToken.source();
      cancel.cancel('Duplicate request cancelled');
      config.cancelToken = cancel.token;
    } else {
      // Add to pending requests
      const cancel = axios.CancelToken.source();
      config.cancelToken = cancel.token;
      pendingRequests.set(requestKey, cancel);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to remove completed requests
axiosInstance.interceptors.response.use(
  (response) => {
    const requestKey = `${response.config.method}:${response.config.url}:${JSON.stringify(response.config.params)}`;
    pendingRequests.delete(requestKey);
    return response;
  },
  (error) => {
    if (error.config) {
      const requestKey = `${error.config.method}:${error.config.url}:${JSON.stringify(error.config.params)}`;
      pendingRequests.delete(requestKey);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
