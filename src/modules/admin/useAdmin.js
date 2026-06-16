import { useState, useEffect } from 'react';
import { loadUsers, saveUsers, loadTransacciones, saveTransacciones, loadHerramientas, saveHerramientas, loadRepuestos, saveRepuestos, loadClientes, saveClientes, loadAudits, saveAudits, getDb, saveDatabase } from '../../services/storage.js';

export default function useAdmin() {
  const [users, setUsers] = useState([]);
  const [transacciones, setTransacciones] = useState([]);
  const [herramientas, setHerramientas] = useState([]);
  const [repuestos, setRepuestos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [audits, setAudits] = useState([]);
  const [roles, setRoles] = useState(['admin', 'mecanico', 'usuario']);

  useEffect(() => {
    setUsers(loadUsers());
    setTransacciones(loadTransacciones());
    setHerramientas(loadHerramientas());
    setRepuestos(loadRepuestos());
    setClientes(loadClientes());
    setAudits(loadAudits());
  }, []);

  const addAudit = (accion, tabla, detalles, usuarioId) => {
    const newAudit = {
      id: `audit-${Date.now()}`,
      fecha: new Date().toISOString(),
      usuarioId: usuarioId || 'system',
      accion,
      tabla,
      detalles
    };
    const updated = [...audits, newAudit];
    setAudits(updated);
    saveAudits(updated);
  };

  const addTransaccion = (transaccion, usuarioId) => {
    const newTransaccion = { ...transaccion, id: Date.now(), createdAt: new Date().toISOString() };
    const updated = [...transacciones, newTransaccion];
    setTransacciones(updated);
    saveTransacciones(updated);
    addAudit('crear', 'transacciones', { descripcion: `Transacción creada: ${transaccion.descripcion}`, monto: transaccion.monto }, usuarioId);
  };

  const updateTransaccion = (id, updates, usuarioId) => {
    const updated = transacciones.map(t => t.id === id ? { ...t, ...updates } : t);
    setTransacciones(updated);
    saveTransacciones(updated);
    addAudit('actualizar', 'transacciones', { descripcion: `Transacción actualizada: ${id}` }, usuarioId);
  };

  const deleteTransaccion = (id, usuarioId) => {
    const updated = transacciones.filter(t => t.id !== id);
    setTransacciones(updated);
    saveTransacciones(updated);
    addAudit('eliminar', 'transacciones', { descripcion: `Transacción eliminada: ${id}` }, usuarioId);
  };

  const addUser = (user, usuarioId) => {
    const newUser = { ...user, id: Date.now(), activo: true, createdAt: new Date().toISOString() };
    const updated = [...users, newUser];
    setUsers(updated);
    saveUsers(updated);
    addAudit('crear', 'usuarios', { descripcion: `Usuario creado: ${user.nombre}` }, usuarioId);
  };

  const updateUser = (id, updates, usuarioId) => {
    const updated = users.map(u => u.id === id ? { ...u, ...updates } : u);
    setUsers(updated);
    saveUsers(updated);
    addAudit('actualizar', 'usuarios', { descripcion: `Usuario actualizado: ${id}` }, usuarioId);
  };

  const toggleUserActive = (id, usuarioId) => {
    const userToToggle = users.find(u => u.id === id);
    if (userToToggle && userToToggle.rol === 'admin' && userToToggle.activo) {
      const activeAdmins = users.filter(u => u.rol === 'admin' && u.activo);
      if (activeAdmins.length === 1) {
        throw new Error('No se puede desactivar el último administrador activo');
      }
    }
    const updated = users.map(u => u.id === id ? { ...u, activo: !u.activo } : u);
    setUsers(updated);
    saveUsers(updated);
    addAudit('cambiar estado', 'usuarios', { descripcion: `Estado de usuario cambiado: ${id}` }, usuarioId);
  };

  const deleteUser = (id, usuarioId) => {
    const userToDelete = users.find(u => u.id === id);
    if (userToDelete && userToDelete.rol === 'admin') {
      const activeAdmins = users.filter(u => u.rol === 'admin' && u.activo);
      if (activeAdmins.length === 1) {
        throw new Error('No se puede eliminar el último administrador activo');
      }
    }
    const updated = users.filter(u => u.id !== id);
    setUsers(updated);
    saveUsers(updated);
    addAudit('eliminar', 'usuarios', { descripcion: `Usuario eliminado: ${id}` }, usuarioId);
  };

  const addHerramienta = (herramienta, usuarioId) => {
    const newHerramienta = { ...herramienta, id: Date.now(), createdAt: new Date().toISOString() };
    const updated = [...herramientas, newHerramienta];
    setHerramientas(updated);
    saveHerramientas(updated);
    addAudit('crear', 'herramientas', { descripcion: `Herramienta creada: ${herramienta.nombre}` }, usuarioId);
  };

  const updateHerramienta = (id, updates, usuarioId) => {
    const updated = herramientas.map(h => h.id === id ? { ...h, ...updates } : h);
    setHerramientas(updated);
    saveHerramientas(updated);
    addAudit('actualizar', 'herramientas', { descripcion: `Herramienta actualizada: ${id}` }, usuarioId);
  };

  const deleteHerramienta = (id, usuarioId) => {
    const updated = herramientas.filter(h => h.id !== id);
    setHerramientas(updated);
    saveHerramientas(updated);
    addAudit('eliminar', 'herramientas', { descripcion: `Herramienta eliminada: ${id}` }, usuarioId);
  };

  const addRepuesto = (repuesto, usuarioId) => {
    const newRepuesto = { ...repuesto, id: Date.now(), createdAt: new Date().toISOString() };
    const updated = [...repuestos, newRepuesto];
    setRepuestos(updated);
    saveRepuestos(updated);
    addAudit('crear', 'repuestos', { descripcion: `Repuesto creado: ${repuesto.nombre}` }, usuarioId);
  };

  const updateRepuesto = (id, updates, usuarioId) => {
    const updated = repuestos.map(r => r.id === id ? { ...r, ...updates } : r);
    setRepuestos(updated);
    saveRepuestos(updated);
    addAudit('actualizar', 'repuestos', { descripcion: `Repuesto actualizado: ${id}` }, usuarioId);
  };

  const deleteRepuesto = (id, usuarioId) => {
    const updated = repuestos.filter(r => r.id !== id);
    setRepuestos(updated);
    saveRepuestos(updated);
    addAudit('eliminar', 'repuestos', { descripcion: `Repuesto eliminado: ${id}` }, usuarioId);
  };

  const addCliente = (cliente, usuarioId) => {
    const newCliente = { ...cliente, createdAt: new Date().toISOString() };
    const updated = [...clientes, newCliente];
    setClientes(updated);
    saveClientes(updated);
    addAudit('crear', 'clientes', { descripcion: `Cliente creado: ${cliente.nombre} (${cliente.placa})` }, usuarioId);
  };

  const updateCliente = (id, updates, usuarioId) => {
    const updated = clientes.map(c => c.id === id ? { ...c, ...updates } : c);
    setClientes(updated);
    saveClientes(updated);
    addAudit('actualizar', 'clientes', { descripcion: `Cliente actualizado: ${id}` }, usuarioId);
  };

  const deleteCliente = (id, usuarioId) => {
    const updated = clientes.filter(c => c.id !== id);
    setClientes(updated);
    saveClientes(updated);
    addAudit('eliminar', 'clientes', { descripcion: `Cliente eliminado: ${id}` }, usuarioId);
  };

  const exportData = () => {
    const db = getDb();
    const blob = new Blob([JSON.stringify(db, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const restoreData = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          
          // Check if it's the new database format
          if (data.metadata && data.tables) {
            // New database format
            const db = getDb();
            Object.keys(data.tables).forEach(tableName => {
              if (db.tables[tableName]) {
                db.tables[tableName].data = data.tables[tableName].data;
              }
            });
            saveDatabase(db);
            
            // Reload all data
            setUsers(loadUsers());
            setTransacciones(loadTransacciones());
            setHerramientas(loadHerramientas());
            setRepuestos(loadRepuestos());
            setClientes(loadClientes());
            setAudits(loadAudits());
          } else {
            // Legacy format
            if (data.users) {
              setUsers(data.users);
              saveUsers(data.users);
            }
            if (data.transacciones) {
              setTransacciones(data.transacciones);
              saveTransacciones(data.transacciones);
            }
            if (data.herramientas) {
              setHerramientas(data.herramientas);
              saveHerramientas(data.herramientas);
            }
            if (data.repuestos) {
              setRepuestos(data.repuestos);
              saveRepuestos(data.repuestos);
            }
            if (data.clientes) {
              setClientes(data.clientes);
              saveClientes(data.clientes);
            }
            if (data.audits) {
              setAudits(data.audits);
            }
          }
          resolve(true);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  return {
    users,
    audits,
    roles,
    addUser,
    updateUser,
    toggleUserActive,
    deleteUser,
    exportData,
    restoreData,
    herramientas,
    addHerramienta,
    updateHerramienta,
    deleteHerramienta,
    repuestos,
    addRepuesto,
    updateRepuesto,
    deleteRepuesto,
    clientes,
    addCliente,
    updateCliente,
    deleteCliente,
    transacciones,
    addTransaccion,
    updateTransaccion,
    deleteTransaccion,
    addAudit
  };
}