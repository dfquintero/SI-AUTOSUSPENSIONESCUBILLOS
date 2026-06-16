import React, { useState } from 'react';
import InputTexto from '../atoms/InputTexto';
import ButtonBasico from '../atoms/ButtonBasico';
import SelectBasico from '../atoms/SelectBasico';

// Molécula: Formulario para ingresar un vehículo nuevo, su propietario y signarle un nuevo trabajo/tarea
export default function FormularioVehiculoTrabajo({ mecanicos, onAgregarVehiculoTrabajo }) {
  const [placa, setPlaca] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [anio, setAnio] = useState('');
  const [propietario, setPropietario] = useState('');
  
  const [descripcionTrabajo, setDescripcionTrabajo] = useState('');
  const [mecanicoId, setMecanicoId] = useState('');

  const mecanicosActivos = mecanicos
    .filter(m => m.activo)
    .map(m => ({ value: m.id, label: m.nombre + ' (' + m.especialidad + ')' }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!placa.trim() || !descripcionTrabajo.trim() || !mecanicoId) return;

    // Buscar al mecánico seleccionado para guardar su referencia en el trabajo
    const mecanicoSelec = mecanicos.find(m => m.id === mecanicoId);

    // Construir estructura anidada con Vehículo -> Propietario -> Trabajos -> Mecánico
    const nuevoVehiculo = {
      id: `veh-${Date.now()}`,
      placa: placa.toUpperCase().trim(),
      marca: marca.trim(),
      modelo: modelo.trim(),
      anio: parseInt(anio, 10) || new Date().getFullYear(),
      propietario: { 
        id: `prop-${Date.now()}`, 
        nombre: propietario.trim() || 'Sin registrar' 
      },
      trabajos: [
        {
          id: `trab-${Date.now()}`,
          fecha_inicio: new Date().toISOString().split('T')[0],
          descripcion: descripcionTrabajo.trim(),
          mecanico: { nombre: mecanicoSelec.nombre }
        }
      ]
    };

    onAgregarVehiculoTrabajo(nuevoVehiculo);

    // Limpiar campos
    setPlaca(''); setMarca(''); setModelo(''); setAnio(''); setPropietario('');
    setDescripcionTrabajo(''); setMecanicoId('');
  };

  return (
    <form onSubmit={handleSubmit} style={{
      backgroundColor: '#f1f4f9',
      padding: '20px',
      borderRadius: '12px',
      border: '1px solid #d1d9e6',
      marginBottom: '20px',
      textAlign: 'left'
    }}>
      <h4 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#1d1d1f' }}>Ingresar Vehículo y Asignar Trabajo</h4>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
        <InputTexto placeholder="Placa (Ej. AAA-123)" value={placa} onChange={e => setPlaca(e.target.value)} required />
        <InputTexto placeholder="Nombre del Propietario" value={propietario} onChange={e => setPropietario(e.target.value)} required />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '16px' }}>
        <InputTexto placeholder="Marca" value={marca} onChange={e => setMarca(e.target.value)} />
        <InputTexto placeholder="Modelo" value={modelo} onChange={e => setModelo(e.target.value)} />
        <InputTexto type="number" placeholder="Año" value={anio} onChange={e => setAnio(e.target.value)} />
      </div>

      <div style={{ borderTop: '1px solid #d1d9e6', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h5 style={{ margin: '0', fontSize: '14px', color: '#1d1d1f' }}>Asignación Operativa</h5>
        <InputTexto placeholder="Descripción del Trabajo a realizar" value={descripcionTrabajo} onChange={e => setDescripcionTrabajo(e.target.value)} required />
        <SelectBasico 
          value={mecanicoId} 
          onChange={e => setMecanicoId(e.target.value)} 
          options={mecanicosActivos} 
          placeholder="Seleccionar Mecánico encargado..." 
          required 
        />
      </div>

      <ButtonBasico type="submit" text="Guardar Vehículo e Iniciar Trabajo" />
    </form>
  );
}