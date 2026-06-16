import React from 'react';
import CardMetrica from '../molecules/CardMetrica';
import FormularioMecanico from '../molecules/FormularioMecanico';
import FormularioHerramienta from '../molecules/FormularioHerramienta';
import FormularioVehiculoTrabajo from '../molecules/FormularioVehiculoTrabajo';
import FilaMecanico from '../molecules/FilaMecanico';
import FilaHerramientaAdmin from '../molecules/FilaHerramientaAdmin';

// Organismo: Gestor general de la tienda. Agrupa métricas de todos los módulos y la gestión de la tabla MECANICOS
export default function ModuloAdministrador({ mecanicos, setMecanicos, herramientas, setHerramientas, stats, onAgregarVehiculoTrabajo }) {
  const manejarAgregarMecanico = (nuevo) => {
    setMecanicos([...mecanicos, nuevo]);
  };

  const manejarAgregarHerramienta = (nueva) => {
    setHerramientas([...herramientas, nueva]);
  };

  return (
    <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
      <h2 style={{ marginBottom: '6px', color: '#1d1d1f' }}>Panel de Administrador</h2>
      <p style={{ fontSize: '14px', color: '#86868b', margin: '0 0 20px 0' }}>
        Resumen general del taller y gestión de personal operativo.
      </p>

      {/* Métricas Interconectadas (Acopladas a las sumatorias de todo el sistema) */}
      <h3 style={{ fontSize: '16px', color: '#1d1d1f', marginBottom: '10px' }}>Resumen del Sistema</h3>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <CardMetrica titulo="Mecánicos" valor={mecanicos.filter(m => m.activo).length} color="#c25900" />
        <CardMetrica titulo="Vehículos" valor={stats.vehiculos} color="#007aff" />
        <CardMetrica titulo="Herramientas" valor={stats.herramientas} color="#107c41" />
        <CardMetrica titulo="Repuestos" valor={stats.repuestos} color="#5e5ce6" />
      </div>

      <h3 style={{ fontSize: '16px', color: '#1d1d1f', marginBottom: '10px' }}>Atención y Asignación de Servicios</h3>
      <FormularioVehiculoTrabajo mecanicos={mecanicos} onAgregarVehiculoTrabajo={onAgregarVehiculoTrabajo} />

      <h3 style={{ fontSize: '16px', color: '#1d1d1f', marginBottom: '10px', marginTop: '30px' }}>Gestión de Personal</h3>
      {/* Formulario (Molécula) */}
      <FormularioMecanico onAgregar={manejarAgregarMecanico} />

      {/* Lista del personal operativo */}
      <div style={{ 
        backgroundColor: '#ffffff', 
        borderRadius: '12px', 
        border: '1px solid #e5e5ea',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '12px 16px', backgroundColor: '#fcfcfc', borderBottom: '1px solid #e5e5ea' }}>
          <strong style={{ fontSize: '14px', color: '#1d1d1f' }}>Nómina Activa</strong>
        </div>
        {mecanicos.length === 0 ? (
          <p style={{ padding: '20px', textAlign: 'center', color: '#86868b', margin: 0, fontSize: '14px' }}>
            No hay mecánicos registrados localmente.
          </p>
        ) : (
          mecanicos.map(m => (
            <FilaMecanico key={m.id} mecanico={m} />
          ))
        )}
      </div>

      <h3 style={{ fontSize: '16px', color: '#1d1d1f', marginBottom: '10px', marginTop: '30px' }}>Gestión de Herramientas</h3>
      {/* Formulario para agregar herramientas */}
      <FormularioHerramienta onAgregar={manejarAgregarHerramienta} />

      {/* Lista de herramientas */}
      <div style={{ 
        backgroundColor: '#ffffff', 
        borderRadius: '12px', 
        border: '1px solid #e5e5ea',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '12px 16px', backgroundColor: '#fcfcfc', borderBottom: '1px solid #e5e5ea' }}>
          <strong style={{ fontSize: '14px', color: '#1d1d1f' }}>Inventario de Herramientas</strong>
        </div>
        {herramientas.length === 0 ? (
          <p style={{ padding: '20px', textAlign: 'center', color: '#86868b', margin: 0, fontSize: '14px' }}>
            No hay herramientas registradas.
          </p>
        ) : (
          herramientas.map(h => (
            <FilaHerramientaAdmin key={h.id} herramienta={h} />
          ))
        )}
      </div>
    </div>
  );
}