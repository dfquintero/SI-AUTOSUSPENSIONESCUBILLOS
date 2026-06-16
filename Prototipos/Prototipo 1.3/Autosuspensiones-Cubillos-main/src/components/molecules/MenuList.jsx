import React from 'react';
import ButtonMenu from '../atoms/ButtonMenu';

// Molécula: Agrupación de los botones del menú con sus configuraciones básicas
export default function MenuList({ activeTab, setActiveTab }) {
  // Lista modular de opciones solicitadas
  const opciones = [
    { id: 'administrador', label: 'Administrador', icon: '👤' },
    { id: 'historico', label: 'Histórico de Placas', icon: '🚖' },
    { id: 'herramientas', label: 'Control Herramientas', icon: '🔧' },
    { id: 'repuestos', label: 'Stock Repuestos', icon: '📦' },
    { id: 'contabilidad', label: 'Contabilidad (Cuentas)', icon: '💰' },
  ];

  return (
    <nav style={{ width: '100%', marginTop: '20px' }}>
      {opciones.map((opt) => (
        <ButtonMenu
          key={opt.id}
          label={opt.label}
          icon={opt.icon}
          isActive={activeTab === opt.id}
          onClick={() => setActiveTab(opt.id)}
        />
      ))}
    </nav>
  );
}
