import { useAuthStore } from '@/store/useAuthStore';
import axios from 'axios';

// Instancia base
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    // Consultamos reactiva y estáticamente Zustand
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejo global para tokens inválidos (401)
    if (error.response?.status === 401) {
      useAuthStore.getState().logout(); // Borra localStorage, Memory, y la Cookie
      // Redirige
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
