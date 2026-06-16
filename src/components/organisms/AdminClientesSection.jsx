import React from 'react';
import Table from '../atoms/Table';

export default function AdminClientesSection({ clientes, onAddCliente, onEditCliente, onDeleteCliente }) {
  return (
    <>
      <div className="section-header">
        <h2>Clientes</h2>
        <button className="button button-primary" onClick={onAddCliente}>
          Nuevo cliente
        </button>
      </div>
      <Table
        headers={['Placa', 'Marca', 'Modelo', 'Año', 'Nombre', 'Teléfono', 'Acciones']}
        data={clientes}
        renderRow={(cliente) => [
          <td key="placa">{cliente.placa}</td>,
          <td key="marca">{cliente.marca || '-'}</td>,
          <td key="modelo">{cliente.modelo || '-'}</td>,
          <td key="anio">{cliente.anio || '-'}</td>,
          <td key="nombre">{cliente.nombre}</td>,
          <td key="telefono">{cliente.telefono || '-'}</td>,
          <td key="acciones">
            <button className="button button-secondary button-small" onClick={() => onEditCliente(cliente)}>
              Editar
            </button>
            <button className="button button-danger button-small" onClick={() => onDeleteCliente(cliente.id)}>
              Eliminar
            </button>
          </td>
        ]}
      />
    </>
  );
}
