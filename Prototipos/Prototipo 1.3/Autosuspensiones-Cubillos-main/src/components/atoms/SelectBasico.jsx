import React from 'react';

// Átomo: Selector desplegable (Dropdown) estandarizado
export default function SelectBasico({ value, onChange, options, placeholder, required }) {
  return (
    <select
      value={value}
      onChange={onChange}
      required={required}
      style={{
        padding: '10px 14px',
        borderRadius: '8px',
        border: '1px solid #d2d2d7',
        fontSize: '14px',
        outline: 'none',
        width: '100%',
        backgroundColor: '#ffffff',
        boxSizing: 'border-box'
      }}
    >
      <option value="" disabled>{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}