import React from 'react';
import ResumenFinanciero from '../molecules/ResumenFinanciero';
import FilaTransaccion from '../molecules/FilaTransaccion';
import FormularioTransaccion from '../molecules/FormularioTransaccion';

// Organismo: Módulo completo de contabilidad
export default function ModuloContabilidad({ pagos, gastos, onAgregarTransaccion }) {
  // Unificar las transacciones para mostrarlas en una sola lista cronológica
  const transacciones = [
    ...pagos.map(p => ({
      id: p.id,
      tipo: 'ingreso',
      monto: p.monto,
      descripcion: p.notas || 'Pago de trabajo realizado',
      fecha: p.fecha
    })),
    ...gastos.map(g => ({
      id: g.id,
      tipo: 'egreso',
      monto: g.monto,
      descripcion: g.descripcion,
      fecha: g.fecha
    }))
  ];

  // Ordenar de la más reciente a la más antigua (simulado como string)
  transacciones.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  const totalIngresos = pagos.reduce((acc, p) => acc + parseFloat(p.monto), 0);
  const totalEgresos = gastos.reduce((acc, g) => acc + parseFloat(g.monto), 0);

  return (
    <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
      <h2 style={{ marginBottom: '6px', color: '#1d1d1f' }}>Contabilidad</h2>
      <p style={{ fontSize: '14px', color: '#86868b', margin: '0 0 20px 0' }}>
        Resumen financiero de los ingresos (pagos) y egresos (gastos) del taller.
      </p>

      <ResumenFinanciero ingresos={totalIngresos} egresos={totalEgresos} />

      <FormularioTransaccion onAgregar={onAgregarTransaccion} />

      <h4 style={{ margin: '0 0 10px 0', color: '#1d1d1f', fontSize: '15px' }}>Historial de Transacciones</h4>
      <div style={{ 
        backgroundColor: '#ffffff', 
        borderRadius: '12px', 
        border: '1px solid #e5e5ea',
        overflow: 'hidden'
      }}>
        {transacciones.length === 0 ? (
          <p style={{ padding: '20px', textAlign: 'center', color: '#86868b', margin: 0, fontSize: '14px' }}>
            No hay transacciones registradas.
          </p>
        ) : (
          transacciones.map(t => (
            <FilaTransaccion key={`${t.tipo}-${t.id}`} transaccion={t} />
          ))
        )}
      </div>
    </div>
  );
}