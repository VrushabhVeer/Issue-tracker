// components/common/TextArea.jsx
import React from 'react';

const TextArea = ({
  label,
  error,
  helperText,
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
      <textarea
        className={`
          block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#01a370] focus:border-[#01a370]
          ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
          px-3 py-2 text-sm
          ${className}
        `}
        {...props}
      />
      {(error || helperText) && (
        <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default TextArea;