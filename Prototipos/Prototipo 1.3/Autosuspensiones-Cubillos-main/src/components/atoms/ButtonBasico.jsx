import React from 'react';

// Átomo: Botón estandarizado
export default function ButtonBasico({ text, type = "button", onClick }) {
  return (
    <button 
      type={type}
      onClick={onClick}
      style={{
        padding: '10px 16px',
        backgroundColor: '#007aff',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        width: '100%',
        marginTop: '10px'
      }}
    >
      {text}
    </button>
  );
}