import React, { useState } from 'react';
import InputTexto from '../atoms/InputTexto';
import ButtonBasico from '../atoms/ButtonBasico';

// Molécula: Formulario estructurado para añadir herramientas
export default function FormularioHerramienta({ onAgregar }) {
  const [nombre, setNombre] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    onAgregar({
      id: `herr-${Date.now()}`,
      nombre: nombre.trim(),
      en_uso: false,
      mecanico_codigo: null,
      mecanico_nombre: null,
      actualizado_en: null
    });

    // Limpiar formulario tras añadir
    setNombre('');
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
      <h4 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#1d1d1f' }}>Registrar Nueva Herramienta</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <InputTexto 
          placeholder="Nombre de la herramienta (ej. Llave inglesa, Destornillador, Taladro)" 
          value={nombre} 
          onChange={e => setNombre(e.target.value)} 
          required 
        />
      </div>
      <ButtonBasico type="submit" text="Agregar Herramienta" />
    </form>
  );
}
