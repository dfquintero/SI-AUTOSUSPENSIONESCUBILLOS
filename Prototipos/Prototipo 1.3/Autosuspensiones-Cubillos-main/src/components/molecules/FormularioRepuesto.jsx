import React, { useState } from 'react';
import InputTexto from '../atoms/InputTexto';
import ButtonBasico from '../atoms/ButtonBasico';

// Molécula: Formulario estructurado para añadir un repuesto
export default function FormularioRepuesto({ onAgregar }) {
  const [nombre, setNombre] = useState('');
  const [stockActual, setStockActual] = useState('');
  const [stockMinimo, setStockMinimo] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim() || !stockActual) return;
    
    // Si no definen mínimo, por defecto es 5 según los requerimientos
    const minimoDefecto = stockMinimo ? parseInt(stockMinimo, 10) : 5;

    const nuevoRepuesto = {
      id: Date.now(),
      nombre: nombre.trim(),
      stock_actual: parseInt(stockActual, 10),
      stock_minimo: minimoDefecto
    };
    
    onAgregar(nuevoRepuesto);
    
    // Limpiar formulario tras añadir
    setNombre('');
    setStockActual('');
    setStockMinimo('');
  };

  return (
    <form onSubmit={handleSubmit} style={{
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '14px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      marginBottom: '20px',
      textAlign: 'left'
    }}>
      <h4 style={{ margin: '0 0 15px 0', color: '#1d1d1f', fontSize: '15px' }}>Añadir Nuevo Repuesto</h4>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <InputTexto 
          placeholder="Nombre del repuesto (ej: Amortiguador Gabriel)" 
          value={nombre} 
          onChange={e => setNombre(e.target.value)}
          required 
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <InputTexto 
            type="number" 
            min="0"
            placeholder="Stock Actual" 
            value={stockActual} 
            onChange={e => setStockActual(e.target.value)}
            required 
          />
          <InputTexto 
            type="number" 
            min="1"
            placeholder="Stock Mín. (Opc. Defecto: 5)" 
            value={stockMinimo} 
            onChange={e => setStockMinimo(e.target.value)}
          />
        </div>
      </div>
      
      <ButtonBasico type="submit" text="Guardar Repuesto" />
    </form>
  );
}