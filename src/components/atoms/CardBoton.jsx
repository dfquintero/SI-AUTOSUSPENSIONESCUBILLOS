import React from 'react';

export default function CardBoton({ label, icon, color, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px 20px',
        backgroundColor: color,
        border: 'none',
        borderRadius: '16px',
        cursor: 'pointer',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        transition: 'transform 0.1s, box-shadow 0.2s',
        width: '100%',
        boxSizing: 'border-box',
        outline: 'none'
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
      onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px',
        color: 'white'
      }}>
        {icon}
      </div>
      
      <span style={{ 
        fontSize: '16px', 
        fontWeight: '600', 
        color: 'white',
        textAlign: 'center'
      }}>
        {label}
      </span>
    </button>
  );
}