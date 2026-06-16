import React, { useState } from 'react';
import InputTexto from '../atoms/InputTexto';
import ButtonBasico from '../atoms/ButtonBasico';

// Molécula: Formulario estructurado para añadir mecánicos a la base de datos
export default function FormularioMecanico({ onAgregar }) {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [especialidad, setEspecialidad] = useState('');

  // Generar código único para el mecánico
  const generarCodigoMecanico = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const codigo = `MEC-${String(random).padStart(4, '0')}`;
    return codigo;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    onAgregar({
      id: `mec-${Date.now()}`,
      codigo: generarCodigoMecanico(),
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      especialidad: especialidad.trim() || 'General',
      activo: true, // Por defecto siempre activos al crear
      creado_en: new Date().toISOString()
    });

    // Limpiar formulario tras añadir
    setNombre('');
    setTelefono('');
    setEspecialidad('');
  };

  return (
    <form onSubmit={handleSubmit} style={{
      backgroundColor: '#f5f5f7',
      padding: '20px',
      borderRadius: '12px',
      border: '1px solid #e5e5ea',
      marginBottom: '20px',
      textAlign: 'left'
    }}>
      <h4 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#1d1d1f' }}>Registrar Nuevo Mecánico</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <InputTexto 
          placeholder="Nombre completo" 
          value={nombre} 
          onChange={e => setNombre(e.target.value)} 
          required 
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <InputTexto 
            placeholder="Teléfono" 
            value={telefono} 
            onChange={e => setTelefono(e.target.value)} 
            required 
          />
          <InputTexto 
            placeholder="Especialidad (ej. Dirección)" 
            value={especialidad} 
            onChange={e => setEspecialidad(e.target.value)} 
          />
        </div>
      </div>
      <ButtonBasico type="submit" text="Guardar Mecánico" />
    </form>
  );
}