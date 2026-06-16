import React from 'react';

const CATEGORIAS_REPUESTOS = ['Suspensión', 'Filtros', 'Frenos', 'Motor', 'Transmisión', 'Eléctrico', 'Carrocería', 'Otros'];

export default function AdminRepuestosSection({ repuestos, onAddRepuesto, onEditRepuesto, onDeleteRepuesto }) {
  return (
    <>
      <div className="section-header">
        <h2>Repuestos</h2>
        <button className="button button-primary" onClick={onAddRepuesto}>
          Nuevo repuesto
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {CATEGORIAS_REPUESTOS.map((categoria) => {
          const categoriaRepuestos = repuestos.filter(r => r.categoria === categoria);
          if (categoriaRepuestos.length === 0) return null;
          return (
            <div key={categoria}>
              <h3 style={{ margin: '0 0 16px 0', color: '#1d1d1f', fontSize: '1.2rem' }}>{categoria}</h3>
              <div className="tool-grid">
                {categoriaRepuestos.map((repuesto) => (
                  <div key={repuesto.id} className="tool-card">
                    {repuesto.imagen && (
                      <div className="tool-image">
                        <img src={repuesto.imagen} alt={repuesto.nombre} />
                      </div>
                    )}
                    <div className="tool-info">
                      <strong>{repuesto.nombre}</strong>
                      <div className="tool-meta">Cantidad: {repuesto.cantidad}</div>
                      <div className="tool-meta">Precio: ${repuesto.precio.toLocaleString('es-AR')}</div>
                      {repuesto.descripcion && <div className="tool-desc">{repuesto.descripcion}</div>}
                    </div>
                    <div className="tool-actions">
                      <button className="button button-secondary button-small" onClick={() => onEditRepuesto(repuesto)}>
                        Editar
                      </button>
                      <button className="button button-danger button-small" onClick={() => onDeleteRepuesto(repuesto.id)}>
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
