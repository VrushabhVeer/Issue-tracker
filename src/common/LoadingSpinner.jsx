// components/common/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ 
  size = 'medium',
  className = '' 
}) => {
  const sizes = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  return (
    <div className={`animate-spin rounded-full border-b-2 border-[#01a370] ${sizes[size]} ${className}`}></div>
  );
};

export default LoadingSpinner;