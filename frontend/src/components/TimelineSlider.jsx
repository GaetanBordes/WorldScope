import React from 'react';
import './TimelineSlider.scss';

export default function TimelineSlider({
  days,
  maxDays,
  onDaysChange,
  markerLimit,
  onMarkerLimitChange,
  types,
  selectedTypes,
  onToggleType,
  isOpen,
  onToggleOpen,
}) {
  return (
    <div className={`timeline-container ${isOpen ? 'open' : ''}`}>
      <button
        className="timeline-toggle"
        onClick={onToggleOpen}
        aria-label={isOpen ? 'Fermer filtres' : 'Ouvrir filtres'}
      >
        {isOpen ? '◄' : '►'}
      </button>

      <div className="timeline-controls">
        <label>
          Incidents (derniers {days}jours)
          <input
            type="range"
            min="1"
            max={maxDays}
            value={days}
            onChange={e => onDaysChange(+e.target.value)}
          />
        </label>

        <label>
          Max marqueurs
          <input
            type="number"
            min="50"
            max="2000"
            step="50"
            value={markerLimit}
            onChange={e => onMarkerLimitChange(+e.target.value)}
          />
        </label>

        <div className="checkbox-grid">
          {types.map(typeName => (
            <label key={typeName}>
              <input
                type="checkbox"
                checked={selectedTypes[typeName]}
                onChange={() => onToggleType(typeName)}
              />
              {typeName}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
