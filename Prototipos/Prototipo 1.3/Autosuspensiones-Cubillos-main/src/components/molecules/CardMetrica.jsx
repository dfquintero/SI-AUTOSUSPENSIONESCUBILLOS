import React from 'react';

// Molécula: Muestra una métrica general para el panel de administración
export default function CardMetrica({ titulo, valor, color = '#007aff' }) {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #e5e5ea',
      borderRadius: '12px',
      padding: '16px',
      flex: '1',
      textAlign: 'center',
      minWidth: '110px'
    }}>
      <span style={{ display: 'block', fontSize: '13px', color: '#86868b', marginBottom: '8px', fontWeight: '500' }}>
        {titulo}
      </span>
      <strong style={{ fontSize: '24px', color: color }}>
        {valor}
      </strong>
    </div>
  );
}