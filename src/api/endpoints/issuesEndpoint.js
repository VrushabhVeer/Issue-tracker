import axiosInstance from '../config/axiosConfig';

const IssueApis = {
  // Get all projects
  getIssues: async (params = {}) => {
    try {
      const response = await axiosInstance.get(`/issues`, {
        params
      });
      return response;
    } catch (error) {
      console.error('getIssues error:', error);
      throw error.response?.data || error;
    }
  },
  createIssue: async (issueData) => {
    try {
      const response = await axiosInstance.post(`/issues`, issueData);
      console.log('createIssue response:', response);
      return response;
    } catch (error) {
      console.error('createIssue error:', error);
      throw error.response?.data || error;
    }
  },
  getIssueById: async (id) => {
    try {
      const response = await axiosInstance.get(`/issues/${id}`);
      return response;
    } catch (error) {
      console.error('getIssueById error:', error);
      throw error.response?.data || error;
    }
  },
  updateIssue: async (id, issueData) => {
    try {
      const response = await axiosInstance.patch(`/issues/${id}`, issueData);
      return response;
    } catch (error) {
      console.error('updateIssue error:', error);
      throw error.response?.data || error;
    }
  },
  deleteIssue: async (id) => {
    try {
      const response = await axiosInstance.delete(`/issues/${id}`);
      return response;
    } catch (error) {
      console.error('deleteIssue error:', error);
      throw error.response?.data || error;
    }
  },
  addComment: async (id, content) => {
    try {
      const response = await axiosInstance.post(`/issues/${id}/comments`, { content });
      return response;
    } catch (error) {
      console.error('addComment error:', error);
      throw error.response?.data || error;
    }
  },
  addSubtask: async (id, subtaskData) => {
    try {
      const response = await axiosInstance.post(`/issues/${id}/subtasks`, subtaskData);
      return response;
    } catch (error) {
      console.error('addSubtask error:', error);
      throw error.response?.data || error;
    }
  },
  getBoardData: async (projectId) => {
    try {
      const response = await axiosInstance.get(`/issues/board/${projectId}`);
      return response;
    } catch (error) {
      console.error('getBoardData error:', error);
      throw error.response?.data || error;
    }
  },
  getBacklog: async (projectId) => {
    try {
      const response = await axiosInstance.get(`/issues/backlog/${projectId}`);
      return response;
    } catch (error) {
      console.error('getBacklog error:', error);
      throw error.response?.data || error;
    }
  }
};



export default IssueApis;