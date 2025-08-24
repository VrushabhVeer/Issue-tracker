// src/api/endpoints/authEndpoints.js
import axiosInstance from '../config/axiosConfig';

const AuthAPI = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} - API response
   */
  registerUser: async (userData) => {
    try {
      console.log('Registering user:', userData);
      const response = await axiosInstance.post('/auth/register', userData);
      console.log('Register Response:', response);
      return response;
    } catch (error) {
      console.error('registerUser error:', error);
      throw error;
    }
  },

  // You can add other auth-related endpoints here
  loginUser: async (credentials) => {
    // return axiosInstance.post('/auth/login', credentials);
    try {
      const response = axiosInstance.post('/auth/login', credentials);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // ... other auth endpoints
};

export default AuthAPI;