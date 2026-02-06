import axiosInstance from '../config/axiosConfig';

const CompanyApis = {
  createCompany: async (companyData) => {
    try {
      const response = await axiosInstance.post('/companies', companyData);
      return response;
    } catch (error) {
      console.error('createCompany error:', error);
      throw error;
    }
  },
  getCompanyByCode: async (code) => {
    try {
      const response = await axiosInstance.get(`/companies/code/${code}`);
      return response;
    } catch (error) {
      console.error('getCompanyByCode error:', error);
      throw error;
    }
  }
};

export default CompanyApis;
