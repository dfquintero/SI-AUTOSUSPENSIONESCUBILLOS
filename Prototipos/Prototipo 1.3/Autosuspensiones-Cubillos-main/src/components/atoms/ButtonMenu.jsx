import React from 'react';

// Átomo: Botón estilizado y plano para evitar fatiga visual (Reporte RITE)
export default function ButtonMenu({ label, icon, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        padding: '14px 20px',
        margin: '6px 0',
        backgroundColor: isActive ? '#007aff' : 'transparent',
        color: isActive ? '#ffffff' : '#333333',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: isActive ? '600' : '400',
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'background-color 0.2s, color 0.2s',
      }}
    >
      <span style={{ marginRight: '12px', fontSize: '18px' }}>{icon}</span>
      {label}
    </button>
  );
}
