import React from 'react';

// Átomo: Etiqueta de estado de color condicional
export default function BadgeEstado({ enUso }) {
  return (
    <span style={{
      fontSize: '13px',
      fontWeight: '600',
      padding: '4px 10px',
      borderRadius: '20px',
      backgroundColor: !enUso ? '#e4f9ec' : '#ffeccc',
      color: !enUso ? '#107c41' : '#b25e00',
      display: 'inline-block'
    }}>
      {!enUso ? 'Disponible' : 'En Uso'}
    </span>
  );
}