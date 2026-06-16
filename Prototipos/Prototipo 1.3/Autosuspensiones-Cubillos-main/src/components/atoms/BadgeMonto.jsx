import React from 'react';

// Átomo: Muestra un monto con color dependiendo de si es ingreso o egreso
export default function BadgeMonto({ monto, tipo }) {
  const esIngreso = tipo === 'ingreso';
  
  return (
    <span style={{
      fontSize: '14px',
      fontWeight: '600',
      padding: '4px 10px',
      borderRadius: '8px',
      backgroundColor: esIngreso ? '#e4f9ec' : '#ffecec',
      color: esIngreso ? '#107c41' : '#cc0000',
      display: 'inline-block'
    }}>
      {esIngreso ? '+' : '-'}${monto.toLocaleString()}
    </span>
  );
}