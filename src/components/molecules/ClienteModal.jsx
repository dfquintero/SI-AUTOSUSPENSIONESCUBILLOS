import React from 'react';
import ModalForm from './ModalForm';
import Input from '../atoms/Input';
import FormGrid from '../atoms/FormGrid';

export default function ClienteModal({ visible, onClose, onSubmit, cliente, isEditing, onDelete }) {
  const [form, setForm] = React.useState({ placa: '', marca: '', modelo: '', anio: '', nombre: '', telefono: '' });
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (cliente) {
      setForm({ placa: cliente.placa, marca: cliente.marca || '', modelo: cliente.modelo || '', anio: cliente.anio || '', nombre: cliente.nombre, telefono: cliente.telefono || '' });
    } else {
      setForm({ placa: '', marca: '', modelo: '', anio: '', nombre: '', telefono: '' });
    }
    setError('');
  }, [cliente, visible]);

  const handleSave = () => {
    if (!form.placa.trim()) {
      setError('Ingrese la placa del vehículo');
      return;
    }
    if (!form.nombre.trim()) {
      setError('Ingrese el nombre del cliente');
      return;
    }
    onSubmit(form);
  };

  return (
    <ModalForm
      visible={visible}
      onClose={onClose}
      title={isEditing ? 'Editar cliente' : 'Nuevo cliente'}
      onSubmit={handleSave}
      onDelete={isEditing ? onDelete : null}
    >
      <FormGrid>
        <Input
          placeholder="Placa"
          value={form.placa}
          onChange={(e) => setForm({ ...form, placa: e.target.value })}
        />
        <Input
          placeholder="Marca"
          value={form.marca}
          onChange={(e) => setForm({ ...form, marca: e.target.value })}
        />
        <Input
          placeholder="Modelo"
          value={form.modelo}
          onChange={(e) => setForm({ ...form, modelo: e.target.value })}
        />
        <Input
          placeholder="Año"
          value={form.anio}
          onChange={(e) => setForm({ ...form, anio: e.target.value })}
        />
        <Input
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          style={{ gridColumn: '1 / -1' }}
        />
        <Input
          placeholder="Teléfono"
          value={form.telefono}
          onChange={(e) => setForm({ ...form, telefono: e.target.value })}
          style={{ gridColumn: '1 / -1' }}
        />
      </FormGrid>
      {error && <div style={{ color: '#b91c1c', fontWeight: '700', marginTop: '12px' }}>{error}</div>}
    </ModalForm>
  );
}
