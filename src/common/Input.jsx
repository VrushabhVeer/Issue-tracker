// components/common/Input.jsx
import React from 'react';

const Input = ({
  label,
  error,
  helperText,
  icon: Icon,
  className = '',
  containerClassName = '',
  ...props
}) => {
  return (
    <div className={containerClassName}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          className={`
            block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#01a370] focus:border-[#01a370]
            ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
            ${Icon ? 'pl-10' : 'pl-3'}
            pr-3 py-2 text-sm
            ${className}
          `}
          {...props}
        />
      </div>
      {(error || helperText) && (
        <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default Input;