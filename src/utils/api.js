import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return '';
  if (imageUrl.startsWith('http')) return imageUrl; // already absolute
  const origin = API_URL.replace(/\/api\/?$/, '');
  return `${origin}${imageUrl}`;
};
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('afm_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('afm_token');
      localStorage.removeItem('afm_user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  changePassword: (passwords) => api.post('/auth/change-password', passwords)
};

export const blogAPI = {
  getAll: (params) => api.get('/blogs', { params }),
  getBySlug: (slug) => api.get(`/blogs/${slug}`),
  getAllAdmin: (params) => api.get('/blogs/admin/all', { params }),
  create: (data) => api.post('/blogs', data),
  update: (id, data) => api.put(`/blogs/${id}`, data),
  delete: (id) => api.delete(`/blogs/${id}`),
  togglePublish: (id) => api.patch(`/blogs/${id}/toggle-publish`),
  react: (id, type) => api.patch(`/blogs/${id}/react`, { type })
};

export const eventAPI = {
  getAll: (params) => api.get('/events', { params }),
  getAllAdmin: (params) => api.get('/events/admin/all', { params }),
  getById: (id) => api.get(`/events/${id}`),
  create: (formData) => api.post('/events', formData, {
    headers: { 'Content-Type': undefined }
  }),
  update: (id, formData) => api.put(`/events/${id}`, formData, {
    headers: { 'Content-Type': undefined }
  }),
  delete: (id) => api.delete(`/events/${id}`),
  togglePublish: (id) => api.patch(`/events/${id}/toggle-publish`)
};
export const memberAPI = {
  create: (data) => api.post('/members', data),
  getAll: (params) => api.get('/members', { params }),
  updateStatus: (id, status) => api.patch(`/members/${id}/status`, { status }),
  delete: (id) => api.delete(`/members/${id}`)
};
export const userAPI = {
  getAll: () => api.get('/users'),
  create: (data) => api.post('/users', data),
  toggleActive: (id) => api.patch(`/users/${id}/toggle-active`),
  delete: (id) => api.delete(`/users/${id}`)
};
export default api;