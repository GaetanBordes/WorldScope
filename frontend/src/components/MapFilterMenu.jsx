import "./MapFilterMenu.scss";

export default function MapFilterMenu({
  showPoints, setShowPoints,
  filters, setFilters,
  options,
}) {
  return (
    <div className="map-filter-menu compact">
      <label>
        <input
          type="checkbox"
          checked={showPoints}
          onChange={e => setShowPoints(e.target.checked)}
        />
        <b>Afficher les points</b>
      </label>
      <select
        disabled={!showPoints}
        value={filters.type}
        onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
      >
        <option value="">Type d'événement (tous)</option>
        {options.types.map(type =>
          <option key={type} value={type}>{type}</option>
        )}
      </select>
      <select
        disabled={!showPoints}
        value={filters.subType}
        onChange={e => setFilters(f => ({ ...f, subType: e.target.value }))}
      >
        <option value="">Sous-type (tous)</option>
        {options.subTypes.map(subType =>
          <option key={subType} value={subType}>{subType}</option>
        )}
      </select>
      <select
        disabled={!showPoints}
        value={filters.actor}
        onChange={e => setFilters(f => ({ ...f, actor: e.target.value }))}
      >
        <option value="">Type d'acteur (tous)</option>
        {options.actors.map(actor =>
          <option key={actor} value={actor}>{actor}</option>
        )}
      </select>
      <label>Du</label>
      <input
        disabled={!showPoints}
        type="date"
        value={filters.dateMin}
        min="2023-08-31"
        max="2025-08-30"
        onChange={e => setFilters(f => ({ ...f, dateMin: e.target.value }))}
      />
      <label>au</label>
      <input
        disabled={!showPoints}
        type="date"
        value={filters.dateMax}
        min="2023-08-31"
        max="2025-08-30"
        onChange={e => setFilters(f => ({ ...f, dateMax: e.target.value }))}
      />
    </div>
  );
}
