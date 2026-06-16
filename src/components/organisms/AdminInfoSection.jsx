import React from 'react';

export default function AdminInfoSection({ lastExportTime, onExport, onImport, importMessage }) {
  return (
    <>
      <h2>Gestión de información</h2>
      <p className="section-subtitle">Backup y restauración de datos del sistema.</p>

      <div className="backup-info">
        <strong>Último Backup:</strong>
        <span>{lastExportTime ? lastExportTime.toLocaleString('es-AR') : 'No se ha realizado ningún backup'}</span>
      </div>

      <div className="backup-actions">
        <button className="button button-primary" onClick={onExport}>
          <span>📥</span> Exportar datos
        </button>
        <div className="file-upload">
          <button className="button button-secondary" onClick={() => document.getElementById('import-file').click()}>
            <span>📤</span> Importar JSON
          </button>
          <input
            id="import-file"
            type="file"
            accept=".json"
            onChange={onImport}
          />
        </div>
      </div>

      {importMessage && (
        <div className="alert alert-info">
          {importMessage}
        </div>
      )}
    </>
  );
}
