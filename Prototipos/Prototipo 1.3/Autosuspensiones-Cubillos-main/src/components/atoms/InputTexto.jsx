import React from 'react';

// Átomo: Campo de texto estandarizado para formularios
export default function InputTexto({ type = "text", placeholder, value, onChange, required, min }) {
  return (
    <input 
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      min={min}
      style={{
        padding: '10px 14px',
        borderRadius: '8px',
        border: '1px solid #d2d2d7',
        fontSize: '14px',
        outline: 'none',
        width: '100%',
        boxSizing: 'border-box'
      }}
    />
  );
}