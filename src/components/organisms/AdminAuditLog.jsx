import React from 'react';
import Table from '../atoms/Table';
import Pagination from '../atoms/Pagination';
import Input from '../atoms/Input';
import Select from '../atoms/Select';

export default function AdminAuditLog({ audits, users, auditPage, auditFilters, setAuditPage, setAuditFilters }) {
  const userMap = users.reduce((map, next) => {
    map[next.id] = next.nombre;
    return map;
  }, {});

  const AUDIT_PER_PAGE = 20;

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

  return (
    <>
      <h3 style={{ marginBottom: '12px' }}>Auditoría Reciente</h3>
      <div className="filter-grid">
        <Input
          type="date"
          value={auditFilters.fecha}
          onChange={(e) => setAuditFilters({ ...auditFilters, fecha: e.target.value })}
          className="filter-select"
        />
        <Select
          value={auditFilters.usuario}
          onChange={(e) => setAuditFilters({ ...auditFilters, usuario: e.target.value })}
          options={users.map((user) => ({ value: user.id, label: user.nombre }))}
          placeholder="Todos los usuarios"
          className="filter-select"
        />
        <Input
          type="text"
          value={auditFilters.accion}
          onChange={(e) => setAuditFilters({ ...auditFilters, accion: e.target.value })}
          placeholder="Acción"
          className="filter-search"
        />
        <button className="button button-secondary button-small" onClick={() => {
          setAuditFilters({ fecha: '', usuario: '', accion: '' });
          setAuditPage(1);
        }}>
          Limpiar
        </button>
      </div>

      <Table
        headers={['Fecha', 'Usuario', 'Acción', 'Tabla', 'Detalles']}
        data={getFilteredAudits().slice((auditPage - 1) * AUDIT_PER_PAGE, auditPage * AUDIT_PER_PAGE)}
        renderRow={(item) => [
          <td key="fecha">{new Date(item.fecha).toLocaleString('es-AR')}</td>,
          <td key="usuario">{userMap[item.usuarioId] || item.usuarioId}</td>,
          <td key="accion">{item.accion}</td>,
          <td key="tabla">{item.tabla}</td>,
          <td key="detalles">{item.detalles?.descripcion || ''}</td>
        ]}
        className="audit-table"
      />

      <Pagination
        currentPage={auditPage}
        totalItems={getFilteredAudits().length}
        itemsPerPage={AUDIT_PER_PAGE}
        onPageChange={setAuditPage}
      />
    </>
  );
}
