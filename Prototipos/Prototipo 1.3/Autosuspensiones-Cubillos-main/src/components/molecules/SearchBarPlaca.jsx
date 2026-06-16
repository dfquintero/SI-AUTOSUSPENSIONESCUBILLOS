import React from 'react';

// Molécula: Entrada de texto simple para filtrar las placas del taller
export default function SearchBarPlaca({ filtro, setFiltro, placasExistentes, onSeleccionarPlaca }) {
  // Mostrar todas las placas si el filtro está vacío, sino filtrar según lo que escribe
  const sugerencias = filtro === '' 
    ? placasExistentes 
    : placasExistentes.filter(placa => 
        placa.toLowerCase().includes(filtro.toLowerCase())
      );

  return (
    <div style={{ width: '100%', marginBottom: '20px', textAlign: 'left' }}>
      <label style={{ fontSize: '14px', color: '#86868b', display: 'block', marginBottom: '6px' }}>
        Buscar vehículo por placa (Colombia):
      </label>
      <input
        type="text"
        placeholder="Ej: TXA-123"
        maxLength={7}
        value={filtro}
        onChange={(e) => setFiltro(e.target.value.toUpperCase())}
        style={{
          padding: '14px',
          fontSize: '16px',
          borderRadius: '8px',
          border: '1px solid #e5e5ea',
          width: '100%',
          boxSizing: 'border-box',
          outline: 'none'
        }}
      />
      
      {sugerencias.length > 0 && (
        <ul style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e5e5ea',
          borderRadius: '8px',
          padding: 0,
          margin: '4px 0 0 0',
          listStyle: 'none'
        }}>
          {sugerencias.map((placa) => (
            <li 
              key={placa}
              onClick={() => onSeleccionarPlaca(placa)}
              style={{ padding: '12px 14px', cursor: 'pointer', borderBottom: '1px solid #f5f5f7' }}
            >
              Placa: <strong style={{ color: '#007aff' }}>{placa}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
