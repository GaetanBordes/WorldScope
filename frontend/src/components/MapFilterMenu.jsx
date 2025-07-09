import React from "react";
import "./MapFilterMenu.scss";

// Types, sous-types et acteurs (labels + valeurs, en français)
const EVENT_TYPES = [
  { value: "Battles", label: "Batailles" },
  { value: "Riots", label: "Émeutes" },
  { value: "Protests", label: "Protestations" },
  { value: "Violence against civilians", label: "Violences contre les civils" }
];
const EVENT_SUBTYPES = [
  { value: "Violent demonstration", label: "Manifestation violente" },
  { value: "Protest with intervention", label: "Protestation avec intervention" },
  { value: "Peaceful protest", label: "Manifestation pacifique" },
  { value: "Looting/property destruction", label: "Pillage/destruction de biens" },
  { value: "Excessive force against protesters", label: "Force excessive contre les manifestants" },
  { value: "Arrests", label: "Arrestations" },
  { value: "Abduction/forced disappearance", label: "Enlèvement/disparition forcée" }
];
const ACTOR_TYPES = [
  { value: "State forces", label: "Forces de l'État" },
  { value: "Rebel group", label: "Groupe rebelle" },
  { value: "Civilians", label: "Civils" },
  { value: "Rioters", label: "Émeutiers" },
  { value: "Protesters", label: "Manifestants" }
];

export default function MapFilterMenu({
  showPoints, setShowPoints,
  filters, setFilters,
  onClose,
  isMobile = false
}) {
  return (
    <div className="map-filter-menu compact">
      {/* Entête */}
      <div className="filter-header-row">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={showPoints}
            onChange={e => setShowPoints(e.target.checked)}
          />
          <b>Afficher les points</b>
        </label>
        {isMobile && !!onClose && (
          <button
            className="menu-close-btn"
            aria-label="Fermer le menu"
            onClick={onClose}
            tabIndex={0}
          >&#10006;</button>
        )}
      </div>

      <select
        disabled={!showPoints}
        value={filters.type}
        onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
      >
        <option value="">Type d'événement (tous)</option>
        {EVENT_TYPES.map(type =>
          <option key={type.value} value={type.value}>{type.label}</option>
        )}
      </select>
      <select
        disabled={!showPoints}
        value={filters.subType}
        onChange={e => setFilters(f => ({ ...f, subType: e.target.value }))}
      >
        <option value="">Sous-type (tous)</option>
        {EVENT_SUBTYPES.map(sub =>
          <option key={sub.value} value={sub.value}>{sub.label}</option>
        )}
      </select>
      <select
        disabled={!showPoints}
        value={filters.actorType}
        onChange={e => setFilters(f => ({ ...f, actorType: e.target.value }))}
      >
        <option value="">Type d'acteur (tous)</option>
        {ACTOR_TYPES.map(a =>
          <option key={a.value} value={a.value}>{a.label}</option>
        )}
      </select>
      {/* Dates */}
      <div className="date-row">
        <label>
          Du&nbsp;
          <input
            type="date"
            value={filters.start}
            min="2023-08-31"
            max={filters.end}
            disabled={!showPoints}
            onChange={e =>
              setFilters(f => ({ ...f, start: e.target.value }))
            }
          />
        </label>
        <label>
          &nbsp;au&nbsp;
          <input
            type="date"
            value={filters.end}
            min={filters.start}
            max="2025-08-30"
            disabled={!showPoints}
            onChange={e =>
              setFilters(f => ({ ...f, end: e.target.value }))
            }
          />
        </label>
      </div>
    </div>
  );
}