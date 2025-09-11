// components/projects/ProjectModal.jsx
import React, { useState, useEffect } from 'react';
import { User, Users, AlertCircle, Loader, Tag } from 'lucide-react';
import Modal from '../../common/Modal';
import Button from '../../common/Button';
import Input from '../../common/Input';
import TextArea from '../../common/TextArea';
import Select from '../../common/Select';
import { toast } from 'react-toastify';
import { AuthAPI, ProjectApis } from '../../api/index';
import ToastNotification from '../../common/ToastNotification';
import LoadingSpinner from '../../common/LoadingSpinner';
import UserSelect from '../../common/UserSelect';

const ProjectModal = ({ isOpen, onClose, onSubmit, project, companyId }) => {
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState('');
  const [companyUsers, setCompanyUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    key: '',
    description: '',
    categories: '',
    project_lead: '',
    team_members: [],
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    status: 'active'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && companyId) {
      fetchMembers();
    }
  }, [isOpen, companyId]);

  const fetchMembers = async () => {
    if (!companyId) {
      setUsersError('Company ID is required');
      return;
    }

    setUsersLoading(true);
    setUsersError('');
    
    try {
      const response = await AuthAPI.getAllCompanyMembers(companyId);
      if (response.error) {
        // setUsersError(response.error || 'Failed to fetch team members');
        console.error('Failed to fetch members:', response.error);
      } else {
        setCompanyUsers(response.users || []);
      }
    } catch (error) {
      console.error('Error fetching company members:', error);
      
      const errorMessage = error.message?.error_message || 
                          error.error_message || 
                          'Failed to load team members. Please try again.';
      
      setUsersError(errorMessage);
      // toast.error(errorMessage);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        key: project.key || '',
        description: project.description || '',
        categories: project.categories ? project.categories.join(', ') : '',
        project_lead: project.project_lead?._id || '',
        team_members: project.team_members?.map(member => member._id) || [],
        start_date: project.start_date ? new Date(project.start_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        end_date: project.end_date ? new Date(project.end_date).toISOString().split('T')[0] : '',
        status: project.status || 'active'
      });
    } else {
      setFormData({
        name: '',
        key: '',
        description: '',
        categories: '',
        project_lead: '',
        team_members: [],
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        status: 'active'
      });
    }
  }, [project]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Project name is required';
    if (!formData.key.trim()) newErrors.key = 'Project key is required';
    if (formData.key.length > 10) newErrors.key = 'Project key must be 10 characters or less';
    if (!formData.project_lead) newErrors.project_lead = 'Project lead is required';
    if (formData.team_members.length === 0) newErrors.team_members = 'At least one team member is required';
    if (formData.end_date && new Date(formData.end_date) < new Date(formData.start_date)) {
      newErrors.end_date = 'End date cannot be before start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) return;

  setLoading(true);
  try {
    // Convert categories string to array
    const categoriesArray = formData.categories
      ? formData.categories.split(',').map(cat => cat.trim()).filter(cat => cat)
      : [];

    // Prepare the project data
    const projectData = {
      name: formData.name.trim(),
      key: formData.key.trim().toUpperCase(),
      description: formData.description.trim(),
      categories: categoriesArray,
      project_lead: formData.project_lead,
      team_members: formData.team_members,
      start_date: formData.start_date,
      end_date: formData.end_date || null,
      status: formData.status
    };
    
    console.log('Sending project data:', projectData);
    
    let response;
    if (project) {
      // Update existing project
      response = await ProjectApis.updateProject(project._id, projectData);
      console.log('Update response:', response);
      toast.success('Project updated successfully!');
    } else {
      // Create new project
      response = await ProjectApis.createProject(projectData);
      console.log('Create response:', response);
      toast.success('Project created successfully!');
    }
    
    // Call the parent onSubmit callback
    const projectResult = response.project || response.data || response;
    console.log('Passing to onSubmit:', projectResult);
    
    onSubmit(projectResult);
    
    onClose();
  } catch (error) {
    console.error('Error saving project:', error);
    
    // Handle validation errors from backend
    if (error.errors) {
      const backendErrors = {};
      Object.keys(error.errors).forEach(key => {
        backendErrors[key] = error.errors[key].message;
      });
      setErrors(backendErrors);
    }

    const errorMessage = error.message?.error_message || 
                        error.error_message || 
                        error.error ||
                        'Failed to save project. Please try again.';
    toast.error(errorMessage);
    
    // Re-throw the error so the parent component can handle it if needed
    throw error;
  } finally {
    setLoading(false);
  }
};

  const handleTeamMembersChange = (selectedUserIds) => {
    setFormData(prev => ({
      ...prev,
      team_members: selectedUserIds
    }));
  };

  const handleProjectLeadChange = (userId) => {
    setFormData(prev => ({
      ...prev,
      project_lead: userId,
      // Ensure project lead is always in team members
      team_members: prev.team_members.includes(userId) 
        ? prev.team_members 
        : [...prev.team_members, userId]
    }));
  };

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'completed', label: 'Completed' },
    { value: 'archived', label: 'Archived' }
  ];

  // Suggested categories for better UX
  const suggestedCategories = [
    'Web Development', 'Mobile Development', 'UI/UX Design', 
    'API Development', 'DevOps', 'Quality Assurance',
    'Data Analytics', 'CRM', 'ERP', 'E-commerce'
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={project ? 'Edit Project' : 'Create New Project'}
      size="large"
    >
      <ToastNotification />
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Project Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            required
          />

          <Input
            label="Project Key"
            value={formData.key}
            onChange={(e) => setFormData({ ...formData, key: e.target.value.toUpperCase() })}
            error={errors.key}
            maxLength={10}
            required
            helperText="Short uppercase identifier (e.g., WRD, MAD)"
          />
        </div>

        <TextArea
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />

        {/* Categories Input Field - Added below Description */}
        <div>
          <Input
            label="Categories"
            value={formData.categories}
            onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
            icon={Tag}
            helperText="Comma-separated categories (e.g., Web Development, UI/UX Design, API)"
            placeholder="Enter categories separated by commas"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <UserSelect
              label="Project Lead"
              companyMembers={companyUsers}
              value={formData.project_lead}
              onChange={handleProjectLeadChange}
              error={errors.project_lead}
              required
              icon={User}
              helperText="Select the project lead"
              loading={usersLoading}
              disabled={usersLoading || !!usersError}
            />
            {usersLoading && (
            <div className="absolute right-3 top-9">
              <LoadingSpinner size="small" className="text-gray-400" />
            </div>
          )}
          </div>

          <Select
            label="Status"
            options={statusOptions}
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          />
        </div>

        <div className="relative">
          <UserSelect
            label="Team Members"
            companyMembers={companyUsers}
            value={formData.team_members}
            onChange={handleTeamMembersChange}
            error={errors.team_members}
            required
            multiple
            icon={Users}
            helperText="Select team members for this project"
            loading={usersLoading}
            disabled={usersLoading || !!usersError}
          />
          {usersLoading && (
            <div className="absolute right-3 top-9">
              <LoadingSpinner size="small" className="text-gray-400" />
            </div>
          )}
        </div>

        {usersError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
              <span className="text-red-700 text-sm">{usersError}</span>
            </div>
            <button
              type="button"
              onClick={fetchMembers}
              className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Try again
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Start Date"
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            required
          />

          <Input
            label="End Date"
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            error={errors.end_date}
            min={formData.start_date}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
            disabled={usersLoading || !!usersError}
          >
            {project ? 'Update Project' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectModal;