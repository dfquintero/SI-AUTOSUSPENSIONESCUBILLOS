import React from 'react';
import MenuList from '../molecules/MenuList';

// Organismo: Barra lateral completa para la Tablet Titan (Consumo mínimo de recursos)
export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside
      style={{
        width: '260px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #e5e5ea',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        boxSizing: 'border-box',
      }}
    >
      {/* Encabezado del taller */}
      <div style={{ marginBottom: '10px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1d1d1f', margin: 0 }}>
          Autosuspensiones
        </h2>
        <span style={{ fontSize: '14px', color: '#86868b' }}>Cubillos - Sistema v2.0</span>
      </div>
      
      <hr style={{ border: '0', borderTop: '1px solid #e5e5ea', width: '100%' }} />

      {/* Llamamos a nuestra molécula de menú */}
      <MenuList activeTab={activeTab} setActiveTab={setActiveTab} />
    </aside>
  );
}
