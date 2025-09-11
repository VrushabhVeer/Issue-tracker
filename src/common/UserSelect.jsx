// components/projects/UserSelect.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, Check } from 'lucide-react';
import Input from './Input';
import UserAvatar from './UserAvatar';

const UserSelect = ({ 
  label, 
  companyMembers,
  companyId, 
  value, 
  onChange, 
  error, 
  helperText, 
  required, 
  multiple = false, 
  icon: Icon,
  className = '',
  containerClassName = '' 
}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Close dropdown when clicking outside
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

  useEffect(() => {
    // Process company members to convert base64 avatars to data URLs
    const processedUsers = (companyMembers || []).map(user => {
      if (user && user.avatar) {
        // If avatar is already a base64 string, convert it to data URL
        if (typeof user.avatar === 'string' && user.avatar.startsWith('iVBORw0KGgo')) {
          return {
            ...user,
            avatar: `data:image/png;base64,${user.avatar}`
          };
        }
        // If avatar is already a data URL or other format, keep it as is
        return user;
      }
      return user;
    });
    
    setUsers(processedUsers || []);
    setLoading(false);
  }, [companyMembers]);

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    return users.filter(user => 
      user && user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user && user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const handleSelectUser = (userId) => {
    if (multiple) {
      const isSelected = (value || []).includes(userId);
      if (isSelected) {
        onChange((value || []).filter(id => id !== userId));
      } else {
        onChange([...(value || []), userId]);
      }
    } else {
      onChange(userId);
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const removeUser = (userId, e) => {
    e.stopPropagation();
    if (multiple) {
      onChange((value || []).filter(id => id !== userId));
    } else {
      onChange('');
    }
  };

  const getSelectedUsers = () => {
    if (multiple) {
      return users.filter(user => user && (value || []).includes(user._id));
    }
    return users.find(user => user && user._id === value) || null;
  };

  const getSelectedCount = () => {
    if (multiple) {
      return (value || []).length;
    }
    return value ? 1 : 0;
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setSearchTerm(''); // Reset search when opening/closing
    
    // Focus on search input when dropdown opens
    if (!isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
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
            focus:ring-[#01a370] focus:border-[#01a370] px-3 py-2 text-sm cursor-pointer
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
          
          {multiple ? (
            <>
              {getSelectedCount() === 0 ? (
                <span className="text-gray-400 pl-5">Select team members...</span>
              ) : (
                getSelectedUsers().map(user => (
                  user && (
                    <div
                      key={user._id}
                      className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <UserAvatar user={user} size="small" />
                      <span className="ml-2">{user.name}</span>
                      <button
                        type="button"
                        className="ml-2 text-gray-500 hover:text-gray-700"
                        onClick={(e) => removeUser(user._id, e)}
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
              {getSelectedUsers() ? (
                <div className="flex items-center pl-5">
                  <UserAvatar user={getSelectedUsers()} size="small" />
                  <span className="ml-2">{getSelectedUsers().name}</span>
                  <button
                    type="button"
                    className="ml-2 text-gray-500 hover:text-gray-700"
                    onClick={(e) => removeUser(getSelectedUsers()._id, e)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <span className="text-gray-400 pl-5">Select a user...</span>
              )}
            </>
          )}
          
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto">
            <div className="p-2 border-b border-gray-200" onClick={(e) => e.stopPropagation()}>
              <Input
                ref={inputRef}
                icon={Search}
                placeholder="Search users..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="mb-0"
              />
            </div>
            
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading users...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No users found</div>
            ) : (
              <ul className="py-1">
                {filteredUsers.map((user) => {
                  if (!user) return null;
                  
                  const isSelected = multiple 
                    ? (value || []).includes(user._id)
                    : value === user._id;
                  
                  return (
                    <li
                      key={user._id}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between ${
                        isSelected ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => handleSelectUser(user._id)}
                    >
                      <div className="flex items-center">
                        <UserAvatar user={user} size="small" />
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
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

export default UserSelect;