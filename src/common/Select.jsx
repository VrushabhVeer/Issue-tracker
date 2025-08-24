// components/common/Select.jsx
import React from 'react';

const Select = ({
  label,
  error,
  helperText,
  options = [],
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
      <select
        className={`
          block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-[#01a370] focus:border-[#01a370]
          ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
          sm:text-sm
          ${className}
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {(error || helperText) && (
        <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default Select;