// components/projects/ProjectList.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import Card from '../../common/Card';
import Button from '../../common/Button';
import Input from '../../common/Input';
import Badge from '../../common/Badge';
import UserAvatar from '../../common/UserAvatar';
import EmptyState from '../../common/EmptyState';
import LoadingSpinner from '../../common/LoadingSpinner';
import ProjectModal from '../projects/ProjectModal';
import { ProjectApis } from '../../api';
import { formatAvatar } from '../../utils/helper';

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
  const navigate = useNavigate();
  
  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalDocs: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  useEffect(() => {
    fetchProjects();
  }, [companyId, pagination.page, searchTerm, statusFilter]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };
      
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      
      const response = await ProjectApis.getProjects(params);
      console.log(response)
      // Process avatars for all users in the response
    const processedProjects = response.docs.map(project => ({
      ...project,
      project_lead: project.project_lead ? {
        ...project.project_lead,
        avatar: formatAvatar(project.project_lead.avatar)
      } : null,
      team_members: project.team_members?.map(member => ({
        ...member,
        avatar: formatAvatar(member.avatar)
      })) || [],
      created_by: project.created_by ? {
        ...project.created_by,
        avatar: formatAvatar(project.created_by.avatar)
      } : null
    }));
    
    setProjects(processedProjects || []);
      setPagination(prev => ({
        ...prev,
        totalPages: response.totalPages,
        totalDocs: response.totalDocs,
        hasNextPage: response.hasNextPage,
        hasPrevPage: response.hasPrevPage
      }));
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    // Reset to first page when searching
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    // Reset to first page when filtering
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleCreateProject = async (projectData) => {
    try {
      // API call to create project would go here
      // After successful creation, refetch projects
      await fetchProjects();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleUpdateProject = async (projectData) => {
    try {
      // API call to update project would go here
      // After successful update, refetch projects
      await fetchProjects();
      setEditingProject(null);
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      // API call to delete project would go here
      // After successful deletion, refetch projects
      await fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  if (loading && pagination.page === 1) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Projects
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage all projects across your organization
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
              <Button
                onClick={() => setShowCreateModal(true)}
                variant="primary"
                icon={Plus}
              >
                New Project
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <Card
            title={`All Projects (${pagination.totalDocs})`}
            className="mb-6"
          >
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Input
                icon={Search}
                placeholder="Search projects..."
                value={searchTerm}
                onChange={handleSearch}
                className="flex-1 max-w-lg"
              />
              
              <select
                className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-[#01a370] focus:border-[#01a370] sm:text-sm"
                value={statusFilter}
                onChange={handleStatusFilterChange}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {projects.length === 0 ? (
              <EmptyState
                icon={Filter}
                title="No projects found"
                description={pagination.totalDocs === 0 
                  ? "Get started by creating your first project." 
                  : "Try adjusting your search or filter criteria."}
                action={
                  pagination.totalDocs === 0 && (
                    <Button onClick={() => setShowCreateModal(true)}>
                      Create Project
                    </Button>
                  )
                }
              />
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  {projects.map((project) => (
                    <ProjectCard
                      key={project._id}
                      project={project}
                      onEdit={() => setEditingProject(project)}
                      onDelete={() => handleDeleteProject(project._id)}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <div className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(pagination.page * pagination.limit, pagination.totalDocs)}
                      </span> of{' '}
                      <span className="font-medium">{pagination.totalDocs}</span> results
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="small"
                        icon={ChevronLeft}
                        disabled={!pagination.hasPrevPage}
                        onClick={() => handlePageChange(pagination.page - 1)}
                      >
                        Previous
                      </Button>
                      
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                          let pageNum;
                          if (pagination.totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (pagination.page <= 3) {
                            pageNum = i + 1;
                          } else if (pagination.page >= pagination.totalPages - 2) {
                            pageNum = pagination.totalPages - 4 + i;
                          } else {
                            pageNum = pagination.page - 2 + i;
                          }
                          
                          return (
                            <Button
                              key={pageNum}
                              variant={pagination.page === pageNum ? "primary" : "outline"}
                              size="small"
                              onClick={() => handlePageChange(pageNum)}
                              className="min-w-[2.5rem]"
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="small"
                        icon={ChevronRight}
                        iconPosition="right"
                        disabled={!pagination.hasNextPage}
                        onClick={() => handlePageChange(pagination.page + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </Card>
        </div>

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
      </main>
    </div>
  );
};

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

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
            {project.team_members?.slice(0, 3).map((member) => (
              <UserAvatar key={member._id} user={member} size="small" />
            ))}
            {project.team_members?.length > 3 && (
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
          <span className="font-medium">{project.issue_count || 0}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Active Sprints:</span>
          <span className="font-medium">{project.active_sprint_count || 0}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectList;