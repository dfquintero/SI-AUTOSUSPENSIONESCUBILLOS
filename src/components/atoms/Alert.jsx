import React from 'react';

export default function Alert({ children, variant = 'info', className = '' }) {
  const getVariantClass = () => {
    switch (variant) {
      case 'warning':
        return 'alert-warning';
      case 'error':
        return 'alert-warning';
      case 'success':
        return 'alert-info';
      default:
        return 'alert-info';
    }
  };

  return (
    <div className={`alert ${getVariantClass()} ${className}`}>
      {children}
    </div>
  );
}
