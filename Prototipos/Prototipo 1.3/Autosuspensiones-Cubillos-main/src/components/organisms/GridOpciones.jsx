import React from 'react';
import CardBoton from '../atoms/CardBoton';

// Organismo: Cuadrícula central con las opciones del MVP
export default function GridOpciones({ onSeleccionar }) {
  const modulos = [
    { id: 'administrador', label: 'Administrador', icon: '👤', color: '#007aff' },
    { id: 'historico', label: 'Histórico de Placas', icon: '🚖', color: '#ffcc00' },
    { id: 'herramientas', label: 'Control Herramientas', icon: '🔧', color: '#4cd964' },
    { id: 'repuestos', label: 'Stock Repuestos', icon: '📦', color: '#ff9500' },
    { id: 'contabilidad', label: 'Contabilidad', icon: '💰', color: '#5856d6' },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '20px',
      width: '100%',
      maxWidth: '900px',
      margin: '0 auto',
      padding: '10px'
    }}>
      {modulos.map((mod) => (
        <CardBoton
          key={mod.id}
          label={mod.label}
          icon={mod.icon}
          color={mod.color}
          onClick={() => onSeleccionar(mod.id)}
        />
      ))}
    </div>
  );
}
