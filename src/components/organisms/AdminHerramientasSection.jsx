import React from 'react';

const CATEGORIAS_HERRAMIENTAS = ['Manuales', 'Eléctricas', 'Neumáticas', 'Equipos', 'Medición', 'Corte', 'Otras'];

export default function AdminHerramientasSection({ herramientas, onAddHerramienta, onEditHerramienta }) {
  return (
    <>
      <div className="section-header">
        <h2>Herramientas</h2>
        <button className="button button-primary" onClick={onAddHerramienta}>
          Nueva herramienta
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {CATEGORIAS_HERRAMIENTAS.map((categoria) => {
          const categoriaHerramientas = herramientas.filter(h => h.categoria === categoria);
          if (categoriaHerramientas.length === 0) return null;
          return (
            <div key={categoria}>
              <h3 style={{ margin: '0 0 16px 0', color: '#1d1d1f', fontSize: '1.2rem' }}>{categoria}</h3>
              <div className="tool-grid">
                {categoriaHerramientas.map((tool) => (
                  <div key={tool.id} className="tool-card">
                    {tool.imagen && (
                      <div className="tool-image">
                        <img src={tool.imagen} alt={tool.nombre} />
                      </div>
                    )}
                    <div className="tool-info">
                      <strong>{tool.nombre}</strong>
                      <div className="tool-meta">Cantidad: {tool.cantidad}</div>
                      {tool.descripcion && <div className="tool-desc">{tool.descripcion}</div>}
                    </div>
                    <div className="tool-actions">
                      <button className="button button-secondary button-small" onClick={() => onEditHerramienta(tool)}>
                        Editar
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
