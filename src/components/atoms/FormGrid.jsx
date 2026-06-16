import React from 'react';

export default function FormGrid({ children, columns = 2 }) {
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: `repeat(${columns}, 1fr)`, 
      gap: '18px' 
    }}>
      {children}
    </div>
  );
}
