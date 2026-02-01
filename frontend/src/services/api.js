import axios from 'axios';

const API_BASE_URL = 'https://socialapp-backend-xtuo.onrender.com';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (userData) => api.post('/api/auth/register', userData),
  login: (credentials) => api.post('/api/auth/login', credentials),
};

// Post APIs
export const postAPI = {
  getAll: () => api.get('/api/posts/all'),
  create: (formData) => api.post('/api/posts/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  like: (postId) => api.put(`/api/posts/like/${postId}`),
  comment: (postId, commentData) => api.post(`/api/posts/comment/${postId}`, commentData),
};

export default api;
