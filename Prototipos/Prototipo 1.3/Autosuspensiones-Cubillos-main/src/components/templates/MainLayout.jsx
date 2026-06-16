import React from 'react';
import Sidebar from '../organisms/Sidebar';

// Plantilla: Distribución espacial para pantallas de Tablet de 7 pulgadas (1024x600)
export default function MainLayout({ children, activeTab, setActiveTab }) {
  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', backgroundColor: '#f5f5f7', overflow: 'hidden' }}>
      {/* Componente fijo de navegación */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Área cambiante donde se renderizará el módulo seleccionado */}
      <main style={{ flex: 1, padding: '24px', overflowY: 'auto', boxSizing: 'border-box' }}>
        {children}
      </main>
    </div>
  );
}
