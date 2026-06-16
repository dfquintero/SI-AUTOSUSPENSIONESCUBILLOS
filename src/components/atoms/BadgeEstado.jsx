import React from 'react';

export default function BadgeEstado({ estado }) {
  const esDisponible = estado === 'Disponible';
  
  return (
    <span style={{
      fontSize: '13px',
      fontWeight: '600',
      padding: '4px 10px',
      borderRadius: '20px',
      backgroundColor: esDisponible ? '#e4f9ec' : '#ffeccc',
      color: esDisponible ? '#107c41' : '#b25e00',
      display: 'inline-block'
    }}>
      {estado}
    </span>
  );
}