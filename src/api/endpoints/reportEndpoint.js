import axiosInstance from '../config/axiosConfig';

const ReportApis = {
  getReportStats: async () => {
    try {
      const response = await axiosInstance.get('/reports/stats');
      return response;
    } catch (error) {
      console.error('getReportStats error:', error);
      throw error.response?.data || error;
    }
  }
};

export default ReportApis;
