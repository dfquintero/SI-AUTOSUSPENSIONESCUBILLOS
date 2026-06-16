import React from 'react';

export default function SectionHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`section-header ${className}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '20px' }}>
      <div>
        <h2 style={{ margin: 0 }}>{title}</h2>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
