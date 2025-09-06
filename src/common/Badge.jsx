// components/common/Badge.jsx
import React from 'react';

const Badge = ({ 
  children, 
  variant = 'default',
  size = 'medium',
  className = '' 
}) => {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    // primary: 'bg-[#01a370] text-white',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    primary: 'bg-blue-100 text-blue-800',
    info:'bg-purple-100 text-purple-800'
  };
  const sizes = {
    small: 'text-xs px-2 py-0.5',
    medium: 'text-sm px-2.5 py-0.5',
    large: 'text-base px-3 py-1'
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <span className={classes}>
      {children}
    </span>
  );
};

export default Badge;