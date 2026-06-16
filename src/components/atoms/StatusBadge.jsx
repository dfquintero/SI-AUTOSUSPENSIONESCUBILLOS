import React from 'react';

export default function StatusBadge({ status, variant = 'default' }) {
  const getStatusClass = () => {
    switch (variant) {
      case 'success':
        return 'badge-success';
      case 'warning':
        return 'badge-warning';
      case 'danger':
        return 'badge-danger';
      default:
        return 'badge';
    }
  };

  return (
    <span className={`badge ${getStatusClass()}`}>
      {status}
    </span>
  );
}
