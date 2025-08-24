// components/common/UserAvatar.jsx
import React from 'react';

const UserAvatar = ({ 
  user, 
  size = 'medium',
  showName = false,
  className = '' 
}) => {
  const sizes = {
    small: 'h-6 w-6 text-xs',
    medium: 'h-8 w-8 text-sm',
    large: 'h-12 w-12 text-base'
  };

  if (user?.avatar) {
    return (
      <div className={`flex items-center ${className}`}>
        <img
          className={`rounded-full ${sizes[size]}`}
          src={user.avatar}
          alt={user.name}
        />
        {showName && <span className="ml-2 text-gray-900">{user.name}</span>}
      </div>
    );
  }

  return (
    <div className={`flex items-center ${className}`}>
      <div className={`rounded-full bg-[#01a370] flex items-center justify-center text-white font-medium ${sizes[size]}`}>
        {user?.name?.charAt(0) || 'U'}
      </div>
      {showName && <span className="ml-2 text-gray-900">{user?.name || 'Unknown'}</span>}
    </div>
  );
};

export default UserAvatar;