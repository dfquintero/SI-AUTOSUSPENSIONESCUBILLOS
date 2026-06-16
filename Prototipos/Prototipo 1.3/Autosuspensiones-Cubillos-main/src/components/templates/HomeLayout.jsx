import React from 'react';

// Template: Diseño limpio y centrado para el flujo de inicio
export default function HomeLayout({ children, mostrarBotonVolver, onVolver }) {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f7', 
      padding: '30px 20px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Encabezado del taller */}
      <header style={{ 
        maxWidth: '900px', 
        width: '100%', 
        margin: '0 auto 40px auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1d1d1f', margin: 0 }}>
            Autosuspensiones Cubillos
          </h1>
          <p style={{ fontSize: '14px', color: '#86868b', margin: '4px 0 0 0' }}>
            Sistema de Gestión Operativa Local
          </p>
        </div>

        {/* Botón de regreso condicional si estamos dentro de un módulo */}
        {mostrarBotonVolver && (
          <button 
            onClick={onVolver}
            style={{
              padding: '10px 16px',
              backgroundColor: '#1d1d1f',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '14px'
            }}
          >
            ⬅ Volver al Inicio
          </button>
        )}
      </header>

      {/* Contenido Central */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        {children}
      </div>
    </div>
  );
}

