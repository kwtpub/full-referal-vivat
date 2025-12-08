import axios from 'axios';
import type { AuthResponse } from '../models/response/AuthResponse';

export const API_URL = import.meta.env.VITE_API_URL || '/api';

const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

$api.interceptors.request.use((config) => {
  if (config.headers) {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }
  return config;
});

$api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    try {
      if (error.response?.status === 401 && error.config && !error.config._isRetry) {
        originalRequest._isRetry = true;
        const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {
          withCredentials: true,
        });
        localStorage.setItem('token', response.data.accessToken);
        return $api.request(originalRequest);
      }
    } catch (e) {
      console.log('НЕ АВТОРИЗОВАН', e);
    }
    throw error;
  },
);

export default $api; // 1:18
