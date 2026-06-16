import React, { useState } from 'react';
import { loadClientes, loadTransacciones, loadTareas } from '../../services/storage.js';

export default function HistorialVehiculosView() {
  const clientes = loadClientes();
  const transacciones = loadTransacciones();
  const tareas = loadTareas();
  
  const [searchPlaca, setSearchPlaca] = useState('');
  const [clienteEncontrado, setClienteEncontrado] = useState(null);
  const [historialTransacciones, setHistorialTransacciones] = useState([]);
  const [historialTareas, setHistorialTareas] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    const placaNormalizada = searchPlaca.trim().toUpperCase();
    if (!placaNormalizada) return;

    const cliente = clientes.find(c => c.placa && c.placa.toUpperCase() === placaNormalizada);
    setClienteEncontrado(cliente || null);

    const transaccionesPlaca = transacciones.filter(t => t.placa && t.placa.toUpperCase() === placaNormalizada);
    setHistorialTransacciones(transaccionesPlaca);

    const tareasPlaca = tareas.filter(t => t.placa && t.placa.toUpperCase() === placaNormalizada);
    setHistorialTareas(tareasPlaca);
    setHasSearched(true);
  };

  const handleClear = () => {
    setSearchPlaca('');
    setClienteEncontrado(null);
    setHistorialTransacciones([]);
    setHistorialTareas([]);
    setHasSearched(false);
  };

  const calcularTotalGastado = () => {
    return historialTransacciones.reduce((sum, t) => sum + Math.abs(t.monto), 0);
  };

  return (
    <div className="card card-body">
      <h2 className="section-title">Historial de Vehículos</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
        <input
          type="text"
          value={searchPlaca}
          onChange={(e) => setSearchPlaca(e.target.value)}
          placeholder="Ingrese placa del vehículo"
          className="filter-search"
          style={{ width: '100%' }}
        />
        <button className="button button-primary" onClick={handleSearch}>
          Buscar
        </button>
        <button className="button button-secondary" onClick={handleClear}>
          Limpiar
        </button>
      </div>

      {clienteEncontrado && (
        <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '12px' }}>Información del Vehículo</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div><strong>Placa:</strong> {clienteEncontrado.placa}</div>
            <div><strong>Marca:</strong> {clienteEncontrado.marca || '-'}</div>
            <div><strong>Modelo:</strong> {clienteEncontrado.modelo || '-'}</div>
            <div><strong>Año:</strong> {clienteEncontrado.anio || '-'}</div>
            <div><strong>Cliente:</strong> {clienteEncontrado.nombre}</div>
            <div><strong>Teléfono:</strong> {clienteEncontrado.telefono || '-'}</div>
          </div>
        </div>
      )}

      {historialTransacciones.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '12px' }}>Historial de Transacciones</h3>
          <div style={{ marginBottom: '12px', padding: '8px', backgroundColor: '#e9ecef', borderRadius: '4px' }}>
            <strong>Total gastado:</strong> ${calcularTotalGastado().toLocaleString('es-AR')}
          </div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Tipo</th>
                  <th>Categoría</th>
                  <th>Descripción</th>
                  <th>Responsable</th>
                  <th>Monto</th>
                </tr>
              </thead>
              <tbody>
                {historialTransacciones.map((transaccion) => (
                  <tr key={transaccion.id} className={transaccion.categoria === 'Ingreso' ? 'row-income' : 'row-expense'}>
                    <td>{new Date(transaccion.fecha).toLocaleDateString('es-AR')}</td>
                    <td>{transaccion.tipo}</td>
                    <td>{transaccion.categoria}</td>
                    <td>{transaccion.descripcion}</td>
                    <td>{transaccion.responsable || '-'}</td>
                    <td className={transaccion.categoria === 'Ingreso' ? 'amount-income' : 'amount-expense'}>
                      ${Math.abs(transaccion.monto).toLocaleString('es-AR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {historialTareas.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '12px' }}>Historial de Tareas</h3>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Descripción</th>
                  <th>Asignado a</th>
                  <th>Prioridad</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {historialTareas.map((tarea) => (
                  <tr key={tarea.id}>
                    <td>{new Date(tarea.createdAt).toLocaleDateString('es-AR')}</td>
                    <td>{tarea.descripcion}</td>
                    <td>{tarea.asignadoA}</td>
                    <td><span className={`chip prioridad-${tarea.prioridad.toLowerCase()}`}>{tarea.prioridad}</span></td>
                    <td>
                      <span className={`badge ${tarea.estado === 'finalizado' ? 'badge-success' : tarea.estado === 'en_proceso' ? 'badge-warning' : 'badge-danger'}`}>
                        {tarea.estado === 'en_proceso' ? 'En proceso' : tarea.estado.charAt(0).toUpperCase() + tarea.estado.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {hasSearched && !clienteEncontrado && historialTransacciones.length === 0 && historialTareas.length === 0 && (
        <div className="alert alert-warning">
          No se encontró información para la placa: {searchPlaca}
        </div>
      )}
    </div>
  );
}
