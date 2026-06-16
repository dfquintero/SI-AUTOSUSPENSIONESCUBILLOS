import React, { useState } from 'react';
import ModalForm from './ModalForm';
import Input from '../atoms/Input';
import { getDb, select } from '../../services/storage.js';

const DEVELOPERS = [
  'Santiago Zamora',
  'Cristian Cubillos',
  'Diego Quintero',
  'Gabriel Puentes',
  'Rodrigo Rivera'
];

const SUPERUSER_CODE = '311449'; // This should be stored securely in a real app

export default function AppInfoModal({ visible, onClose }) {
  const [superuserInput, setSuperuserInput] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [error, setError] = useState('');

  const handleSuperuserSubmit = () => {
    if (superuserInput === SUPERUSER_CODE) {
      // Get the admin PIN from the new database structure
      const db = getDb();
      const adminUsers = select(db, 'users', { rol: 'admin', activo: true });
      if (adminUsers.length > 0) {
        setAdminCode(adminUsers[0].pin);
        setError('');
      } else {
        setError('No hay administrador activo');
      }
    } else {
      setError('Código incorrecto');
      setAdminCode('');
    }
  };

  return (
    <ModalForm
      visible={visible}
      onClose={onClose}
      title="Información de la Aplicación"
      onSave={null}
      showSaveButton={false}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem' }}>Autosuspensiones Cubillos</h3>
          <p style={{ margin: 0, color: '#64748b' }}>Versión 1.0.0</p>
        </div>

        <div>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem' }}>Desarrolladores</h4>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#475569' }}>
            {DEVELOPERS.map((dev, index) => (
              <li key={index}>{dev}</li>
            ))}
          </ul>
        </div>

        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem' }}>Acceso Superusuario</h4>
          <p style={{ margin: '0 0 12px', fontSize: '0.9rem', color: '#64748b' }}>
            Ingrese el código de superusuario para ver el PIN del administrador
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Input
              type="password"
              placeholder="Código de 6 dígitos"
              value={superuserInput}
              onChange={(e) => setSuperuserInput(e.target.value)}
              maxLength="6"
              style={{ flex: 1 }}
            />
            <button 
              className="button button-primary button-small"
              onClick={handleSuperuserSubmit}
            >
              Acceder
            </button>
          </div>
          {error && <div style={{ color: '#b91c1c', marginTop: '8px', fontSize: '0.9rem' }}>{error}</div>}
          {adminCode && (
            <div style={{ marginTop: '12px', padding: '12px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #22c55e' }}>
              <strong style={{ color: '#15803d' }}>PIN del Administrador:</strong>
              <span style={{ marginLeft: '8px', fontSize: '1.2rem', fontWeight: '700', color: '#15803d' }}>{adminCode}</span>
            </div>
          )}
        </div>
      </div>
    </ModalForm>
  );
}
