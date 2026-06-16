import React from 'react';

// Átomo: Tarjeta-botón grande central, fácil de presionar en entornos de trabajo
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
        backgroundColor: '#ffffff',
        border: '1px solid #e5e5ea',
        borderRadius: '16px',
        cursor: 'pointer',
        boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
        transition: 'transform 0.1s, box-shadow 0.2s',
        width: '100%',
        boxSizing: 'border-box',
        outline: 'none'
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
      onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      {/* Círculo contenedor del icono para evitar fatiga visual */}
      <div style={{
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: color + '15', // Color con opacidad del 15%
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '28px',
        marginBottom: '16px'
      }}>
        {icon}
      </div>
      
      <span style={{ 
        fontSize: '16px', 
        fontWeight: '600', 
        color: '#1d1d1f',
        textAlign: 'center'
      }}>
        {label}
      </span>
    </button>
  );
}

