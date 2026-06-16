import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange, itemsPerPage, totalItems }) {
  const totalPagesCount = totalPages || Math.ceil(totalItems / itemsPerPage);
  
  if (totalPagesCount <= 1) return null;

  return (
    <div className="pagination">
      <button
        className="button button-secondary button-small"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Anterior
      </button>
      <span>Página {currentPage} de {totalPagesCount}</span>
      <button
        className="button button-secondary button-small"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPagesCount}
      >
        Siguiente
      </button>
    </div>
  );
}
