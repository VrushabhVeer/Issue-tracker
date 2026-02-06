import axios from 'axios';

const BASE_URL = 'http://localhost:4500'; // Make sure this matches your backend port

const SprintApis = {
  createSprint: async (sprintData) => {
    try {
      const response = await axios.post(`${BASE_URL}/sprints`, sprintData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  getProjectSprints: async (projectId) => {
    try {
      const response = await axios.get(`${BASE_URL}/sprints/project/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  startSprint: async (sprintId, data) => {
    try {
      const response = await axios.patch(`${BASE_URL}/sprints/${sprintId}/start`, data, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  completeSprint: async (sprintId, data) => {
    try {
      const response = await axios.patch(`${BASE_URL}/sprints/${sprintId}/complete`, data, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }
};

export default SprintApis;
