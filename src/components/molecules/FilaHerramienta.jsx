import React from 'react';
import BadgeEstado from '../atoms/BadgeEstado';

export default function FilaHerramienta({ herramienta, onAccion }) {
  const esDisponible = herramienta.estado === 'Disponible';

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 16px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e5e5ea',
      gap: '12px'
    }}>
      <div style={{ textAlign: 'left' }}>
        <strong style={{ fontSize: '16px', color: '#1d1d1f', display: 'block' }}>
          {herramienta.nombre}
        </strong>
        <span style={{ fontSize: '13px', color: '#86868b' }}>
          {esDisponible ? '📍 En estante' : 👨‍🔧 En uso por: }
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <BadgeEstado estado={herramienta.estado} />
        
        <button
          onClick={() => onAccion(herramienta.id)}
          style={{
            padding: '8px 14px',
            backgroundColor: esDisponible ? '#007aff' : '#ff3b30',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          {esDisponible ? 'Prestar' : 'Devolver'}
        </button>
      </div>
    </div>
  );
}