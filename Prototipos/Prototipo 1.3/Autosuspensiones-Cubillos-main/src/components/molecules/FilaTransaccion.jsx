import React from 'react';
import BadgeMonto from '../atoms/BadgeMonto';

// Molécula: Muestra una transacción individual (Pago o Gasto)
export default function FilaTransaccion({ transaccion }) {
  const esIngreso = transaccion.tipo === 'ingreso';

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
        <strong style={{ fontSize: '15px', color: '#1d1d1f', display: 'block' }}>
          {transaccion.descripcion}
        </strong>
        <span style={{ fontSize: '13px', color: '#86868b' }}>
          {esIngreso ? '💰 Pago recibido' : '🛒 Gasto'} | 📅 {transaccion.fecha}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <BadgeMonto monto={transaccion.monto} tipo={transaccion.tipo} />
      </div>
    </div>
  );
}