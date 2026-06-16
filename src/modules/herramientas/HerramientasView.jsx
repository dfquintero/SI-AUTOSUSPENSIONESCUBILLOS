import React, { useEffect, useState } from 'react';
import PinModal from '../../components/molecules/PinModal.jsx';
import usePinValidation from '../auth/usePinValidation.js';
import { loadHerramientas, saveHerramientas, loadHerramientasHistorial, saveHerramientasHistorial, loadUsers } from '../../services/storage.js';

export default function HerramientasView() {
  const [items, setItems] = useState(loadHerramientas());
  const [historial, setHistorial] = useState(loadHerramientasHistorial());
  const [users, setUsers] = useState(loadUsers());
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [pinError, setPinError] = useState('');
  const [pendingTool, setPendingTool] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('inventario');
  const [historialPage, setHistorialPage] = useState(1);
  const [historialFilters, setHistorialFilters] = useState({ herramienta: '', usuario: '', fechaDesde: '', fechaHasta: '' });
  const { validatePin } = usePinValidation();

  const SECTIONS = [
    { id: 'inventario', label: 'Inventario', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
      </svg>
    ) },
    { id: 'historial', label: 'Historial', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
    ) },
  ];

  const CATEGORIAS_HERRAMIENTAS = ['Manuales', 'Eléctricas', 'Neumáticas', 'Equipos', 'Medición', 'Corte', 'Otras'];
  const HISTORIAL_PER_PAGE = 20;

  useEffect(() => {
    saveHerramientas(items);
  }, [items]);

  useEffect(() => {
    saveHerramientasHistorial(historial);
  }, [historial]);

  const getFilteredItems = () => {
    return items.filter(item => {
      if (searchTerm && !item.nombre.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });
  };

  const getFilteredHistorial = () => {
    return historial.filter(entry => {
      if (historialFilters.herramienta && !entry.herramientaNombre.toLowerCase().includes(historialFilters.herramienta.toLowerCase())) return false;
      if (historialFilters.usuario && !entry.usuario.toLowerCase().includes(historialFilters.usuario.toLowerCase())) return false;
      if (historialFilters.fechaDesde && new Date(entry.fecha) < new Date(historialFilters.fechaDesde)) return false;
      if (historialFilters.fechaHasta && new Date(entry.fecha) > new Date(historialFilters.fechaHasta)) return false;
      return true;
    }).sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  };

  const retirar = (tool) => {
    if (tool.enUsoPor) return;
    setPendingTool(tool);
    setPinError('');
    setPinModalVisible(true);
  };

  const confirmarRetiro = (pin) => {
    const result = validatePin(pin);
    if (!result.valid) {
      setPinError(result.reason);
      return;
    }
    setItems(items.map((it) => (it.id === pendingTool.id ? { ...it, enUsoPor: result.user.nombre } : it)));
    setHistorial([{
      id: `hist-${Date.now()}`,
      herramientaId: pendingTool.id,
      herramientaNombre: pendingTool.nombre,
      usuario: result.user.nombre,
      fechaRetiro: new Date().toISOString(),
      fechaDevolucion: null,
    }, ...historial]);
    setPendingTool(null);
    setPinModalVisible(false);
  };

  const devolver = (tool) => {
    setItems(items.map((it) => (it.id === tool.id ? { ...it, enUsoPor: null } : it)));
    setHistorial(historial.map(entry => 
      entry.herramientaId === tool.id && !entry.fechaDevolucion
        ? { ...entry, fechaDevolucion: new Date().toISOString() }
        : entry
    ));
  };

  const cerrarPinModal = () => {
    setPinModalVisible(false);
    setPendingTool(null);
    setPinError('');
  };

  const filteredItems = getFilteredItems();
  const filteredHistorial = getFilteredHistorial();

  return (
    <div className="card card-body">
      <h2 className="section-title">Inventario Herramientas</h2>
      
      <div className="admin-section-nav">
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            className={`button admin-tab-button ${activeTab === section.id ? 'button-primary' : 'button-secondary'}`}
            onClick={() => setActiveTab(section.id)}
          >
            <div className="button-icon">{section.icon}</div>
            <span>{section.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'inventario' && (
        <>
          <div className="filter-section">
            <div className="filter-row">
              <input 
                type="text" 
                placeholder="Buscar herramienta..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="filter-search"
              />
            </div>
          </div>

          <div className="tool-grid">
            {filteredItems.map((it) => (
              <div key={it.id} className="tool-card">
                {it.imagen && (
                  <div className="tool-image">
                    <img src={it.imagen} alt={it.nombre} />
                  </div>
                )}
                <div className="tool-info">
                  <strong>{it.nombre}</strong>
                  <div className="tool-meta">Categoría: {it.categoria || '-'}</div>
                  {it.descripcion && <div className="tool-desc">{it.descripcion}</div>}
                </div>
                <div className="tool-status">
                  {it.enUsoPor ? (
                    <span className="badge badge-warning">En uso por: {it.enUsoPor}</span>
                  ) : (
                    <span className="badge badge-success">Disponible</span>
                  )}
                </div>
                <div className="tool-actions">
                  {it.enUsoPor ? (
                    <button className="button button-secondary button-small" onClick={() => devolver(it)}>
                      Devolver
                    </button>
                  ) : (
                    <button className="button button-secondary button-small" onClick={() => retirar(it)}>
                      Retirar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'historial' && (
        <>
          <div className="filter-section">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
              <input 
                type="text" 
                placeholder="Herramienta..." 
                value={historialFilters.herramienta} 
                onChange={(e) => setHistorialFilters({ ...historialFilters, herramienta: e.target.value })} 
                className="filter-search"
                style={{ width: '100%' }}
              />
              <select value={historialFilters.usuario} onChange={(e) => setHistorialFilters({ ...historialFilters, usuario: e.target.value })} className="filter-select" style={{ width: '100%' }}>
                <option value="">Todos los usuarios</option>
                {users.map((user) => (<option key={user.id} value={user.nombre}>{user.nombre}</option>))}
              </select>
              <input 
                type="date" 
                value={historialFilters.fechaDesde} 
                onChange={(e) => setHistorialFilters({ ...historialFilters, fechaDesde: e.target.value })} 
                className="filter-select"
                style={{ width: '100%' }}
              />
              <input 
                type="date" 
                value={historialFilters.fechaHasta} 
                onChange={(e) => setHistorialFilters({ ...historialFilters, fechaHasta: e.target.value })} 
                className="filter-select"
                style={{ width: '100%' }}
              />
              <button className="button button-secondary button-small" onClick={() => setHistorialFilters({ herramienta: '', usuario: '', fechaDesde: '', fechaHasta: '' })} style={{ width: '100%' }}>
                Limpiar
              </button>
            </div>
          </div>

          <div className="transactions-table">
            <table>
              <thead>
                <tr><th>Fecha Retiro</th><th>Herramienta</th><th>Usuario</th><th>Estado</th><th>Fecha Devolución</th></tr>
              </thead>
              <tbody>
                {filteredHistorial.slice((historialPage - 1) * HISTORIAL_PER_PAGE, historialPage * HISTORIAL_PER_PAGE).map((entry) => (
                  <tr key={entry.id} className={!entry.fechaDevolucion ? 'row-expense' : 'row-income'}>
                    <td>{new Date(entry.fechaRetiro).toLocaleString('es-AR')}</td>
                    <td>{entry.herramientaNombre}</td>
                    <td>{entry.usuario}</td>
                    <td>
                      {!entry.fechaDevolucion ? (
                        <span className="badge badge-warning">En uso</span>
                      ) : (
                        <span className="badge badge-success">Devuelto</span>
                      )}
                    </td>
                    <td>{entry.fechaDevolucion ? new Date(entry.fechaDevolucion).toLocaleString('es-AR') : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button className="button button-secondary button-small" onClick={() => setHistorialPage(Math.max(1, historialPage - 1))} disabled={historialPage === 1}>
              Anterior
            </button>
            <span>Página {historialPage}</span>
            <button className="button button-secondary button-small" onClick={() => setHistorialPage(historialPage + 1)} disabled={filteredHistorial.length <= historialPage * HISTORIAL_PER_PAGE}>
              Siguiente
            </button>
          </div>
        </>
      )}

      <PinModal
        visible={pinModalVisible}
        title={pendingTool ? `Retiro ${pendingTool.nombre}` : 'Validación PIN'}
        error={pinError}
        onClose={cerrarPinModal}
        onConfirm={confirmarRetiro}
      />
    </div>
  );
}
