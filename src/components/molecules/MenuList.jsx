import React from 'react';
import ButtonMenu from '../atoms/ButtonMenu';

export default function MenuList({ activeTab, setActiveTab }) {
  const opciones = [
    { id: 'administrador', label: 'Administrador', icon: 'admin-panel-settings' },
    { id: 'historico', label: 'Histórico de Placas', icon: 'directions-car' },
    { id: 'herramientas', label: 'Control Herramientas', icon: 'build' },
    { id: 'repuestos', label: 'Stock Repuestos', icon: 'inventory-2' },
    { id: 'contabilidad', label: 'Contabilidad (Cuentas)', icon: 'payments' },
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