import axiosInstance from '../config/axiosConfig';

const DashboardApis = {
  getDashboardStats: async () => {
    try {
      const response = await axiosInstance.get('/dashboard/stats');
      return response;
    } catch (error) {
      console.error('getDashboardStats error:', error);
      throw error.response?.data || error;
    }
  }
};

export default DashboardApis;
