import React from 'react';
import BadgeEstado from '../atoms/BadgeEstado';

// Molécula: Línea interactiva con los datos de una herramienta
export default function FilaHerramienta({ herramienta, onAccion }) {
  const isDisponible = !herramienta.en_uso;

  // Formateo de fecha simple
  const formatearFecha = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' (' + date.toLocaleDateString() + ')';
  };

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
          {isDisponible 
            ? ' En estante' 
            : ` En uso por: ${herramienta.mecanico_nombre} (${herramienta.mecanico_codigo}) | ⏱ Desde: ${formatearFecha(herramienta.actualizado_en)}`
          }
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <BadgeEstado enUso={herramienta.en_uso} />
        
        <button
          onClick={() => onAccion(herramienta.id)}
          style={{
            padding: '8px 14px',
            backgroundColor: isDisponible ? '#007aff' : '#ff3b30',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            minWidth: '90px'
          }}
        >
          {isDisponible ? 'Prestar' : 'Devolver'}
        </button>
      </div>
    </div>
  );
}