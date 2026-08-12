import axios from 'axios';

const rawApiUrl =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE ||
  'http://localhost:4000/api';

const normalizedApiUrl = rawApiUrl.includes('/api')
  ? rawApiUrl
  : `${rawApiUrl.replace(/\/$/, '')}/api`;

const api = axios.create({
  baseURL: normalizedApiUrl,
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
