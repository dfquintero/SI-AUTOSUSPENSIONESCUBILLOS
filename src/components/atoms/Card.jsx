import React from 'react';

export default function Card({ children, className = '', style = {} }) {
  return (
    <div className={`card ${className}`} style={style}>
      <div className="card-body">
        {children}
      </div>
    </div>
  );
}
