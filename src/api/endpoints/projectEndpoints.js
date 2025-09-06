import axiosInstance from '../config/axiosConfig';

const ProjectApis = {
  // Get all projects
   getProjects: async (params = {}) => {
    try {
      const response = await axiosInstance.get(`/projects`, {
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
        },
           headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      console.log(response)
      return response.data;
    } catch (error) {
      console.error('getProjects error:', error);
      throw error.response?.data || error;
    }
  },

  // add project
  createProject: async (projectData) => {
    try{
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
      console.log(response);
      return response.data;
    }catch(error){
      console.error('addProject error:', error);
      throw error;
    }
  }
};

export default ProjectApis;