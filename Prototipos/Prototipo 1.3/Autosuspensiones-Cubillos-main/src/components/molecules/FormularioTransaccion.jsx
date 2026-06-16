import React, { useState } from 'react';
import InputTexto from '../atoms/InputTexto';
import SelectBasico from '../atoms/SelectBasico';
import ButtonBasico from '../atoms/ButtonBasico';

// Molécula: Formulario para agregar ingresos o gastos
export default function FormularioTransaccion({ onAgregar }) {
  const [tipo, setTipo] = useState('ingreso');
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!descripcion.trim() || !monto.trim()) {
      alert('⚠️ Por favor completa todos los campos');
      return;
    }

    const montoNum = parseFloat(monto);
    if (isNaN(montoNum) || montoNum <= 0) {
      alert('⚠️ El monto debe ser un número válido y mayor a 0');
      return;
    }

    if (tipo === 'ingreso') {
      onAgregar({
        id: `pago-${Date.now()}`,
        monto: montoNum,
        notas: descripcion.trim(),
        fecha: fecha,
        metodo: 'Manual'
      }, 'ingreso');
    } else {
      onAgregar({
        id: `gasto-${Date.now()}`,
        monto: montoNum,
        descripcion: descripcion.trim(),
        fecha: fecha,
        tipo: 'OTRO'
      }, 'egreso');
    }

    // Limpiar formulario
    setDescripcion('');
    setMonto('');
    setFecha(new Date().toISOString().split('T')[0]);
    setTipo('ingreso');
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
      <h4 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#1d1d1f' }}>Registrar Transacción</h4>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <SelectBasico 
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            options={[
              { value: 'ingreso', label: '📥 Ingreso' },
              { value: 'egreso', label: '📤 Egreso' }
            ]}
            style={{ flex: 1 }}
          />
          <InputTexto 
            type="date"
            value={fecha}
            onChange={e => setFecha(e.target.value)}
            style={{ flex: 1 }}
          />
        </div>

        <InputTexto 
          placeholder={tipo === 'ingreso' ? 'Concepto del ingreso (ej. Pago de reparación)' : 'Concepto del gasto (ej. Compra de repuestos)'}
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
        />

        <InputTexto 
          type="number"
          placeholder="Monto ($)"
          value={monto}
          onChange={e => setMonto(e.target.value)}
          min="1"
          step="100"
        />
      </div>

      <ButtonBasico type="submit" text={`Agregar ${tipo === 'ingreso' ? 'Ingreso' : 'Gasto'}`} />
    </form>
  );
}
