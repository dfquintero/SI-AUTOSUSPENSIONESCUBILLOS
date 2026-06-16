import React from 'react';

export default function Input({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  className = 'filter-search', 
  style = {},
  ...props 
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      style={{ width: '100%', ...style }}
      {...props}
    />
  );
}
