// components/projects/ProjectSelect.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, Check, Building2 } from 'lucide-react';
import Input from './Input';

const ProjectSelect = ({ 
  label, 
  projects,
  value, 
  onChange, 
  error, 
  helperText, 
  required, 
  multiple = false, 
  icon: Icon,
  className = '',
  containerClassName = '',
  loading = false,
  disabled = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Close dropdown when clicking outside
    console.log("projects",projects)
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredProjects = useMemo(() => {
    if (!searchTerm) return projects || [];
    return (projects || []).filter(project => 
      project && project.name && project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project && project.key && project.key.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [projects, searchTerm]);

  const handleSelectProject = (projectId) => {
    if (multiple) {
      const isSelected = (value || []).includes(projectId);
      if (isSelected) {
        onChange((value || []).filter(id => id !== projectId));
      } else {
        onChange([...(value || []), projectId]);
      }
    } else {
      onChange(projectId);
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const removeProject = (projectId, e) => {
    e.stopPropagation();
    if (multiple) {
      onChange((value || []).filter(id => id !== projectId));
    } else {
      onChange('');
    }
  };

  const getSelectedProjects = () => {
    if (multiple) {
      return (projects || []).filter(project => project && (value || []).includes(project._id));
    }
    return (projects || []).find(project => project && project._id === value) || null;
  };

  const getSelectedCount = () => {
    if (multiple) {
      return (value || []).length;
    }
    return value ? 1 : 0;
  };

  const toggleDropdown = () => {
    if (disabled || loading) return;
    
    setIsOpen(!isOpen);
    setSearchTerm('');
    
    if (!isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const getProjectDisplayText = (project) => {
    if (!project) return '';
    return `${project.name} (${project.key})`;
  };

  return (
    <div className={containerClassName} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {/* Input display */}
        <div 
          className={`
            min-h-10 flex items-center flex-wrap gap-2 w-full border border-gray-300 rounded-md shadow-sm 
            focus:ring-[#01a370] focus:border-[#01a370] px-3 py-2 text-sm 
            ${!disabled && !loading ? 'cursor-pointer' : 'cursor-not-allowed bg-gray-50'}
            ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
            ${className}
          `}
          onClick={toggleDropdown}
        >
          {Icon && getSelectedCount() === 0 && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon className="h-5 w-5 text-gray-400" />
            </div>
          )}
          
          {loading ? (
            <span className="text-gray-400 pl-5">Loading projects...</span>
          ) : multiple ? (
            <>
              {getSelectedCount() === 0 ? (
                <span className="text-gray-400 pl-5">Select projects...</span>
              ) : (
                getSelectedProjects().map(project => (
                  project && (
                    <div
                      key={project._id}
                      className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Building2 className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="mr-2">{getProjectDisplayText(project)}</span>
                      <button
                        type="button"
                        className="text-gray-500 hover:text-gray-700"
                        onClick={(e) => removeProject(project._id, e)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )
                ))
              )}
            </>
          ) : (
            <>
              {getSelectedProjects() ? (
                <div className="flex items-center pl-5">
                  <Building2 className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="flex-1">{getProjectDisplayText(getSelectedProjects())}</span>
                  <button
                    type="button"
                    className="ml-2 text-gray-500 hover:text-gray-700"
                    onClick={(e) => removeProject(getSelectedProjects()._id, e)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <span className="text-gray-400 pl-5">Select a project...</span>
              )}
            </>
          )}
          
          {!loading && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>

        {/* Dropdown */}
        {isOpen && !loading && (
          <div className="absolute z-50 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto">
            <div className="p-2 border-b border-gray-200" onClick={(e) => e.stopPropagation()}>
              <Input
                ref={inputRef}
                icon={Search}
                placeholder="Search projects..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="mb-0"
              />
            </div>
            
            {filteredProjects.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {searchTerm ? 'No projects found' : 'No projects available'}
              </div>
            ) : (
              <ul className="py-1">
                {filteredProjects.map((project) => {
                  if (!project) return null;
                  
                  const isSelected = multiple 
                    ? (value || []).includes(project._id)
                    : value === project._id;
                  
                  return (
                    <li
                      key={project._id}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between ${
                        isSelected ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => handleSelectProject(project._id)}
                    >
                      <div className="flex items-center">
                        <Building2 className="h-4 w-4 text-gray-500 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{project.name}</div>
                          <div className="text-xs text-gray-500">Key: {project.key}</div>
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="h-4 w-4 text-[#01a370]" />
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default ProjectSelect;