import React from 'react';

// Molécula: Representa el registro de un trabajo en el historial
export default function FilaTrabajo({ trabajo }) {
  return (
    <div style={{ 
      padding: '12px 16px', 
      backgroundColor: '#f5f5f7', 
      borderRadius: '8px', 
      marginBottom: '10px',
      border: '1px solid #e5e5ea'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#86868b', marginBottom: '8px' }}>
        <span>📅 {trabajo.fecha_inicio}</span>
        <span>👨‍🔧 Mecánico: <strong>{trabajo.mecanico.nombre}</strong></span>
      </div>
      <p style={{ margin: '0', fontSize: '14px', color: '#1d1d1f' }}>
        {trabajo.descripcion}
      </p>
    </div>
  );
}