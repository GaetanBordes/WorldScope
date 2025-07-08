import React from "react";
import "./MapFilterMenu.scss";

// Les valeurs de l'API en anglais, labels en français pour l'UI si tu veux
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
  onClose, // permet de fermer le menu mobile si tu veux
  isMobile = false
}) {
  return (
    <div className="map-filter-menu compact">
      {/* Header ligne: label + croix mobile */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 3 }}>
        <label style={{ flex: 1, marginBottom: 0 }}>
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
            style={{
              fontSize: "1.3em",
              background: "transparent",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              marginLeft: 7,
              padding: 0,
              lineHeight: 1
            }}
            tabIndex={0}
          >&#10006;</button>
        )}
      </div>

      <select
        disabled={!showPoints}
        value={filters.type}
        onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
        style={{ width: "100%", maxWidth: "100%" }}
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
        style={{ width: "100%", maxWidth: "100%" }}
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
        style={{ width: "100%", maxWidth: "100%" }}
      >
        <option value="">Type d'acteur (tous)</option>
        {ACTOR_TYPES.map(a =>
          <option key={a.value} value={a.value}>{a.label}</option>
        )}
      </select>
      {/* Dates */}
      <div style={{ margin: "9px 0" }}>
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
