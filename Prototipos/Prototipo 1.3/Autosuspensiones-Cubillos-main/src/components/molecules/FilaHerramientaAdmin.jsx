import React from 'react';

// Molécula: Representa gráficamente una Herramienta en la lista de gestión
export default function FilaHerramientaAdmin({ herramienta }) {
  const isDisponible = !herramienta.en_uso;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 16px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e5e5ea'
    }}>
      <div style={{ textAlign: 'left' }}>
        <strong style={{ fontSize: '15px', color: '#1d1d1f', display: 'block' }}>
          {herramienta.nombre}
        </strong>
        <span style={{ fontSize: '13px', color: '#86868b' }}>
          {isDisponible 
            ? '📦 En estante' 
            : `👨‍🔧 En uso por: ${herramienta.mecanico_nombre} (${herramienta.mecanico_codigo})`
          }
        </span>
      </div>
      <div>
        <span style={{
          fontSize: '12px',
          fontWeight: '600',
          padding: '4px 8px',
          borderRadius: '12px',
          backgroundColor: isDisponible ? '#e4f9ec' : '#fff3cd',
          color: isDisponible ? '#107c41' : '#856404'
        }}>
          {isDisponible ? 'Disponible' : 'En uso'}
        </span>
      </div>
    </div>
  );
}
