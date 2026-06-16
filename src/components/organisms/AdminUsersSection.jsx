import React from 'react';
import StatusBadge from '../atoms/StatusBadge';

const ROLE_ORDER = { admin: 1, mecanico: 2, usuario: 3 };

export default function AdminUsersSection({ users, roles, onAddUser, onViewUser, onDeactivateUser }) {
  const ROLES = [
    { id: 'admin', label: 'Administrador', description: 'Acceso completo a todas las funciones del sistema' },
    { id: 'mecanico', label: 'Mecánico', description: 'Gestión de tareas, herramientas y repuestos' },
    { id: 'usuario', label: 'Usuario', description: 'Solo lectura de información del sistema' },
  ];

  const getSortedUsers = () => {
    return [...users].sort((a, b) => {
      if (a.activo !== b.activo) {
        return b.activo ? 1 : -1;
      }
      return ROLE_ORDER[a.rol] - ROLE_ORDER[b.rol];
    });
  };

  return (
    <>
      <div className="section-header">
        <h2>Gestión de usuarios</h2>
        <button className="button button-primary" onClick={onAddUser}>
          Nuevo usuario
        </button>
      </div>
      <div className="user-list">
        {getSortedUsers().map((item) => (
          <div key={item.id} className="user-row">
            <div>
              <strong>{item.nombre}</strong> <span>({ROLES.find(r => r.id === item.rol)?.label || item.rol})</span>
              <div className="user-meta">Código: {item.codigo} · {item.activo ? 'Activo' : 'Inactivo'}</div>
            </div>
            <div className="user-actions">
              <button className="button button-secondary" onClick={() => onViewUser(item)}>
                Ver detalles
              </button>
              <button className="button button-secondary" onClick={() => onDeactivateUser(item.id)}>
                {item.activo ? 'Desactivar' : 'Activar'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
