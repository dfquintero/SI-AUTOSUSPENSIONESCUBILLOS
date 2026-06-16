import React from 'react';
import ModalForm from './ModalForm';
import Input from '../atoms/Input';
import Select from '../atoms/Select';
import FormGrid from '../atoms/FormGrid';

const ROLES = [
  { id: 'admin', label: 'Administrador', description: 'Acceso completo a todas las funciones del sistema' },
  { id: 'mecanico', label: 'Mecánico', description: 'Gestión de tareas, herramientas y repuestos' },
  { id: 'usuario', label: 'Usuario', description: 'Solo lectura de información del sistema' },
];

const validatePin = (pin) => /^[0-9]{4}$/.test(pin);

export default function UserModal({ visible, onClose, onSubmit, user, isEditing }) {
  const [form, setForm] = React.useState({ nombre: '', pin: '', rol: 'mecanico' });
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (user) {
      setForm({ nombre: user.nombre, pin: user.pin, rol: user.rol });
    } else {
      setForm({ nombre: '', pin: '', rol: 'mecanico' });
    }
    setError('');
  }, [user, visible]);

  const handleSave = () => {
    if (!validatePin(form.pin)) {
      setError('El PIN debe tener 4 dígitos numéricos');
      return;
    }
    if (!form.nombre.trim()) {
      setError('Ingrese el nombre del usuario');
      return;
    }
    onSubmit(form);
  };

  return (
    <ModalForm
      visible={visible}
      onClose={onClose}
      title={isEditing ? 'Editar usuario' : 'Crear usuario'}
      onSubmit={handleSave}
    >
      <FormGrid>
        <Input
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          style={{ gridColumn: '1 / -1' }}
        />
        <Input
          type="password"
          placeholder="PIN de 4 dígitos"
          value={form.pin}
          onChange={(e) => setForm({ ...form, pin: e.target.value })}
          maxLength="4"
        />
        <Select
          value={form.rol}
          onChange={(e) => setForm({ ...form, rol: e.target.value })}
          options={ROLES}
        />
      </FormGrid>
      {error && <div style={{ color: '#b91c1c', fontWeight: '700', marginTop: '12px' }}>{error}</div>}
      {!isEditing && (
        <div style={{ marginTop: '6px', fontSize: '0.85rem', color: '#64748b', lineHeight: '1.4' }}>
          {ROLES.find(r => r.id === form.rol)?.description}
        </div>
      )}
    </ModalForm>
  );
}
