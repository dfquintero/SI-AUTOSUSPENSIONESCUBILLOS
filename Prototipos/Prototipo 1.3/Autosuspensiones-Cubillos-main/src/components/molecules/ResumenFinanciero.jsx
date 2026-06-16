import React from 'react';

// Molécula: Muestra un resumen de ingresos, egresos y balance total
export default function ResumenFinanciero({ ingresos, egresos }) {
  const balance = ingresos - egresos;

  const cardStyle = {
    flex: '1',
    padding: '16px',
    backgroundColor: '#f5f5f7',
    borderRadius: '12px',
    textAlign: 'center'
  };

  return (
    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
      <div style={cardStyle}>
        <span style={{ fontSize: '13px', color: '#86868b', display: 'block' }}>Ingresos</span>
        <strong style={{ fontSize: '18px', color: '#107c41' }}>${ingresos.toLocaleString()}</strong>
      </div>
      <div style={cardStyle}>
        <span style={{ fontSize: '13px', color: '#86868b', display: 'block' }}>Egresos</span>
        <strong style={{ fontSize: '18px', color: '#cc0000' }}>${egresos.toLocaleString()}</strong>
      </div>
      <div style={{...cardStyle, backgroundColor: '#e4f0ff'}}>
        <span style={{ fontSize: '13px', color: '#0054b3', display: 'block' }}>Balance</span>
        <strong style={{ fontSize: '18px', color: '#007aff' }}>${balance.toLocaleString()}</strong>
      </div>
    </div>
  );
}