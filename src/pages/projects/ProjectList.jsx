// components/projects/ProjectList.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreVertical } from 'lucide-react';
import Card from '../../common/Card';
import Button from '../../common/Button';
import Input from '../../common/Input';
import Badge from '../../common/Badge';
import UserAvatar from '../../common/UserAvatar';
import EmptyState from '../../common/EmptyState';
import LoadingSpinner from '../../common/LoadingSpinner';
import ProjectModal from '../projects/ProjectModal';
import { AuthAPI } from '../../api';

const getStatusVariant = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'completed': return 'primary';
      case 'inactive': return 'warning';
      case 'archived': return 'default';
      default: return 'default';
    }
  };

const ProjectList = ({ companyId }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  useEffect(() => {
    fetchProjects();
  }, [companyId]);


  const fetchProjects = async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      // const response = await fetch(`/api/companies/${companyId}/projects`);
      // const data = await response.json();
      
      // Mock data for demonstration
      const mockProjects = [
        {
          _id: '1',
          name: 'Website Redesign',
          key: 'WRD',
          description: 'Complete redesign of company website',
          project_lead: { _id: '1', name: 'John Doe', avatar: null },
          team_members: [
            { _id: '1', name: 'John Doe', avatar: null },
            { _id: '2', name: 'Jane Smith', avatar: null },
            { _id: '3', name: 'Bob Johnson', avatar: null }
          ],
          status: 'active',
          start_date: '2023-01-15',
          end_date: '2023-06-30',
          issue_count: 24,
          active_sprint_count: 1
        },
        {
          _id: '2',
          name: 'Mobile App Development',
          key: 'MAD',
          description: 'New mobile application for iOS and Android',
          project_lead: { _id: '2', name: 'Jane Smith', avatar: null },
          team_members: [
            { _id: '2', name: 'Jane Smith', avatar: null },
            { _id: '4', name: 'Alice Brown', avatar: null },
            { _id: '5', name: 'Charlie Wilson', avatar: null }
          ],
          status: 'active',
          start_date: '2023-02-01',
          end_date: '2023-08-31',
          issue_count: 42,
          active_sprint_count: 2
        },
        {
          _id: '3',
          name: 'API Integration',
          key: 'API',
          description: 'Third-party API integration project',
          project_lead: { _id: '3', name: 'Bob Johnson', avatar: null },
          team_members: [
            { _id: '3', name: 'Bob Johnson', avatar: null },
            { _id: '1', name: 'John Doe', avatar: null }
          ],
          status: 'completed',
          start_date: '2022-11-01',
          end_date: '2023-01-31',
          issue_count: 18,
          active_sprint_count: 0
        }
      ];
      
      setProjects(mockProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (projectData) => {
    try {
      // API call to create project
      // await fetch(`/api/companies/${companyId}/projects`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(projectData)
      // });
      
      // For demo purposes, just add to local state
      const newProject = {
        ...projectData,
        _id: Date.now().toString(),
        issue_count: 0,
        active_sprint_count: 0
      };
      
      setProjects([...projects, newProject]);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleUpdateProject = async (projectData) => {
    try {
      // API call to update project
      // await fetch(`/api/companies/${companyId}/projects/${editingProject._id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(projectData)
      // });
      
      // For demo purposes, update local state
      setProjects(projects.map(p => 
        p._id === editingProject._id ? { ...p, ...projectData } : p
      ));
      
      setEditingProject(null);
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      // API call to delete project
      // await fetch(`/api/companies/${companyId}/projects/${projectId}`, {
      //   method: 'DELETE'
      // });
      
      // For demo purposes, remove from local state
      setProjects(projects.filter(p => p._id !== projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card
        title="Projects"
        actions={
          <Button
            icon={Plus}
            onClick={() => setShowCreateModal(true)}
          >
            New Project
          </Button>
        }
      >
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Input
            icon={Search}
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          
          <select
            className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-[#01a370] focus:border-[#01a370] sm:text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {filteredProjects.length === 0 ? (
          <EmptyState
            icon={Filter}
            title="No projects found"
            description={projects.length === 0 
              ? "Get started by creating your first project." 
              : "Try adjusting your search or filter criteria."}
            action={
              projects.length === 0 && (
                <Button onClick={() => setShowCreateModal(true)}>
                  Create Project
                </Button>
              )
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onEdit={() => setEditingProject(project)}
                onDelete={() => handleDeleteProject(project._id)}
              />
            ))}
          </div>
        )}
      </Card>

      {showCreateModal && (
        <ProjectModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateProject}
          companyId={companyId}
        />
      )}

      {editingProject && (
        <ProjectModal
          isOpen={!!editingProject}
          onClose={() => setEditingProject(null)}
          onSubmit={handleUpdateProject}
          project={editingProject}
          companyId={companyId}
        />
      )}
    </div>
  );
};

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            {project.key} - {project.name}
            <Badge variant={getStatusVariant(project.status)} size="small">
              {project.status}
            </Badge>
          </h3>
          {project.description && (
            <p className="text-gray-600 text-sm mt-1">{project.description}</p>
          )}
        </div>
        
        <div className="relative">
          <Button
            variant="ghost"
            size="small"
            icon={MoreVertical}
            onClick={() => setShowMenu(!showMenu)}
          />
          
          {showMenu && (
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  onEdit();
                  setShowMenu(false);
                }}
              >
                Edit Project
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this project?')) {
                    onDelete();
                  }
                  setShowMenu(false);
                }}
              >
                Delete Project
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Project Lead:</span>
          <UserAvatar user={project.project_lead} size="small" showName />
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Team Members:</span>
          <div className="flex -space-x-2">
            {project.team_members.slice(0, 3).map((member) => (
              <UserAvatar key={member._id} user={member} size="small" />
            ))}
            {project.team_members.length > 3 && (
              <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600">
                +{project.team_members.length - 3}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Timeline:</span>
          <span>
            {formatDate(project.start_date)} - {project.end_date ? formatDate(project.end_date) : 'Ongoing'}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Issues:</span>
          <span className="font-medium">{project.issue_count}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Active Sprints:</span>
          <span className="font-medium">{project.active_sprint_count}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectList;