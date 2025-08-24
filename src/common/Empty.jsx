// components/common/EmptyState.jsx
import React from 'react';

const EmptyState = ({ 
  icon: Icon,
  title,
  description,
  action,
  className = '' 
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      {Icon && <Icon className="mx-auto h-12 w-12 text-gray-400 mb-4" />}
      {title && <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>}
      {description && <p className="text-gray-500 mb-6">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;