import React from 'react';
import BadgeStock from '../atoms/BadgeStock';

// Molécula: Agrupa datos de un repuesto en una fila de lista
export default function FilaRepuesto({ repuesto }) {
  const isBajoStock = repuesto.stock_actual <= repuesto.stock_minimo;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 16px',
      backgroundColor: isBajoStock ? '#fff9f9' : 'white',
      borderRadius: '14px',
      marginBottom: '10px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      border: isBajoStock ? '1px solid #ffcccc' : '1px solid transparent'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '16px', fontWeight: '600', color: isBajoStock ? '#cc0000' : '#1d1d1f' }}>
          {repuesto.nombre}
        </span>
        <span style={{ fontSize: '13px', color: '#86868b' }}>
          Cantidad Existente: <strong style={{ color: isBajoStock ? '#cc0000' : '#107c41' }}>{repuesto.stock_actual}</strong>
          {' '}| Mínimo esperado: {repuesto.stock_minimo}
        </span>
      </div>
      <div>
        <BadgeStock actual={repuesto.stock_actual} minimo={repuesto.stock_minimo} />
      </div>
    </div>
  );
}