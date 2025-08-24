import axios from 'axios';
import { setupInterceptors } from './interceptors';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:4500',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configure interceptors
setupInterceptors(axiosInstance);

export default axiosInstance;