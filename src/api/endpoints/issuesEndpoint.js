import axiosInstance from '../config/axiosConfig';

const IssueApis = {
  // Get all projects
  getIssues: async (params = {}) => {
    try {
      const response = await axiosInstance.get(`/issues`, {
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          search: params.search || '',
          status: params.status || ''
        },
      });
      return response.data;
    } catch (error) {
      console.error('getIssues error:', error);
      throw error.response?.data || error;
    }
  },
};

export default IssueApis;