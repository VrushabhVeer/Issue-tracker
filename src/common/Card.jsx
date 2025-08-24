// components/common/Card.jsx
import React from 'react';

const Card = ({ 
  children, 
  title,
  actions,
  className = '',
  bodyClassName = '' 
}) => {
  return (
    <div className={`bg-white shadow rounded-lg overflow-hidden ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">{title}</h2>
          {actions && <div className="flex space-x-2">{actions}</div>}
        </div>
      )}
      <div className={bodyClassName || 'px-6 py-4'}>
        {children}
      </div>
    </div>
  );
};

export default Card;