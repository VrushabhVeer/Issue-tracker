// api/ProjectApis.js
import axiosInstance from '../config/axiosConfig';

const ProjectApis = {
  // Get all projects
  getProjects: async (params = {}) => {
    try {
      const response = await axiosInstance.get(`/projects`, {
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          search: params.search || '',
          status: params.status || ''
        },
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      return response;
    } catch (error) {
      console.error('getProjects error:', error);
      throw error.response?.data || error;
    }
  },

  getProjectNames: async () => {
  try {
    const response = await axiosInstance.get(`/projects/project-names`);
    return response;
  } catch (error) {
    console.error('getProjectsSimple error:', error);
    throw error.response?.data || error;
  }
},

  // Create project
  createProject: async (projectData) => {
    try {
      // Convert form data to match backend expectations
      const payload = {
        name: projectData.name,
        key: projectData.key,
        description: projectData.description,
        project_lead: projectData.project_lead,
        team_members: projectData.team_members,
        start_date: projectData.start_date,
        end_date: projectData.end_date || null,
        status: projectData.status,
        categories: projectData.categories
      };

      const response = await axiosInstance.post(`/projects`, payload);
      return response;
    } catch (error) {
      console.error('createProject error:', error);
      throw error.response?.data || error;
    }
  },

// api/ProjectApis.js
updateProject: async (id, projectData) => {
  try {
    // Convert the project data to match backend expectations
    const payload = {
      name: projectData.name,
      key: projectData.key,
      description: projectData.description,
      project_lead: projectData.project_lead,
      team_members: projectData.team_members, // This should be an array
      start_date: projectData.start_date,
      end_date: projectData.end_date || null,
      status: projectData.status,
      categories: projectData.categories // This should be an array
    };

    const response = await axiosInstance.patch(`/projects/${id}`, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response;
  } catch (error) {
    console.error('updateProject error:', error);
    throw error.response?.data || error;
  }
},
  // Delete project (archive)
  deleteProject: async (id) => {
    try {
      const response = await axiosInstance.delete(`/projects/${id}`);
      return response;
    } catch (error) {
      // console.error('deleteProject error:', error);
      // if(error?.error_type){
      //   return error?.error_type
      // }
      console.error('deleteProject error:', error);
      throw error.response?.data || error;
    }
  }
};

export default ProjectApis;