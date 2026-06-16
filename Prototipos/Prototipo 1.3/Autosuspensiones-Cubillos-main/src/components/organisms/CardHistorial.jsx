import React from 'react';
import ItemDato from '../atoms/ItemDato';
import FilaTrabajo from '../molecules/FilaTrabajo';

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
      <h3 style={{ margin: '0 0 16px 0', color: '#1d1d1f', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' }}>
        Vehículo: <span style={{ color: '#007aff' }}>{vehiculo.placa}</span>
      </h3>
      
      <div style={{ marginBottom: '20px' }}>
        <ItemDato etiqueta="Propietario" valor={vehiculo.propietario?.nombre || 'No asignado'} />
        <ItemDato etiqueta="Vehículo" valor={vehiculo.marca + ' ' + vehiculo.modelo + ' (' + vehiculo.anio + ')'} colorValor={'#86868b'} />
      </div>
      
      <h4 style={{ margin: '0 0 12px 0', color: '#1d1d1f' }}>Historial de Trabajos:</h4>
      {(!vehiculo.trabajos || vehiculo.trabajos.length === 0) ? (
        <p style={{ color: '#86868b', fontSize: '14px' }}>No hay trabajos registrados para este vehículo.</p>
      ) : (
        vehiculo.trabajos.map((trabajo) => (
          <FilaTrabajo key={trabajo.id} trabajo={trabajo} />
        ))
      )}
    </div>
  );
}