import React, { useState } from 'react';
import useAdmin from '../admin/useAdmin.js';
import { loadTareas, loadRepuestos } from '../../services/storage.js';

const TIPOS_TRANSACCION = [
  { 
    tipo: 'Ingreso por reparación', 
    categoria: 'Ingreso', 
    color: '#348FCB',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
      </svg>
    )
  },
  { 
    tipo: 'Compra de repuesto', 
    categoria: 'Egreso', 
    color: '#3283BC',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
        <line x1="12" y1="22.08" x2="12" y2="12"></line>
      </svg>
    )
  },
  { 
    tipo: 'Pago de obligaciones', 
    categoria: 'Egreso', 
    color: '#3077AD',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2"></rect>
        <line x1="2" y1="10" x2="22" y2="10"></line>
      </svg>
    )
  },
  { 
    tipo: 'Nueva transacción', 
    categoria: 'Egreso', 
    color: '#2E6B9E',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    )
  },
];

export default function ContabilidadView() {
  const { transacciones, addTransaccion, updateTransaccion, deleteTransaccion, users } = useAdmin();
  const tareas = loadTareas();
  const repuestos = loadRepuestos();
  const [transaccionModalVisible, setTransaccionModalVisible] = useState(false);
  const [transaccionForm, setTransaccionForm] = useState({ tipo: '', categoria: 'Ingreso', monto: '', descripcion: '', placa: '', responsable: '', fecha: new Date().toISOString().slice(0, 10), selectedTaskId: '', selectedRepuestoId: '', cantidad: 1, newCategory: '', isNewRepuesto: false, newRepuestoNombre: '', newRepuestoMarca: '', newRepuestoCategoria: '', newRepuestoPrecio: '', cargoTotal: '' });
  const [selectedTransaccion, setSelectedTransaccion] = useState(null);
  const [isEditingTransaccion, setIsEditingTransaccion] = useState(false);
  const [transaccionError, setTransaccionError] = useState('');
  const [transaccionPage, setTransaccionPage] = useState(1);
  const [transaccionFilters, setTransaccionFilters] = useState({ fechaDesde: '', fechaHasta: '', categoria: '', tipo: '', placa: '', responsable: '', texto: '' });
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const TRANSACCION_PER_PAGE = 20;

  const CATEGORIAS_REPUESTOS = ['Suspensión', 'Filtros', 'Frenos', 'Motor', 'Transmisión', 'Eléctrico', 'Carrocería', 'Otros'];
  const marcas = [...new Set(repuestos.map(r => r.marca).filter(Boolean))];

  const getFinancialSummary = () => {
    const ingresos = transacciones.filter(t => t.categoria === 'Ingreso').reduce((sum, t) => sum + t.monto, 0);
    const egresos = Math.abs(transacciones.filter(t => t.categoria === 'Egreso').reduce((sum, t) => sum + t.monto, 0));
    const balance = ingresos - egresos;
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const transaccionesMes = transacciones.filter(t => {
      const fecha = new Date(t.fecha);
      return fecha.getMonth() === currentMonth && fecha.getFullYear() === currentYear;
    }).length;
    return { ingresos, egresos, balance, transaccionesMes };
  };

  const getFilteredTransacciones = () => {
    return transacciones.filter(t => {
      if (transaccionFilters.fechaDesde && new Date(t.fecha) < new Date(transaccionFilters.fechaDesde)) return false;
      if (transaccionFilters.fechaHasta && new Date(t.fecha) > new Date(transaccionFilters.fechaHasta)) return false;
      if (transaccionFilters.categoria && t.categoria.toLowerCase() !== transaccionFilters.categoria.toLowerCase()) return false;
      if (transaccionFilters.tipo && t.tipo.toLowerCase() !== transaccionFilters.tipo.toLowerCase()) return false;
      if (transaccionFilters.placa && t.placa && t.placa.toLowerCase() !== transaccionFilters.placa.toLowerCase()) return false;
      if (transaccionFilters.responsable && t.responsable && t.responsable.toLowerCase() !== transaccionFilters.responsable.toLowerCase()) return false;
      if (transaccionFilters.texto) {
        const searchText = transaccionFilters.texto.toLowerCase();
        const matchesPlate = t.placa && t.placa.toLowerCase().includes(searchText);
        const matchesDescription = t.descripcion && t.descripcion.toLowerCase().includes(searchText);
        if (!matchesPlate && !matchesDescription) return false;
      }
      return true;
    }).sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  };

  const handleAddTransaccion = () => {
    if (!transaccionForm.tipo.trim()) {
      setTransaccionError('Ingrese el tipo de transacción');
      return;
    }
    if (!transaccionForm.monto || transaccionForm.monto === '') {
      setTransaccionError('Ingrese el monto');
      return;
    }
    if (!transaccionForm.descripcion.trim() && transaccionForm.tipo !== 'Ingreso por reparación') {
      setTransaccionError('Ingrese la descripción');
      return;
    }
    if (transaccionForm.tipo === 'Ingreso por reparación' && !transaccionForm.selectedTaskId) {
      setTransaccionError('Seleccione una tarea');
      return;
    }

    const monto = parseFloat(transaccionForm.monto);
    const categoria = transaccionForm.categoria;
    const montoFinal = categoria === 'Egreso' ? -Math.abs(monto) : Math.abs(monto);

    addTransaccion({
      id: `trans-${Date.now()}`,
      tipo: transaccionForm.tipo.trim(),
      placa: transaccionForm.placa.trim(),
      responsable: transaccionForm.responsable.trim(),
      monto: montoFinal,
      categoria: categoria,
      descripcion: transaccionForm.descripcion.trim(),
      fecha: transaccionForm.fecha,
    });
    setTransaccionForm({ tipo: '', categoria: 'Ingreso', monto: '', descripcion: '', placa: '', responsable: '', fecha: new Date().toISOString().slice(0, 10), selectedTaskId: '', selectedRepuestoId: '', cantidad: 1, newCategory: '', isNewRepuesto: false, newRepuestoNombre: '', newRepuestoMarca: '', newRepuestoCategoria: '', newRepuestoPrecio: '', cargoTotal: '' });
    setTransaccionError('');
    setTransaccionModalVisible(false);
  };

  const handleEditTransaccion = () => {
    if (!transaccionForm.tipo.trim()) {
      setTransaccionError('Ingrese el tipo de transacción');
      return;
    }
    if (!transaccionForm.monto || transaccionForm.monto === '') {
      setTransaccionError('Ingrese el monto');
      return;
    }
    if (!transaccionForm.descripcion.trim()) {
      setTransaccionError('Ingrese la descripción');
      return;
    }

    const monto = parseFloat(transaccionForm.monto);
    const categoria = transaccionForm.categoria;
    const montoFinal = categoria === 'Egreso' ? -Math.abs(monto) : Math.abs(monto);

    updateTransaccion(selectedTransaccion.id, {
      tipo: transaccionForm.tipo.trim(),
      placa: transaccionForm.placa.trim(),
      responsable: transaccionForm.responsable.trim(),
      monto: montoFinal,
      categoria: categoria,
      descripcion: transaccionForm.descripcion.trim(),
      fecha: transaccionForm.fecha,
    });
    setTransaccionForm({ tipo: '', categoria: 'Ingreso', monto: '', descripcion: '', placa: '', responsable: '', fecha: new Date().toISOString().slice(0, 10), selectedTaskId: '', selectedRepuestoId: '', cantidad: 1, newCategory: '', isNewRepuesto: false, newRepuestoNombre: '', newRepuestoMarca: '', newRepuestoCategoria: '', newRepuestoPrecio: '', cargoTotal: '' });
    setTransaccionError('');
    setTransaccionModalVisible(false);
    setIsEditingTransaccion(false);
    setSelectedTransaccion(null);
  };

  const handleEditTransaccionClick = (transaccion) => {
    setSelectedTransaccion(transaccion);
    setTransaccionForm({
      tipo: transaccion.tipo,
      categoria: transaccion.categoria,
      monto: Math.abs(transaccion.monto),
      descripcion: transaccion.descripcion,
      placa: transaccion.placa,
      responsable: transaccion.responsable,
      fecha: transaccion.fecha.slice(0, 10),
    });
    setIsEditingTransaccion(true);
    setTransaccionModalVisible(true);
  };

  const handleDeleteTransaccion = (transaccionId) => {
    if (confirm('¿Está seguro de eliminar esta transacción?')) {
      deleteTransaccion(transaccionId);
    }
  };

  return (
    <div className="section-card">
      <div className="admin-header">
        <h2>Contabilidad</h2>
      </div>
      
      <div className="financial-dashboard">
        <div className="summary-card summary-ingreso">
          <div className="summary-label">Total Ingresos</div>
          <div className="summary-value">${getFinancialSummary().ingresos.toLocaleString('es-AR')}</div>
        </div>
        <div className="summary-card summary-egreso">
          <div className="summary-label">Total Egresos</div>
          <div className="summary-value">${getFinancialSummary().egresos.toLocaleString('es-AR')}</div>
        </div>
        <div className="summary-card summary-saldo">
          <div className="summary-label">Balance</div>
          <div className="summary-value">${getFinancialSummary().balance.toLocaleString('es-AR')}</div>
        </div>
        <div className="summary-card summary-transacciones">
          <div className="summary-label">Transacciones del mes</div>
          <div className="summary-value">{getFinancialSummary().transaccionesMes}</div>
        </div>
      </div>
      
      <div className="cuentas-actions">
        {TIPOS_TRANSACCION.map((item) => (
          <button key={item.tipo} className="button button-small" style={{ backgroundColor: item.color, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }} onClick={() => {
            setTransaccionForm({ tipo: item.tipo, categoria: item.categoria, monto: '', descripcion: '', placa: '', responsable: '', fecha: new Date().toISOString().slice(0, 10) });
            setTransaccionModalVisible(true);
          }}>
            <div style={{ fontSize: '20px' }}>{item.icon}</div>
            <span style={{ fontSize: '12px' }}>{item.tipo}</span>
          </button>
        ))}
      </div>

      <div className="filter-section">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
          <input 
            type="date" 
            value={transaccionFilters.fechaDesde} 
            onChange={(e) => setTransaccionFilters({ ...transaccionFilters, fechaDesde: e.target.value })}
            className="filter-select"
            style={{ width: '100%' }}
            placeholder="Desde"
          />
          <input 
            type="date" 
            value={transaccionFilters.fechaHasta} 
            onChange={(e) => setTransaccionFilters({ ...transaccionFilters, fechaHasta: e.target.value })}
            className="filter-select"
            style={{ width: '100%' }}
            placeholder="Hasta"
          />
          <select 
            value={transaccionFilters.categoria} 
            onChange={(e) => setTransaccionFilters({ ...transaccionFilters, categoria: e.target.value })}
            className="filter-select"
            style={{ width: '100%' }}
          >
            <option value="">Todas las categorías</option>
            <option value="Ingreso">Ingreso</option>
            <option value="Egreso">Egreso</option>
          </select>
          <select 
            value={transaccionFilters.tipo} 
            onChange={(e) => setTransaccionFilters({ ...transaccionFilters, tipo: e.target.value })}
            className="filter-select"
            style={{ width: '100%' }}
          >
            <option value="">Todos los tipos</option>
            {TIPOS_TRANSACCION.map((item) => (
              <option key={item.tipo} value={item.tipo}>{item.tipo}</option>
            ))}
          </select>
          <select 
            value={transaccionFilters.responsable} 
            onChange={(e) => setTransaccionFilters({ ...transaccionFilters, responsable: e.target.value })}
            className="filter-select"
            style={{ width: '100%' }}
          >
            <option value="">Todos los responsables</option>
            {users.map((user) => (<option key={user.id} value={user.nombre}>{user.nombre}</option>))}
          </select>
          <input 
            type="text"
            value={transaccionFilters.texto}
            onChange={(e) => setTransaccionFilters({ ...transaccionFilters, texto: e.target.value })}
            placeholder="Buscar placa o texto"
            className="filter-search"
            style={{ width: '100%' }}
          />
          <button 
            className="button button-secondary button-small" 
            onClick={() => setTransaccionFilters({ fechaDesde: '', fechaHasta: '', categoria: '', tipo: '', placa: '', responsable: '', texto: '' })}
            style={{ width: '100%' }}
          >
            Limpiar
          </button>
        </div>
      </div>

      <div className="transactions-table">
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Categoría</th>
              <th>Descripción</th>
              <th>Placa</th>
              <th>Responsable</th>
              <th>Monto</th>
            </tr>
          </thead>
          <tbody>
            {getFilteredTransacciones().slice((transaccionPage - 1) * TRANSACCION_PER_PAGE, transaccionPage * TRANSACCION_PER_PAGE).map((transaccion) => (
              <tr 
                key={transaccion.id} 
                className={transaccion.categoria === 'Ingreso' ? 'row-income' : 'row-expense'}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setSelectedTransaccion(transaccion);
                  setDetailModalVisible(true);
                }}
              >
                <td>{new Date(transaccion.fecha).toLocaleDateString('es-AR')}</td>
                <td>{transaccion.tipo}</td>
                <td>{transaccion.categoria}</td>
                <td>{transaccion.descripcion}</td>
                <td>{transaccion.placa || '-'}</td>
                <td>{transaccion.responsable || '-'}</td>
                <td className={transaccion.categoria === 'Ingreso' ? 'amount-income' : 'amount-expense'}>
                  ${Math.abs(transaccion.monto).toLocaleString('es-AR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          className="button button-secondary button-small"
          style={{ backgroundColor: 'var(--deep-blue)' }}
          onClick={() => setTransaccionPage(transaccionPage - 1)}
          disabled={transaccionPage === 1}
        >
          Anterior
        </button>
        <span>Página {transaccionPage} de {Math.ceil(getFilteredTransacciones().length / TRANSACCION_PER_PAGE)}</span>
        <button
          className="button button-secondary button-small"
          style={{ backgroundColor: 'var(--deep-blue)' }}
          onClick={() => setTransaccionPage(transaccionPage + 1)}
          disabled={transaccionPage >= Math.ceil(getFilteredTransacciones().length / TRANSACCION_PER_PAGE)}
        >
          Siguiente
        </button>
      </div>

      {detailModalVisible && selectedTransaccion && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Detalle de Transacción</h3>
              <button className="modal-close" onClick={() => setDetailModalVisible(false)}>×</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <div style={{ gridColumn: '1 / -1', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                  <strong>Tipo:</strong> {selectedTransaccion.tipo}
                </div>
                <div style={{ padding: '8px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
                  <strong>Fecha:</strong> {new Date(selectedTransaccion.fecha).toLocaleDateString('es-AR')}
                </div>
                <div style={{ padding: '8px', backgroundColor: selectedTransaccion.categoria === 'Ingreso' ? '#d4edda' : '#f8d7da', borderRadius: '4px' }}>
                  <strong>Categoría:</strong> {selectedTransaccion.categoria}
                </div>
                <div style={{ padding: '8px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
                  <strong>Monto:</strong> ${Math.abs(selectedTransaccion.monto).toLocaleString('es-AR')}
                </div>
                <div style={{ gridColumn: '1 / -1', padding: '8px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
                  <strong>Descripción:</strong> {selectedTransaccion.descripcion || '-'}
                </div>
                <div style={{ padding: '8px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
                  <strong>Placa:</strong> {selectedTransaccion.placa || '-'}
                </div>
                <div style={{ padding: '8px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
                  <strong>Responsable:</strong> {selectedTransaccion.responsable || '-'}
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button className="button button-secondary" onClick={() => setDetailModalVisible(false)}>Cerrar</button>
              <button className="button button-primary" onClick={() => {
                setDetailModalVisible(false);
                handleEditTransaccionClick(selectedTransaccion);
              }}>Editar</button>
              <button className="button button-danger" onClick={() => {
                if (confirm('¿Está seguro de eliminar esta transacción?')) {
                  handleDeleteTransaccion(selectedTransaccion.id);
                  setDetailModalVisible(false);
                }
              }}>Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {transaccionModalVisible && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>{isEditingTransaccion ? 'Editar Transacción' : `Nueva transacción: ${transaccionForm.tipo}`}</h3>
              <button className="modal-close" onClick={() => {
                setTransaccionModalVisible(false);
                setIsEditingTransaccion(false);
                setSelectedTransaccion(null);
                setTransaccionForm({ tipo: '', categoria: 'Ingreso', monto: '', descripcion: '', placa: '', responsable: '', fecha: new Date().toISOString().slice(0, 10), selectedTaskId: '', selectedRepuestoId: '', cantidad: 1, newCategory: '', isNewRepuesto: false, newRepuestoNombre: '', newRepuestoMarca: '', newRepuestoCategoria: '', newRepuestoPrecio: '', cargoTotal: '' });
                setTransaccionError('');
              }}>
                ×
              </button>
            </div>
            <div className="modal-body">
              {transaccionError && <div className="form-error">{transaccionError}</div>}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                {isEditingTransaccion && (
                  <select
                    value={transaccionForm.tipo}
                    onChange={(e) => setTransaccionForm({ ...transaccionForm, tipo: e.target.value })}
                    className="filter-select"
                    style={{ width: '100%' }}
                  >
                    <option value="">Seleccione tipo</option>
                    {TIPOS_TRANSACCION.map((item) => (
                      <option key={item.tipo} value={item.tipo}>{item.tipo}</option>
                    ))}
                  </select>
                )}
                {transaccionForm.tipo === 'Ingreso por reparación' && !isEditingTransaccion && (
                  <select
                    value={transaccionForm.selectedTaskId || ''}
                    onChange={(e) => {
                      const taskId = e.target.value;
                      const selectedTask = tareas.find(t => t.id === taskId);
                      setTransaccionForm({ 
                        ...transaccionForm, 
                        selectedTaskId: taskId,
                        placa: selectedTask?.placa || '',
                        descripcion: 'Ingreso por reparación'
                      });
                    }}
                    className="filter-select"
                    style={{ width: '100%', gridColumn: '1 / -1' }}
                  >
                    <option value="">Seleccionar tarea en proceso</option>
                    {tareas.filter(t => t.estado === 'en_proceso').map((task) => (
                      <option key={task.id} value={task.id}>
                        {task.placa} - {task.descripcion} ({task.asignadoA})
                      </option>
                    ))}
                  </select>
                )}
                {transaccionForm.tipo === 'Compra de repuesto' && !isEditingTransaccion && (
                  <>
                    <select
                      value={transaccionForm.isNewRepuesto ? 'new' : (transaccionForm.selectedRepuestoId || '')}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === 'new') {
                          setTransaccionForm({ 
                            ...transaccionForm, 
                            isNewRepuesto: true,
                            selectedRepuestoId: '',
                            monto: '',
                            descripcion: ''
                          });
                        } else {
                          const repuestoId = value;
                          const selectedRepuesto = repuestos.find(r => r.id === repuestoId);
                          setTransaccionForm({ 
                            ...transaccionForm, 
                            isNewRepuesto: false,
                            selectedRepuestoId: repuestoId,
                            monto: selectedRepuesto?.precio * transaccionForm.cantidad || '',
                            descripcion: selectedRepuesto?.nombre || ''
                          });
                        }
                      }}
                      className="filter-select"
                      style={{ width: '100%', gridColumn: '1 / -1' }}
                    >
                      <option value="">Seleccionar repuesto</option>
                      {repuestos.map((repuesto) => (
                        <option key={repuesto.id} value={repuesto.id}>
                          {repuesto.nombre} - {repuesto.marca || 'Sin marca'} - ${repuesto.precio}
                        </option>
                      ))}
                      <option value="new">+ Crear nuevo repuesto</option>
                    </select>
                    {transaccionForm.isNewRepuesto && (
                      <>
                        <input
                          type="text"
                          value={transaccionForm.newRepuestoNombre}
                          onChange={(e) => setTransaccionForm({ ...transaccionForm, newRepuestoNombre: e.target.value })}
                          placeholder="Nombre del repuesto"
                          className="filter-search"
                          style={{ width: '100%' }}
                        />
                        <input
                          type="text"
                          value={transaccionForm.newRepuestoMarca}
                          onChange={(e) => setTransaccionForm({ ...transaccionForm, newRepuestoMarca: e.target.value })}
                          placeholder="Marca"
                          className="filter-search"
                          style={{ width: '100%' }}
                        />
                        <select
                          value={transaccionForm.newRepuestoCategoria}
                          onChange={(e) => setTransaccionForm({ ...transaccionForm, newRepuestoCategoria: e.target.value })}
                          className="filter-select"
                          style={{ width: '100%' }}
                        >
                          <option value="">Seleccionar categoría</option>
                          {CATEGORIAS_REPUESTOS.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
                        </select>
                        <input
                          type="number"
                          value={transaccionForm.newRepuestoPrecio}
                          onChange={(e) => {
                            const precio = parseFloat(e.target.value) || 0;
                            setTransaccionForm({ 
                              ...transaccionForm, 
                              newRepuestoPrecio: e.target.value,
                              cargoTotal: (precio * transaccionForm.cantidad).toString()
                            });
                          }}
                          placeholder="Precio unitario"
                          className="filter-search"
                          style={{ width: '100%' }}
                        />
                      </>
                    )}
                    {!transaccionForm.isNewRepuesto && transaccionForm.selectedRepuestoId && (
                      <div style={{ gridColumn: '1 / -1', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                        <strong>Detalles del repuesto:</strong>
                        {(() => {
                          const selectedRepuesto = repuestos.find(r => r.id === transaccionForm.selectedRepuestoId);
                          if (!selectedRepuesto) return null;
                          return (
                            <div style={{ marginTop: '8px' }}>
                              <div><strong>Nombre:</strong> {selectedRepuesto.nombre}</div>
                              <div><strong>Marca:</strong> {selectedRepuesto.marca || 'Sin marca'}</div>
                              <div><strong>Categoría:</strong> {selectedRepuesto.categoria}</div>
                              <div><strong>Precio unitario:</strong> ${selectedRepuesto.precio.toLocaleString('es-AR')}</div>
                              <div><strong>Stock disponible:</strong> {selectedRepuesto.cantidad}</div>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                    <input
                      type="number"
                      value={transaccionForm.cantidad}
                      onChange={(e) => {
                        const cantidad = parseInt(e.target.value) || 1;
                        setTransaccionForm({ 
                          ...transaccionForm, 
                          cantidad
                        });
                      }}
                      placeholder="Cantidad"
                      className="filter-search"
                      style={{ width: '100%' }}
                      min="1"
                    />
                    <input
                      type="number"
                      value={transaccionForm.cargoTotal}
                      onChange={(e) => {
                        const cargoTotal = parseFloat(e.target.value) || 0;
                        const cantidad = transaccionForm.cantidad || 1;
                        const precioUnitario = cantidad > 1 ? (cargoTotal / cantidad).toFixed(2) : cargoTotal;
                        setTransaccionForm({ 
                          ...transaccionForm, 
                          cargoTotal: e.target.value,
                          monto: cargoTotal.toString(),
                          newRepuestoPrecio: transaccionForm.isNewRepuesto ? precioUnitario : transaccionForm.newRepuestoPrecio
                        });
                      }}
                      placeholder="Cargo de valor total"
                      className="filter-search"
                      style={{ width: '100%' }}
                    />
                    {transaccionForm.cantidad > 1 && transaccionForm.cargoTotal && (
                      <div style={{ gridColumn: '1 / -1', padding: '8px', backgroundColor: '#e9ecef', borderRadius: '4px', fontSize: '14px' }}>
                        <strong>Precio unitario:</strong> ${(parseFloat(transaccionForm.cargoTotal) / transaccionForm.cantidad).toFixed(2)}
                      </div>
                    )}
                  </>
                )}
                {transaccionForm.tipo === 'Compra de repuesto' && (
                  <input
                    type="text"
                    value={transaccionForm.descripcion}
                    onChange={(e) => setTransaccionForm({ ...transaccionForm, descripcion: e.target.value })}
                    placeholder="Descripción"
                    className="filter-search"
                    style={{ width: '100%', gridColumn: '1 / -1' }}
                  />
                )}
                {transaccionForm.tipo !== 'Ingreso por reparación' && transaccionForm.tipo !== 'Compra de repuesto' && transaccionForm.tipo !== 'Pago de obligaciones' && (
                  <select
                    value={transaccionForm.categoria}
                    onChange={(e) => setTransaccionForm({ ...transaccionForm, categoria: e.target.value })}
                    className="filter-select"
                    style={{ width: '100%' }}
                  >
                    <option value="Ingreso">Ingreso</option>
                    <option value="Egreso">Egreso</option>
                  </select>
                )}
                {transaccionForm.tipo !== 'Compra de repuesto' && (
                  <input
                    type="number"
                    value={transaccionForm.monto}
                    onChange={(e) => setTransaccionForm({ ...transaccionForm, monto: e.target.value })}
                    placeholder="Monto"
                    className="filter-search"
                    style={{ width: '100%' }}
                  />
                )}
                {transaccionForm.tipo !== 'Ingreso por reparación' && transaccionForm.tipo !== 'Compra de repuesto' && (
                  <input
                    type="text"
                    value={transaccionForm.descripcion}
                    onChange={(e) => setTransaccionForm({ ...transaccionForm, descripcion: e.target.value })}
                    placeholder="Descripción"
                    className="filter-search"
                    style={{ width: '100%', gridColumn: '1 / -1' }}
                  />
                )}
                {transaccionForm.selectedTaskId && transaccionForm.tipo === 'Ingreso por reparación' && (
                  <div style={{ gridColumn: '1 / -1', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                    <strong>Detalles de la tarea:</strong>
                    {(() => {
                      const selectedTask = tareas.find(t => t.id === transaccionForm.selectedTaskId);
                      if (!selectedTask) return null;
                      const taskRepuestos = selectedTask.repuestos || [];
                      const totalRepuestosCost = taskRepuestos.reduce((sum, r) => sum + (r.precio * r.cantidad), 0);
                      return (
                        <div style={{ marginTop: '8px' }}>
                          <div><strong>Placa:</strong> {selectedTask.placa}</div>
                          <div><strong>Descripción:</strong> {selectedTask.descripcion}</div>
                          <div><strong>Asignado a:</strong> {selectedTask.asignadoA}</div>
                          <div><strong>Estado:</strong> {selectedTask.estado}</div>
                          {taskRepuestos.length > 0 && (
                            <div style={{ marginTop: '8px' }}>
                              <strong>Repuestos utilizados:</strong>
                              <ul style={{ margin: '4px 0 0 20px' }}>
                                {taskRepuestos.map((r, idx) => (
                                  <li key={idx}>{r.nombre} x{r.cantidad} - ${r.precio * r.cantidad}</li>
                                ))}
                              </ul>
                              <div><strong>Total repuestos:</strong> ${totalRepuestosCost.toLocaleString('es-AR')}</div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}
                {transaccionForm.tipo === 'Ingreso por reparación' && transaccionForm.selectedTaskId && (
                  <input
                    type="text"
                    value={transaccionForm.placa}
                    readOnly
                    placeholder="Placa (de tarea seleccionada)"
                    className="filter-search"
                    style={{ width: '100%', backgroundColor: '#e9ecef' }}
                  />
                )}
                {transaccionForm.tipo !== 'Ingreso por reparación' && transaccionForm.tipo !== 'Compra de repuesto' && transaccionForm.tipo !== 'Pago de obligaciones' && (
                  <input
                    type="text"
                    value={transaccionForm.placa}
                    onChange={(e) => setTransaccionForm({ ...transaccionForm, placa: e.target.value })}
                    placeholder="Placa (opcional)"
                    className="filter-search"
                    style={{ width: '100%' }}
                  />
                )}
                <select
                  value={transaccionForm.responsable}
                  onChange={(e) => setTransaccionForm({ ...transaccionForm, responsable: e.target.value })}
                  className="filter-select"
                  style={{ width: '100%' }}
                >
                  <option value="">Responsable (opcional)</option>
                  {users.map((user) => (<option key={user.id} value={user.nombre}>{user.nombre}</option>))}
                </select>
                <input
                  type="date"
                  value={transaccionForm.fecha}
                  onChange={(e) => setTransaccionForm({ ...transaccionForm, fecha: e.target.value })}
                  className="filter-select"
                  style={{ width: '100%' }}
                />
              </div>
              <button className="button button-primary" style={{ backgroundColor: 'var(--bright-blue)' }} onClick={isEditingTransaccion ? handleEditTransaccion : handleAddTransaccion}>
                {isEditingTransaccion ? 'Actualizar' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
