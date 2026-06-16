import React from 'react';

// Átomo: Etiqueta de estado para stock, color condicional basado en cantidad vs mínimo
export default function BadgeStock({ actual, minimo }) {
  const tieneBajoStock = actual <= minimo;
  
  return (
    <span style={{
      fontSize: '13px',
      fontWeight: '600',
      padding: '4px 10px',
      borderRadius: '20px',
      backgroundColor: tieneBajoStock ? '#ffecec' : '#e4f9ec',
      color: tieneBajoStock ? '#cc0000' : '#107c41',
      display: 'inline-block'
    }}>
      {tieneBajoStock ? 'Bajo Stock' : 'Stock Óptimo'}
    </span>
  );
}