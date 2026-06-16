import React from 'react';
import FormularioRepuesto from '../molecules/FormularioRepuesto';
import FilaRepuesto from '../molecules/FilaRepuesto';

// Organismo: Gestor de inventario completo, agrupa formulario y lista
export default function ModuloRepuestos({ repuestos, onAgregarRepuesto }) {
  return (
    <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
      <h2 style={{ marginBottom: '6px', color: '#1d1d1f' }}>Stock de Repuestos</h2>
      <p style={{ fontSize: '14px', color: '#86868b', margin: '0 0 20px 0' }}>
        Inventario de bodega. Si la cantidad de un artículo es igual o menor a su mínimo requerido, se marcará en rojo con una alerta.
      </p>

      {/* Formulario (Molécula) */}
      <FormularioRepuesto onAgregar={onAgregarRepuesto} />

      {/* Lista de Repuestos (Conjunto de Moléculas FilaRepuesto) */}
      <h4 style={{ margin: '0 0 10px 0', color: '#1d1d1f', fontSize: '15px' }}>Inventario Actual</h4>
      <div>
        {repuestos.length === 0 ? (
          <p style={{ color: '#86868b', fontSize: '14px', textAlign: 'center', marginTop: '30px' }}>
            No hay repuestos registrados en el inventario. Añada el primero arriba.
          </p>
        ) : (
          repuestos.map(repuesto => (
            <FilaRepuesto key={repuesto.id} repuesto={repuesto} />
          ))
        )}
      </div>
    </div>
  );
}