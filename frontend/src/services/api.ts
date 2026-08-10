import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:4000/api',
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  r => r,
  err => {
    const status = err?.response?.status;
    if (status === 401) {
      // Clear token and force reload to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      try { window.location.href = '/login'; } catch (e) {}
    }
    return Promise.reject(err);
  }
);

export default api;
