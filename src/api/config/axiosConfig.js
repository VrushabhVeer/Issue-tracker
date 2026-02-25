import axios from 'axios';
import { setupInterceptors } from './interceptors';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4500',
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configure interceptors
setupInterceptors(axiosInstance);

export default axiosInstance;