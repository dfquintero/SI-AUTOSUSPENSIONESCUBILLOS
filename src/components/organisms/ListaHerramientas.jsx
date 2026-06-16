import React from 'react';
import FilaHerramienta from '../molecules/FilaHerramienta';

// Organismo: Contenedor completo del inventario de herramientas operativas
export default function ListaHerramientas({ herramientas, onAccionHerramienta }) {
  const prestadas = herramientas.filter(h => h.estado !== 'Disponible').length;

  return (
    <div style={{ 
      backgroundColor: '#ffffff', 
      borderRadius: '12px', 
      border: '1px solid #e5e5ea',
      overflow: 'hidden'
    }}>
      {/* Barra de estado interna */}
      <div style={{ 
        padding: '12px 16px', 
        backgroundColor: '#f5f5f7', 
        borderBottom: '1px solid #e5e5ea',
        textAlign: 'left',
        fontSize: '14px',
        color: '#86868b'
      }}>
        🛠️ Total: <strong>{herramientas.length}</strong> herramientas | ⚠️ En préstamo: <strong style={{ color: '#ff9500' }}>{prestadas}</strong>
      </div>

      {/* Mapeo modular de herramientas */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {herramientas.map((herramienta) => (
          <FilaHerramienta 
            key={herramienta.id} 
            herramienta={herramienta} 
            onAccion={onAccionHerramienta} 
          />
        ))}
      </div>
    </div>
  );
}
