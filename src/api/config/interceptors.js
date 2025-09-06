export const setupInterceptors = (axiosInstance) => {
  // Request interceptor
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  axiosInstance.interceptors.response.use(
    (response) => response.data,
    (error) => {
      const errorMessage = error.response?.data?.message || error.message;
      // Handle specific status codes
      if (error.response?.status === 401) {
        // Handle unauthorized (e.g., redirect to login)
      }
      return Promise.reject(errorMessage);
    }
  );
};