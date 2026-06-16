import React, { useState } from 'react';
import useTareas from './useTareas.js';
import ModalForm from '../../components/molecules/ModalForm.jsx';
import PinModal from '../../components/molecules/PinModal.jsx';
import usePinValidation from '../auth/usePinValidation.js';
import { loadUsers, loadRepuestos, saveRepuestos, loadTransacciones, loadClientes, saveClientes } from '../../services/storage.js';

const estados = [
  { id: 'pendiente', title: 'Pendiente', color: '#f87171' },
  { id: 'en_proceso', title: 'En proceso', color: '#fbbf24' },
  { id: 'finalizado', title: 'Finalizado', color: '#34d399' },
];

export default function TareasView() {
  const { tareasPorEstado, crearTarea, moverTarea, actualizarTarea } = useTareas();
  const users = loadUsers();
  const activeUsers = users.filter(u => u.activo);
  const repuestos = loadRepuestos();
  const transacciones = loadTransacciones();
  const clientes = loadClientes();
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({ placa: '', descripcion: '', asignadoA: '', prioridad: 'Media' });
  const [clienteExistente, setClienteExistente] = useState(null);
  const [nuevoClienteForm, setNuevoClienteForm] = useState({ marca: '', modelo: '', anio: '', nombre: '', telefono: '' });
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [pinError, setPinError] = useState('');
  const [pendingTarea, setPendingTarea] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedTarea, setSelectedTarea] = useState(null);
  const [repuestoForm, setRepuestoForm] = useState({ repuestoId: '', cantidad: 1 });
  const [hideCompletedTasks, setHideCompletedTasks] = useState(false);
  const { validatePin } = usePinValidation();

  const isTaskLinkedToAccounting = (tarea) => {
    return transacciones.some(t => 
      t.tipo === 'Ingreso por reparación' && 
      t.descripcion.includes(tarea.placa) &&
      t.descripcion.includes(tarea.descripcion.substring(0, 20))
    );
  };

  const getFilteredTareasPorEstado = () => {
    const filtered = {};
    Object.keys(tareasPorEstado).forEach(estado => {
      let tasks = tareasPorEstado[estado];
      
      if (estado === 'finalizado' && hideCompletedTasks) {
        tasks = tasks.filter(tarea => isTaskLinkedToAccounting(tarea));
      }
      
      // Sort by createdAt (most recent first) and limit to 20
      tasks = tasks
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 20);
      
      filtered[estado] = tasks;
    });
    return filtered;
  };

  const abrirModal = () => {
    setModalVisible(true);
    setClienteExistente(null);
    setNuevoClienteForm({ marca: '', modelo: '', anio: '', nombre: '', telefono: '' });
  };
  const cerrarModal = () => {
    setModalVisible(false);
    setClienteExistente(null);
    setNuevoClienteForm({ marca: '', modelo: '', anio: '', nombre: '', telefono: '' });
  };
  const cerrarPinModal = () => {
    setPinModalVisible(false);
    setPendingTarea(null);
    setPendingAction(null);
    setPinError('');
  };
  const cerrarDetailModal = () => {
    setDetailModalVisible(false);
    setSelectedTarea(null);
    setRepuestoForm({ repuestoId: '', cantidad: 1 });
  };

  const guardarTarea = () => {
    if (!form.placa || !form.descripcion || !form.asignadoA) return;
    
    const placaNormalizada = form.placa.trim().toUpperCase();
    const clienteEncontrado = clientes.find(c => c.placa && c.placa.toUpperCase() === placaNormalizada);
    
    if (clienteEncontrado) {
      setClienteExistente(clienteEncontrado);
    } else {
      setClienteExistente(null);
    }
    
    setPendingAction({ type: 'create', form, cliente: clienteEncontrado, nuevoCliente: nuevoClienteForm });
    setPinError('');
    setPinModalVisible(true);
  };

  const confirmarCreacion = (pin) => {
    const result = validatePin(pin);
    if (!result.valid) {
      setPinError(result.reason);
      return;
    }
    const assignedUser = activeUsers.find(u => u.nombre === pendingAction.form.asignadoA);
    if (result.user.rol !== 'admin' && result.user.nombre !== pendingAction.form.asignadoA) {
      setPinError('Solo el administrador o el técnico asignado pueden crear tareas');
      return;
    }
    
    let clienteInfo = null;
    
    if (pendingAction.cliente) {
      clienteInfo = {
        nombre: pendingAction.cliente.nombre,
        telefono: pendingAction.cliente.telefono,
        marca: pendingAction.cliente.marca,
        modelo: pendingAction.cliente.modelo,
        anio: pendingAction.cliente.anio,
      };
    } else if (pendingAction.nuevoCliente && pendingAction.nuevoCliente.nombre) {
      const nuevoCliente = {
        id: `cli-${Date.now()}`,
        placa: pendingAction.form.placa.trim().toUpperCase(),
        marca: pendingAction.nuevoCliente.marca.trim(),
        modelo: pendingAction.nuevoCliente.modelo.trim(),
        anio: pendingAction.nuevoCliente.anio.trim(),
        nombre: pendingAction.nuevoCliente.nombre.trim(),
        telefono: pendingAction.nuevoCliente.telefono.trim(),
        createdAt: new Date().toISOString(),
      };
      const clientesActualizados = [...clientes, nuevoCliente];
      saveClientes(clientesActualizados);
      clienteInfo = {
        nombre: nuevoCliente.nombre,
        telefono: nuevoCliente.telefono,
        marca: nuevoCliente.marca,
        modelo: nuevoCliente.modelo,
        anio: nuevoCliente.anio,
      };
    }
    
    crearTarea({
      id: `tarea-${Date.now()}`,
      placa: pendingAction.form.placa.trim().toUpperCase(),
      descripcion: pendingAction.form.descripcion.trim(),
      asignadoA: pendingAction.form.asignadoA.trim(),
      prioridad: pendingAction.form.prioridad,
      estado: 'pendiente',
      createdAt: new Date().toISOString(),
      repuestosUsados: [],
      cliente: clienteInfo,
    });
    setForm({ placa: '', descripcion: '', asignadoA: '', prioridad: 'Media' });
    setClienteExistente(null);
    setNuevoClienteForm({ marca: '', modelo: '', anio: '', nombre: '', telefono: '' });
    setModalVisible(false);
    setPinModalVisible(false);
    setPendingAction(null);
  };

  const cambiarEstado = (tarea, nuevoEstado) => {
    setPendingTarea({ tarea, nuevoEstado });
    setPendingAction({ type: 'status', tarea, nuevoEstado });
    setPinError('');
    setPinModalVisible(true);
  };

  const confirmarCambioEstado = (pin) => {
    const result = validatePin(pin);
    if (!result.valid) {
      setPinError(result.reason);
      return;
    }
    moverTarea(pendingTarea.tarea.id, pendingTarea.nuevoEstado, result.user.id);
    setPinModalVisible(false);
    setPendingTarea(null);
    setPendingAction(null);
  };

  const verDetalle = (tarea) => {
    setSelectedTarea(tarea);
    setDetailModalVisible(true);
  };

  const agregarRepuesto = () => {
    if (!repuestoForm.repuestoId || !selectedTarea) return;
    const repuesto = repuestos.find(r => r.id === repuestoForm.repuestoId);
    if (!repuesto) return;
    
    const updatedRepuestosUsados = [
      ...(selectedTarea.repuestosUsados || []),
      {
        repuestoId: repuestoForm.repuestoId,
        repuestoNombre: repuesto.nombre,
        cantidad: Number(repuestoForm.cantidad),
        precio: repuesto.precio,
      },
    ];
    
    actualizarTarea(selectedTarea.id, { repuestosUsados: updatedRepuestosUsados });
    setSelectedTarea({ ...selectedTarea, repuestosUsados: updatedRepuestosUsados });
    setRepuestoForm({ repuestoId: '', cantidad: 1 });
  };

  const confirmarPin = (pin) => {
    if (pendingAction?.type === 'create') {
      confirmarCreacion(pin);
    } else if (pendingAction?.type === 'status') {
      confirmarCambioEstado(pin);
    }
  };

  return (
    <div className="tareas-page">
      <div className="tareas-header">
        <div>
          <h1>Gestor de Tareas</h1>
          <p>Administra tareas mecánicas con un tablero claro y acciones rápidas.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className={`button ${hideCompletedTasks ? 'button-primary' : 'button-secondary'}`} 
            onClick={() => setHideCompletedTasks(!hideCompletedTasks)}
          >
            {hideCompletedTasks ? 'Mostrar todas' : 'Ocultar finalizadas'}
          </button>
          <button className="button button-primary" onClick={abrirModal}>Nueva tarea +</button>
        </div>
      </div>

      <div className="tareas-board">
        {estados.map((col) => (
          <section key={col.id} className="tareas-column">
            <div className="column-header" style={{ backgroundColor: col.color }}>
              <h3>{col.title}</h3>
              <span>{getFilteredTareasPorEstado()[col.id].length}</span>
            </div>
            <div className="column-list">
              {getFilteredTareasPorEstado()[col.id].map((tarea) => (
                <article key={tarea.id} className="tarea-card" onClick={() => verDetalle(tarea)}>
                  <div className="tarea-top">
                    <strong>{tarea.placa}</strong>
                    <span className={`chip prioridad-${tarea.prioridad.toLowerCase()}`}>{tarea.prioridad}</span>
                  </div>
                  <p>{tarea.descripcion}</p>
                  <div className="tarea-meta">
                    <span>{tarea.asignadoA}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      <ModalForm
        visible={modalVisible}
        title="Nueva tarea"
        onClose={cerrarModal}
        onSubmit={guardarTarea}
        submitLabel="Crear tarea"
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <input 
            value={form.placa} 
            onChange={(e) => {
              const placa = e.target.value;
              setForm({ ...form, placa });
              const placaNormalizada = placa.trim().toUpperCase();
              const clienteEncontrado = clientes.find(c => c.placa && c.placa.toUpperCase() === placaNormalizada);
              setClienteExistente(clienteEncontrado || null);
            }}
            placeholder="Placa" 
            className="filter-search"
            style={{ width: '100%' }}
          />
          {clienteExistente && (
            <div style={{ gridColumn: '1 / -1', padding: '12px', backgroundColor: '#d4edda', borderRadius: '4px' }}>
              <strong>Cliente encontrado:</strong>
              <div>{clienteExistente.nombre} - {clienteExistente.telefono}</div>
              <div>{clienteExistente.marca} {clienteExistente.modelo} ({clienteExistente.anio})</div>
            </div>
          )}
          {!clienteExistente && form.placa && (
            <div style={{ gridColumn: '1 / -1', padding: '12px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
              <strong>Placa no encontrada. Ingrese información del cliente:</strong>
            </div>
          )}
          {!clienteExistente && form.placa && (
            <>
              <input 
                value={nuevoClienteForm.marca}
                onChange={(e) => setNuevoClienteForm({ ...nuevoClienteForm, marca: e.target.value })}
                placeholder="Marca"
                className="filter-search"
                style={{ width: '100%' }}
              />
              <input 
                value={nuevoClienteForm.modelo}
                onChange={(e) => setNuevoClienteForm({ ...nuevoClienteForm, modelo: e.target.value })}
                placeholder="Modelo"
                className="filter-search"
                style={{ width: '100%' }}
              />
              <input 
                type="number"
                value={nuevoClienteForm.anio}
                onChange={(e) => setNuevoClienteForm({ ...nuevoClienteForm, anio: e.target.value })}
                placeholder="Año"
                className="filter-search"
                style={{ width: '100%' }}
              />
              <input 
                value={nuevoClienteForm.nombre}
                onChange={(e) => setNuevoClienteForm({ ...nuevoClienteForm, nombre: e.target.value })}
                placeholder="Nombre del cliente"
                className="filter-search"
                style={{ width: '100%' }}
              />
              <input 
                value={nuevoClienteForm.telefono}
                onChange={(e) => setNuevoClienteForm({ ...nuevoClienteForm, telefono: e.target.value })}
                placeholder="Teléfono de contacto"
                className="filter-search"
                style={{ width: '100%' }}
              />
            </>
          )}
          <textarea 
            value={form.descripcion} 
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })} 
            rows="3" 
            placeholder="Descripción breve"
            className="filter-search"
            style={{ width: '100%', gridColumn: '1 / -1' }}
          />
          <select 
            value={form.asignadoA} 
            onChange={(e) => setForm({ ...form, asignadoA: e.target.value })}
            className="filter-select"
            style={{ width: '100%' }}
          >
            <option value="">Seleccionar mecánico</option>
            {activeUsers.map((user) => (
              <option key={user.id} value={user.nombre}>{user.nombre}</option>
            ))}
          </select>
          <select 
            value={form.prioridad} 
            onChange={(e) => setForm({ ...form, prioridad: e.target.value })}
            className="filter-select"
            style={{ width: '100%' }}
          >
            <option>Alta</option>
            <option>Media</option>
            <option>Baja</option>
          </select>
        </div>
      </ModalForm>
      <PinModal
        visible={pinModalVisible}
        title={pendingAction?.type === 'create' ? 'Validar creación de tarea' : pendingTarea ? `Validar ${pendingTarea.nuevoEstado === 'en_proceso' ? 'inicio' : 'cambio'} de tarea` : 'Validación PIN'}
        error={pinError}
        onClose={cerrarPinModal}
        onConfirm={confirmarPin}
      />
      
      <ModalForm
        visible={detailModalVisible}
        title="Detalle de tarea"
        onClose={cerrarDetailModal}
        onSubmit={cerrarDetailModal}
        submitLabel="Cerrar"
      >
        {selectedTarea && (
          <div className="form-grid">
            <div className="modal-fullwidth">
              <strong>Placa:</strong> {selectedTarea.placa}
            </div>
            <div className="modal-fullwidth">
              <strong>Descripción:</strong> {selectedTarea.descripcion}
            </div>
            <div className="modal-fullwidth">
              <strong>Asignado a:</strong> {selectedTarea.asignadoA}
            </div>
            <div className="modal-fullwidth">
              <strong>Prioridad:</strong> {selectedTarea.prioridad}
            </div>
            <div className="modal-fullwidth">
              <strong>Estado:</strong> {selectedTarea.estado === 'pendiente' ? 'Pendiente' : selectedTarea.estado === 'en_proceso' ? 'En proceso' : 'Finalizado'}
            </div>
            <div className="modal-fullwidth">
              <strong>Creado el:</strong> {new Date(selectedTarea.createdAt).toLocaleString('es-AR')}
            </div>
            
            <div className="modal-fullwidth" style={{ marginTop: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
              <strong>Cambiar estado:</strong>
            </div>
            <div className="modal-fullwidth" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {selectedTarea.estado === 'pendiente' && (
                <button className="button button-secondary button-small" onClick={() => cambiarEstado(selectedTarea, 'en_proceso')}>Iniciar</button>
              )}
              {selectedTarea.estado === 'en_proceso' && (
                <>
                  <button className="button button-secondary button-small" onClick={() => cambiarEstado(selectedTarea, 'pendiente')}>Pendiente</button>
                  <button className="button button-success button-small" onClick={() => cambiarEstado(selectedTarea, 'finalizado')}>Finalizar</button>
                </>
              )}
              {selectedTarea.estado === 'finalizado' && (
                <button className="button button-secondary button-small" onClick={() => cambiarEstado(selectedTarea, 'en_proceso')}>Reabrir</button>
              )}
            </div>
            
            {selectedTarea.estado === 'en_proceso' && (
              <>
                <div className="modal-fullwidth" style={{ marginTop: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                  <strong>Repuestos utilizados:</strong>
                </div>
                {selectedTarea.repuestosUsados && selectedTarea.repuestosUsados.length > 0 ? (
                  <div className="modal-fullwidth">
                    {selectedTarea.repuestosUsados.map((rep, idx) => (
                      <div key={idx} style={{ padding: '8px', background: '#f8fafc', borderRadius: '8px', marginBottom: '8px' }}>
                        <strong>{rep.repuestoNombre}</strong> - Cantidad: {rep.cantidad} - Precio: ${rep.precio ? rep.precio.toLocaleString('es-AR') : '-'}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="modal-fullwidth">No se han agregado repuestos</div>
                )}
                
                <div className="modal-fullwidth" style={{ marginTop: '16px' }}>
                  <label>
                    Agregar repuesto
                    <select value={repuestoForm.repuestoId} onChange={(e) => setRepuestoForm({ ...repuestoForm, repuestoId: e.target.value })}>
                      <option value="">Seleccionar repuesto</option>
                      {repuestos.map((rep) => (
                        <option key={rep.id} value={rep.id}>{rep.nombre} - ${rep.precio ? rep.precio.toLocaleString('es-AR') : '-'}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Cantidad
                    <input type="number" min="1" value={repuestoForm.cantidad} onChange={(e) => setRepuestoForm({ ...repuestoForm, cantidad: e.target.value })} />
                  </label>
                  <button className="button button-primary" onClick={agregarRepuesto}>Agregar</button>
                </div>
              </>
            )}
          </div>
        )}
      </ModalForm>
    </div>
  );
}
