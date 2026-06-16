import React, { useState } from 'react';

export default function PinModal({ visible, title, error, onClose, onConfirm }) {
  const [pin, setPin] = useState('');

  if (!visible) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(pin);
    setPin('');
  };

  return (
    <div className="modal-overlay pin-modal">
      <div className="modal-card">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              id="pin"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength="4"
              className="filter-search"
              placeholder="Ingrese su PIN (4 dígitos)"
              autoFocus
              style={{ width: '100%' }}
            />
            {error && <div className="form-error">{error}</div>}
            <div className="modal-actions">
              <button type="button" className="button button-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="button button-primary">
                Confirmar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}