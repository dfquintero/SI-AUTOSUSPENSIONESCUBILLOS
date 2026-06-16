import React from 'react';

export default function CardHistorial({ vehiculo }) {
  if (!vehiculo) {
    return (
      <div style={{ padding: '30px', textAlign: 'center', color: '#86868b', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e5ea' }}>
        🔍 Ingrese una placa registrada para ver su historial en el taller.
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #e5e5ea', textAlign: 'left' }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#1d1d1f' }}>
        Vehículo: <span style={{ color: '#007aff' }}>{vehiculo.placa}</span>
      </h3>
      <p style={{ margin: '4px 0' }}><strong>Propietario:</strong> {vehiculo.conductor}</p>
      <p style={{ margin: '4px 0', color: '#86868b' }}><strong>Modelo:</strong> {vehiculo.modelo}</p>
      
      <h4 style={{ marginTop: '20px', marginBottom: '10px' }}>Historial Clínico:</h4>
      {vehiculo.reparaciones.map((rep, index) => (
        <div key={index} style={{ padding: '12px', backgroundColor: '#f5f5f7', borderRadius: '8px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#86868b' }}>
            <span>📅 {rep.fecha}</span>
            <span>👨‍🔧 Mecánico: {rep.mecanico}</span>
          </div>
          <p style={{ margin: '6px 0 0 0', fontSize: '14px' }}><strong>Trabajo:</strong> {rep.detalle}</p>
        </div>
      ))}
    </div>
  );
}