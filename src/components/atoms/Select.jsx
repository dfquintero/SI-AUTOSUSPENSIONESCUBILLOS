import React from 'react';

export default function Select({ 
  options, 
  value, 
  onChange, 
  placeholder = 'Seleccione...', 
  className = 'filter-select', 
  style = {},
  ...props 
}) {
  return (
    <select
      value={value}
      onChange={onChange}
      className={className}
      style={{ width: '100%', ...style }}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option, index) => (
        <option key={option.value || option.id || index} value={option.value || option.id || option}>
          {option.label || option}
        </option>
      ))}
    </select>
  );
}
