import React from 'react';
import ModalForm from './ModalForm';
import Input from '../atoms/Input';
import Select from '../atoms/Select';
import FormGrid from '../atoms/FormGrid';

const CATEGORIAS_HERRAMIENTAS = ['Manuales', 'Eléctricas', 'Neumáticas', 'Equipos', 'Medición', 'Corte', 'Otras'];

export default function ToolModal({ visible, onClose, onSubmit, tool, isEditing, onDelete }) {
  const [form, setForm] = React.useState({ nombre: '', cantidad: '', descripcion: '', categoria: 'Manuales', imagen: null });
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (tool) {
      setForm({ nombre: tool.nombre, cantidad: tool.cantidad, descripcion: tool.descripcion, categoria: tool.categoria, imagen: tool.imagen });
    } else {
      setForm({ nombre: '', cantidad: '', descripcion: '', categoria: 'Manuales', imagen: null });
    }
    setError('');
  }, [tool, visible]);

  const handleSave = () => {
    if (!form.nombre.trim()) {
      setError('Ingrese el nombre de la herramienta');
      return;
    }
    if (!form.cantidad || form.cantidad < 0) {
      setError('Ingrese una cantidad válida');
      return;
    }
    onSubmit(form);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({ ...form, imagen: file });
    }
  };

  return (
    <ModalForm
      visible={visible}
      onClose={onClose}
      title={isEditing ? 'Editar herramienta' : 'Nueva herramienta'}
      onSubmit={handleSave}
      onDelete={isEditing ? onDelete : null}
    >
      <FormGrid>
        <Input
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          style={{ gridColumn: '1 / -1' }}
        />
        <Input
          type="number"
          placeholder="Cantidad"
          value={form.cantidad}
          onChange={(e) => setForm({ ...form, cantidad: e.target.value })}
          min="0"
        />
        <Select
          value={form.categoria}
          onChange={(e) => setForm({ ...form, categoria: e.target.value })}
          options={CATEGORIAS_HERRAMIENTAS.map(cat => ({ value: cat, label: cat }))}
        />
        <Input
          placeholder="Descripción"
          value={form.descripcion}
          onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          style={{ gridColumn: '1 / -1' }}
        />
        <div style={{ gridColumn: '1 / -1' }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ width: '100%' }}
          />
          {form.imagen && (
            <div style={{ marginTop: '12px', width: '100%', maxWidth: '300px' }}>
              <img
                src={form.imagen instanceof File ? URL.createObjectURL(form.imagen) : form.imagen}
                alt="Preview"
                style={{ width: '100%', borderRadius: '8px', objectFit: 'cover' }}
              />
            </div>
          )}
        </div>
      </FormGrid>
      {error && <div style={{ color: '#b91c1c', fontWeight: '700', marginTop: '12px' }}>{error}</div>}
    </ModalForm>
  );
}
