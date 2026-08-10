import api from './api';

export async function login(email: string, password: string) {
  const r = await api.post('/auth/login', { email, password });
  const { token, user } = r.data;
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  return user;
}

export async function register(data: { email: string; password: string; fullName: string; roleName: string }) {
  const r = await api.post('/auth/register', data);
  return r.data;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getToken() {
  return localStorage.getItem('token');
}

export function getUser() {
  const u = localStorage.getItem('user');
  return u ? JSON.parse(u) : null;
}
