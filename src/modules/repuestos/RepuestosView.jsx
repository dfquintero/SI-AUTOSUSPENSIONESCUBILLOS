import React, { useEffect, useState } from 'react';
import { loadRepuestos, saveRepuestos, loadTransacciones } from '../../services/storage.js';

export default function RepuestosView() {
  const [items, setItems] = useState(loadRepuestos());
  const [lowStockThreshold] = useState(3);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const CATEGORIAS_REPUESTOS = ['Suspensión', 'Filtros', 'Frenos', 'Motor', 'Transmisión', 'Eléctrico', 'Carrocería', 'Otros'];

  useEffect(() => {
    saveRepuestos(items);
  }, [items]);

  const getRepuestoUsage = (repuestoId) => {
    const transacciones = loadTransacciones();
    return transacciones.filter(t => 
      t.descripcion.includes('retirado') && 
      t.descripcion.includes(repuestoId)
    ).length;
  };

  const getHighRotationRepuestos = () => {
    const usageMap = {};
    items.forEach(item => {
      usageMap[item.id] = getRepuestoUsage(item.id);
    });
    const avgUsage = Object.values(usageMap).reduce((a, b) => a + b, 0) / (Object.keys(usageMap).length || 1);
    return items.filter(item => usageMap[item.id] > avgUsage * 1.5);
  };

  const getLowStockRepuestos = () => {
    return items.filter(item => item.cantidad <= lowStockThreshold);
  };

  const getFilteredItems = () => {
    return items.filter(item => {
      if (filterCategory && item.categoria && item.categoria.toLowerCase() !== filterCategory.toLowerCase()) return false;
      if (filterStatus === 'low' && item.cantidad > lowStockThreshold) return false;
      if (filterStatus === 'available' && item.cantidad <= lowStockThreshold) return false;
      if (filterStatus === 'no-stock' && item.cantidad !== 0) return false;
      if (searchTerm && !item.nombre.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });
  };

  const lowStockItems = getLowStockRepuestos();
  const highRotationItems = getHighRotationRepuestos();
  const filteredItems = getFilteredItems();

  return (
    <div className="card card-body">
      <h2 className="section-title">Inventario Repuestos</h2>
      
      {lowStockItems.length > 0 && (
        <div className="alert alert-warning">
          <strong>⚠️ Stock bajo:</strong> {lowStockItems.map(item => item.nombre).join(', ')} - Necesario comprar más
        </div>
      )}

      {highRotationItems.length > 0 && (
        <div className="alert alert-info">
          <strong>📊 Alta rotación:</strong> {highRotationItems.map(item => item.nombre).join(', ')}
        </div>
      )}

      <div className="filter-section">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
          <input 
            type="text" 
            placeholder="Buscar repuesto..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="filter-search"
            style={{ width: '100%' }}
          />
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="filter-select" style={{ width: '100%' }}>
            <option value="">Todas las categorías</option>
            {CATEGORIAS_REPUESTOS.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select" style={{ width: '100%' }}>
            <option value="">Todos los estados</option>
            <option value="low">Stock bajo</option>
            <option value="available">Disponible</option>
            <option value="no-stock">Sin stock</option>
          </select>
          <button className="button button-secondary button-small" onClick={() => { setFilterCategory(''); setFilterStatus(''); setSearchTerm(''); }} style={{ width: '100%' }}>
            Limpiar
          </button>
        </div>
      </div>

      <div className="table-scroll">
        <table>
          <thead>
            <tr><th>Nombre</th><th>Marca</th><th>Categoría</th><th>Cantidad</th><th>Precio</th><th>Estado</th></tr>
          </thead>
          <tbody>
            {filteredItems.map((it) => {
              let rowClass = '';
              let badgeText = '';
              let badgeClass = '';

              if (it.cantidad === 0) {
                rowClass = 'row-no-stock';
                badgeText = 'Sin stock';
                badgeClass = 'badge-danger';
              } else if (it.cantidad <= lowStockThreshold) {
                rowClass = 'row-low-stock';
                badgeText = 'Stock bajo';
                badgeClass = 'badge-warning';
              } else {
                rowClass = 'row-available';
                badgeText = 'Disponible';
                badgeClass = 'badge-success';
              }

              return (
                <tr key={it.id} className={rowClass}>
                  <td>{it.nombre}</td>
                  <td>{it.marca || '-'}</td>
                  <td>{it.categoria || '-'}</td>
                  <td>{it.cantidad}</td>
                  <td>${it.precio ? it.precio.toLocaleString('es-AR') : '-'}</td>
                  <td>
                    <span className={`badge ${badgeClass}`}>{badgeText}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
