import React, { useState } from 'react';
import useAdmin from './useAdmin.js';
import AdminNavigation from '../../components/organisms/AdminNavigation';
import AdminInfoSection from '../../components/organisms/AdminInfoSection';
import AdminAuditLog from '../../components/organisms/AdminAuditLog';
import AdminUsersSection from '../../components/organisms/AdminUsersSection';
import AdminClientesSection from '../../components/organisms/AdminClientesSection';
import AdminHerramientasSection from '../../components/organisms/AdminHerramientasSection';
import AdminRepuestosSection from '../../components/organisms/AdminRepuestosSection';
import UserModal from '../../components/molecules/UserModal';
import ToolModal from '../../components/molecules/ToolModal';
import RepuestoModal from '../../components/molecules/RepuestoModal';
import ClienteModal from '../../components/molecules/ClienteModal';

const ROLES = [
  { id: 'admin', label: 'Administrador', description: 'Acceso completo a todas las funciones del sistema' },
  { id: 'mecanico', label: 'Mecánico', description: 'Gestión de tareas, herramientas y repuestos' },
  { id: 'usuario', label: 'Usuario', description: 'Solo lectura de información del sistema' },
];

const CATEGORIAS_HERRAMIENTAS = ['Manuales', 'Eléctricas', 'Neumáticas', 'Hidráulicas', 'Medición', 'Corte'];

const CATEGORIAS_REPUESTOS = ['Suspensión', 'Frenos', 'Motor', 'Transmisión', 'Eléctrico', 'Carrocería'];

const validatePin = (pin) => /^[0-9]{4}$/.test(pin);

const generateUserCode = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export default function AdminView() {
  const { users, audits, roles, addUser, updateUser, toggleUserActive, deleteUser, exportData, restoreData, herramientas, addHerramienta, updateHerramienta, deleteHerramienta, repuestos, addRepuesto, updateRepuesto, deleteRepuesto, clientes, addCliente, updateCliente, deleteCliente, transacciones, addTransaccion, updateTransaccion, deleteTransaccion, addAudit } = useAdmin();
  const [activeSection, setActiveSection] = useState('informacion');
  const [currentUser, setCurrentUser] = useState('admin');
  const [importMessage, setImportMessage] = useState('');
  const [auditPage, setAuditPage] = useState(1);
  const [auditFilters, setAuditFilters] = useState({ fecha: '', usuario: '', accion: '' });
  const [lastExportTime, setLastExportTime] = useState(null);
  
  // User modal state
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditingUser, setIsEditingUser] = useState(false);
  
  // Tool modal state
  const [toolModalVisible, setToolModalVisible] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const [isEditingTool, setIsEditingTool] = useState(false);
  
  // Repuesto modal state
  const [repuestoModalVisible, setRepuestoModalVisible] = useState(false);
  const [selectedRepuesto, setSelectedRepuesto] = useState(null);
  const [isEditingRepuesto, setIsEditingRepuesto] = useState(false);
  
  // Cliente modal state
  const [clienteModalVisible, setClienteModalVisible] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [isEditingCliente, setIsEditingCliente] = useState(false);

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsEditingUser(false);
    setUserModalVisible(true);
  };

  const handleSaveUser = (formData) => {
    const codigo = generateUserCode();
    if (users.some((item) => item.codigo === codigo)) {
      alert('Error al generar código único, intente nuevamente');
      return;
    }

    addUser({
      id: `usr-${Date.now()}`,
      codigo: codigo,
      pin: formData.pin,
      nombre: formData.nombre.trim(),
      rol: formData.rol,
      activo: true,
      fecha_creacion: new Date().toISOString(),
    }, currentUser);
    setUserModalVisible(false);
  };

  const handleEditUser = (formData) => {
    if (!selectedUser) return;
    
    updateUser(selectedUser.id, {
      nombre: formData.nombre.trim(),
      pin: formData.pin,
      rol: formData.rol,
    }, currentUser);
    setUserModalVisible(false);
    setSelectedUser(null);
    setIsEditingUser(false);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsEditingUser(true);
    setUserModalVisible(true);
  };

  const handleDeactivateUser = (userId) => {
    try {
      toggleUserActive(userId, currentUser);
    } catch (error) {
      alert(error.message);
    }
  };

  const getUserActivityCount = (userId) => {
    return audits.filter((audit) => audit.usuarioId === userId).length;
  };

  const getSortedUsers = () => {
    return [...users].sort((a, b) => {
      if (a.activo !== b.activo) {
        return b.activo ? 1 : -1;
      }
      const roleOrder = { admin: 0, mecanico: 1, usuario: 2 };
      return roleOrder[a.rol] - roleOrder[b.rol];
    });
  };

  const compressImage = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxSize = 300;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddHerramienta = () => {
    setSelectedTool(null);
    setIsEditingTool(false);
    setToolModalVisible(true);
  };

  const handleSaveHerramienta = async (formData) => {
    const imagen = formData.imagen ? await compressImage(formData.imagen) : null;
    addHerramienta({
      id: `herr-${Date.now()}`,
      nombre: formData.nombre.trim(),
      cantidad: parseInt(formData.cantidad),
      descripcion: formData.descripcion.trim(),
      categoria: formData.categoria,
      imagen: imagen,
    }, currentUser);
    setToolModalVisible(false);
  };

  const handleEditHerramienta = async (formData) => {
    if (!selectedTool) return;
    
    const imagen = formData.imagen instanceof File ? await compressImage(formData.imagen) : formData.imagen;
    updateHerramienta(selectedTool.id, {
      nombre: formData.nombre.trim(),
      cantidad: parseInt(formData.cantidad),
      descripcion: formData.descripcion.trim(),
      categoria: formData.categoria,
      imagen: imagen,
    }, currentUser);
    setToolModalVisible(false);
    setSelectedTool(null);
    setIsEditingTool(false);
  };

  const handleViewHerramienta = (tool) => {
    setSelectedTool(tool);
    setIsEditingTool(true);
    setToolModalVisible(true);
  };

  const handleDeleteHerramienta = (toolId) => {
    if (confirm('¿Está seguro de eliminar esta herramienta?')) {
      deleteHerramienta(toolId, currentUser);
    }
  };

  const handleAddRepuesto = () => {
    setSelectedRepuesto(null);
    setIsEditingRepuesto(false);
    setRepuestoModalVisible(true);
  };

  const handleSaveRepuesto = async (formData) => {
    const imagen = formData.imagen ? await compressImage(formData.imagen) : null;
    addRepuesto({
      id: `rep-${Date.now()}`,
      nombre: formData.nombre.trim(),
      cantidad: parseInt(formData.cantidad),
      descripcion: formData.descripcion.trim(),
      precio: parseFloat(formData.precio),
      categoria: formData.categoria,
      marca: formData.marca.trim(),
      imagen: imagen,
    }, currentUser);
    setRepuestoModalVisible(false);
  };

  const handleEditRepuesto = async (formData) => {
    if (!selectedRepuesto) return;
    
    const imagen = formData.imagen instanceof File ? await compressImage(formData.imagen) : formData.imagen;
    updateRepuesto(selectedRepuesto.id, {
      nombre: formData.nombre.trim(),
      cantidad: parseInt(formData.cantidad),
      descripcion: formData.descripcion.trim(),
      precio: parseFloat(formData.precio),
      categoria: formData.categoria,
      marca: formData.marca.trim(),
      imagen: imagen,
    }, currentUser);
    setRepuestoModalVisible(false);
    setSelectedRepuesto(null);
    setIsEditingRepuesto(false);
  };

  const handleViewRepuesto = (repuesto) => {
    setSelectedRepuesto(repuesto);
    setIsEditingRepuesto(true);
    setRepuestoModalVisible(true);
  };

  const handleDeleteRepuesto = (repuestoId) => {
    if (confirm('¿Está seguro de eliminar este repuesto?')) {
      deleteRepuesto(repuestoId, currentUser);
    }
  };

  const handleAddCliente = () => {
    setSelectedCliente(null);
    setIsEditingCliente(false);
    setClienteModalVisible(true);
  };

  const handleSaveCliente = (formData) => {
    addCliente({
      id: `cli-${Date.now()}`,
      placa: formData.placa.trim(),
      marca: formData.marca.trim(),
      modelo: formData.modelo.trim(),
      anio: formData.anio ? parseInt(formData.anio) : null,
      nombre: formData.nombre.trim(),
      telefono: formData.telefono.trim(),
    }, currentUser);
    setClienteModalVisible(false);
  };

  const handleEditCliente = (formData) => {
    if (!selectedCliente) return;
    
    updateCliente(selectedCliente.id, {
      placa: formData.placa.trim(),
      marca: formData.marca.trim(),
      modelo: formData.modelo.trim(),
      anio: formData.anio ? parseInt(formData.anio) : null,
      nombre: formData.nombre.trim(),
      telefono: formData.telefono.trim(),
    }, currentUser);
    setClienteModalVisible(false);
    setSelectedCliente(null);
    setIsEditingCliente(false);
  };

  const handleViewCliente = (cliente) => {
    setSelectedCliente(cliente);
    setIsEditingCliente(true);
    setClienteModalVisible(true);
  };

  const handleDeleteCliente = (clienteId) => {
    if (confirm('¿Está seguro de eliminar este cliente?')) {
      deleteCliente(clienteId, currentUser);
    }
  };

  const handleExport = () => {
    const data = exportData();
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-').replace('T', '_').slice(0, -5);
    const filename = `${timestamp}_backup_autosuspensionescubillos.json`;
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setLastExportTime(now);
  };

  const handleImportFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const restored = await restoreData(data);
      setImportMessage(restored ? 'Datos importados correctamente' : 'Archivo no válido');
    } catch {
      setImportMessage('No se pudo leer el archivo. Asegúrese de que sea JSON válido.');
    }
  };

  const userMap = users.reduce((map, next) => {
    map[next.id] = next.nombre;
    return map;
  }, {});

  const getFilteredAudits = () => {
    return audits.filter((audit) => {
      if (auditFilters.fecha && !new Date(audit.fecha).toLocaleDateString('es-AR').includes(auditFilters.fecha)) {
        return false;
      }
      if (auditFilters.usuario && audit.usuarioId !== auditFilters.usuario) {
        return false;
      }
      if (auditFilters.accion && !audit.accion.toLowerCase().includes(auditFilters.accion.toLowerCase())) {
        return false;
      }
      return true;
    });
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'informacion':
        return (
          <>
            <section className="section-card">
              <h2>Gestión de información</h2>
              <p className="section-subtitle">Backup y restauración de datos del sistema.</p>

              <div className="backup-info">
                <strong>Último Backup:</strong>
                <span>{lastExportTime ? lastExportTime.toLocaleString('es-AR') : 'No se ha realizado ningún backup'}</span>
              </div>

              <div className="backup-actions">
                <button className="button button-primary" onClick={handleExport}>
                  <span>📥</span> Exportar datos
                </button>
                <button className="button button-secondary" onClick={() => document.getElementById('import-file').click()}>
                  <span>📤</span> Importar JSON
                </button>
                <input
                  id="import-file"
                  type="file"
                  accept="application/json"
                  onChange={handleImportFile}
                  style={{ display: 'none' }}
                />
              </div>
              {importMessage && <div className="form-success">{importMessage}</div>}
            </section>

            <AdminAuditLog
              audits={audits}
              users={users}
              auditPage={auditPage}
              auditFilters={auditFilters}
              setAuditPage={setAuditPage}
              setAuditFilters={setAuditFilters}
            />
          </>
        );
      case 'usuarios':
        return (
          <section className="section-card">
            <div className="admin-header">
              <h2>Gestión de usuarios</h2>
              <button className="button button-primary" onClick={() => setUserModalVisible(true)}>
                Nuevo usuario
              </button>
            </div>
            <div className="user-list">
              {getSortedUsers().map((item) => (
                <div key={item.id} className="user-row">
                  <div>
                    <strong>{item.nombre}</strong> <span>({ROLES.find(r => r.id === item.rol)?.label || item.rol})</span>
                    <div className="user-meta">{item.activo ? 'Activo' : 'Inactivo'}</div>
                  </div>
                  <div className="user-actions">
                    <button className="button button-secondary" onClick={() => handleViewUser(item)}>
                      Ver detalles
                    </button>
                    <button className="button button-secondary" onClick={() => handleDeactivateUser(item.id)}>
                      {item.activo ? 'Desactivar' : 'Activar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      case 'repuestos':
        return (
          <section className="section-card">
            <div className="admin-header">
              <h2>Repuestos</h2>
              <button className="button button-primary" onClick={() => setRepuestoModalVisible(true)}>
                Nuevo repuesto
              </button>
            </div>
            <div className="tools-list">
              {CATEGORIAS_REPUESTOS.map((categoria) => {
                const categoriaRepuestos = repuestos.filter(r => r.categoria === categoria);
                if (categoriaRepuestos.length === 0) return null;
                return (
                  <div key={categoria} className="tool-category">
                    <h3>{categoria}</h3>
                    <div className="tool-grid">
                      {categoriaRepuestos.map((repuesto) => (
                        <div key={repuesto.id} className="tool-card">
                          {repuesto.imagen && (
                            <div className="tool-image">
                              <img src={repuesto.imagen} alt={repuesto.nombre} />
                            </div>
                          )}
                          <div className="tool-info">
                            <strong>{repuesto.nombre}</strong>
                            <div className="tool-meta">Cantidad: {repuesto.cantidad}</div>
                            <div className="tool-meta">Precio: ${repuesto.precio.toLocaleString('es-AR')}</div>
                            {repuesto.descripcion && <div className="tool-desc">{repuesto.descripcion}</div>}
                          </div>
                          <div className="tool-actions">
                            <button className="button button-secondary button-small" onClick={() => handleViewRepuesto(repuesto)}>
                              Editar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      case 'herramientas':
        return (
          <section className="section-card">
            <div className="admin-header">
              <h2>Herramientas</h2>
              <button className="button button-primary" onClick={() => setToolModalVisible(true)}>
                Nueva herramienta
              </button>
            </div>
            <div className="tools-list">
              {CATEGORIAS_HERRAMIENTAS.map((categoria) => {
                const categoriaHerramientas = herramientas.filter(h => h.categoria === categoria);
                if (categoriaHerramientas.length === 0) return null;
                return (
                  <div key={categoria} className="tool-category">
                    <h3>{categoria}</h3>
                    <div className="tool-grid">
                      {categoriaHerramientas.map((tool) => (
                        <div key={tool.id} className="tool-card">
                          {tool.imagen && (
                            <div className="tool-image">
                              <img src={tool.imagen} alt={tool.nombre} />
                            </div>
                          )}
                          <div className="tool-info">
                            <strong>{tool.nombre}</strong>
                            <div className="tool-meta">Cantidad: {tool.cantidad}</div>
                            {tool.descripcion && <div className="tool-desc">{tool.descripcion}</div>}
                          </div>
                          <div className="tool-actions">
                            <button className="button button-secondary button-small" onClick={() => handleViewHerramienta(tool)}>
                              Editar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      case 'clientes':
        return (
          <section className="section-card">
            <div className="admin-header">
              <h2>Clientes</h2>
              <button className="button button-primary" onClick={() => setClienteModalVisible(true)}>
                Nuevo cliente
              </button>
            </div>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr><th>Placa</th><th>Marca</th><th>Modelo</th><th>Año</th><th>Nombre</th><th>Teléfono</th><th>Acciones</th></tr>
                </thead>
                <tbody>
                  {clientes.map((cliente) => (
                    <tr key={cliente.id}>
                      <td>{cliente.placa}</td>
                      <td>{cliente.marca || '-'}</td>
                      <td>{cliente.modelo || '-'}</td>
                      <td>{cliente.anio || '-'}</td>
                      <td>{cliente.nombre}</td>
                      <td>{cliente.telefono || '-'}</td>
                      <td>
                        <button className="button button-secondary button-small" onClick={() => handleViewCliente(cliente)}>
                          Editar
                        </button>
                        <button className="button button-danger button-small" onClick={() => handleDeleteCliente(cliente.id)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Panel Administrador</h1>
          <p>Selecciona una sección para administrar.</p>
        </div>
      </div>

      <AdminNavigation activeSection={activeSection} onSectionChange={setActiveSection} />

      {renderSection()}

      <UserModal
        visible={userModalVisible}
        onClose={() => setUserModalVisible(false)}
        user={selectedUser}
        isEditing={isEditingUser}
        onSubmit={isEditingUser ? handleEditUser : handleSaveUser}
      />

      <ToolModal
        visible={toolModalVisible}
        onClose={() => setToolModalVisible(false)}
        tool={selectedTool}
        isEditing={isEditingTool}
        onSubmit={isEditingTool ? handleEditHerramienta : handleSaveHerramienta}
      />

      <RepuestoModal
        visible={repuestoModalVisible}
        onClose={() => setRepuestoModalVisible(false)}
        repuesto={selectedRepuesto}
        isEditing={isEditingRepuesto}
        onSubmit={isEditingRepuesto ? handleEditRepuesto : handleSaveRepuesto}
      />

      <ClienteModal
        visible={clienteModalVisible}
        onClose={() => setClienteModalVisible(false)}
        cliente={selectedCliente}
        isEditing={isEditingCliente}
        onSubmit={isEditingCliente ? handleEditCliente : handleSaveCliente}
      />
    </div>
  );
}
