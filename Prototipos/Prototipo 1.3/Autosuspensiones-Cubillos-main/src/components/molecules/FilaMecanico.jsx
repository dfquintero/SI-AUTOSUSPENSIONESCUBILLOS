import React from 'react';

// Molécula: Representa gráficamente a un Mecánico en la lista de gestión
export default function FilaMecanico({ mecanico }) {
  const isActivo = mecanico.activo;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 16px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e5e5ea'
    }}>
    <div style={{ textAlign: 'left' }}>
        <strong style={{ fontSize: '15px', color: '#1d1d1f', display: 'block' }}>
          {mecanico.nombre} <span style={{ fontSize: '12px', color: '#007aff', fontWeight: 'bold' }}>({mecanico.codigo})</span>
        </strong>
        <span style={{ fontSize: '13px', color: '#86868b' }}>
          📞 {mecanico.telefono} | 🔧 {mecanico.especialidad}
        </span>
      </div>
      <div>
        <span style={{
          fontSize: '12px',
          fontWeight: '600',
          padding: '4px 8px',
          borderRadius: '12px',
          backgroundColor: isActivo ? '#e4f9ec' : '#ffecec',
          color: isActivo ? '#107c41' : '#cc0000'
        }}>
          {isActivo ? 'Activo' : 'Inactivo'}
        </span>
      </div>
    </div>
  );
}