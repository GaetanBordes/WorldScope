import React from 'react';
import './Legend.scss';

const legendItems = [
  { label: 'Battles', color: '#f1c40f' }, // Jaune
  { label: 'Explosions/Remote violence', color: '#e74c3c' }, // Rouge
  { label: 'Armed clash', color: '#2c3e50' } // Noir
];

export default function Legend() {
  return (
    <div className="map-legend">
      {legendItems.map(({ label, color }) => (
        <div key={label} className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: color }} />
          {label}
        </div>
      ))}
    </div>
  );
}
