import React from 'react';

export default function ModalForm({ visible, title, children, onClose, onSubmit, submitLabel = 'Guardar' }) {
  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <form onSubmit={(e) => { e.preventDefault(); }}>
            {children}
            <div className="modal-actions">
              <button type="button" className="button button-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="button" className="button button-primary" onClick={onSubmit}>
                {submitLabel}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}