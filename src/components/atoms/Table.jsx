import React from 'react';

export default function Table({ 
  headers, 
  data, 
  renderRow, 
  emptyMessage = 'No hay datos disponibles',
  className = '',
  rowClassName = () => ''
}) {
  return (
    <div className={`table-scroll ${className}`}>
      <table>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index} className={rowClassName(item, index)}>
                {renderRow(item, index)}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length} style={{ textAlign: 'center', padding: '40px' }}>
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
