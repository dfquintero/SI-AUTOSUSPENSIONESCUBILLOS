import React from 'react';

// Átomo: Muestra un par de clave y valor estilizado (ej: "Propietario: Juan")
export default function ItemDato({ etiqueta, valor, colorValor = '#1d1d1f' }) {
  return (
    <p style={{ margin: '4px 0', fontSize: '14px', color: '#1d1d1f' }}>
      <strong>{etiqueta}:</strong> <span style={{ color: colorValor }}>{valor}</span>
    </p>
  );
}