import React from 'react';

export default function FilterBar({ filters, onFilterChange, onClear, children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
      {children}
      <button className="button button-secondary button-small" onClick={onClear} style={{ width: '100%' }}>
        Limpiar
      </button>
    </div>
  );
}
