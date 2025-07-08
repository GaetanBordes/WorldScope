import React, { useEffect, useState } from "react";
import CesiumMap from "../components/CesiumMap";
import "./MapPage.scss";

// Mapping entre valeur anglaise (base) et label français (affichage)
const EVENT_TYPES = [
  { value: "Battles", label: "Batailles" },
  { value: "Violence against civilians", label: "Violences contre les civils" },
];

const START_DATE = "2023-08-31";
const END_DATE = "2025-08-30";

// Hook utilitaire pour détecter mobile
function useMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 650);
  useEffect(() => {
    const f = () => setMobile(window.innerWidth < 650);
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);
  return mobile;
}

export default function MapPage() {
  const [incidents, setIncidents] = useState([]);
  const [filters, setFilters] = useState({
    type: "",
    start: START_DATE,
    end: END_DATE,
  });
  const [showPoints, setShowPoints] = useState(false);
  const [showMenuMobile, setShowMenuMobile] = useState(false);

  const isMobile = useMobile();

  // Chargement des incidents
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/acled-local?limit=10000`)
      .then(res => res.json())
      .then(({ data }) => {
        const formatted = data.map(evt => ({
          lat: +evt.latitude,
          lon: +evt.longitude,
          type: evt["event_type"] || evt["Type d'événement"] || evt.type,
          country: evt.country,
          date: evt.event_date,
        }));
        setIncidents(formatted);
      })
      .catch(console.error);
  }, []);

  function isDateInRange(date, start, end) {
    if (!date) return false;
    const d = date.split(" ")[0].includes("-") ? date : formatToIso(date);
    return d >= start && d <= end;
  }
  function formatToIso(str) {
    if (!str) return "";
    try {
      const [day, month, year] = str.split(" ");
      const m = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ].indexOf(month) + 1;
      return `${year}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    } catch {
      return str;
    }
  }

  const filteredIncidents = showPoints
    ? incidents.filter(evt =>
        (!filters.type || evt.type === filters.type) &&
        isDateInRange(evt.date, filters.start, filters.end)
      )
    : [];

  return (
    <div className="map-page">
      {/* BURGER mobile */}
      {isMobile && !showMenuMobile && (
        <button
          className="filter-burger"
          aria-label="Afficher les filtres"
          style={{
            position: "absolute", top: 20, left: 13, zIndex: 1601,
            background: "#223", border: "none", borderRadius: 4, padding: 8,
            display: "flex", flexDirection: "column", gap: 3
          }}
          onClick={() => setShowMenuMobile(true)}
        >
          <span style={{
            display: "block", width: 22, height: 3,
            background: "#fff", borderRadius: 2
          }}/>
          <span style={{
            display: "block", width: 22, height: 3,
            background: "#fff", borderRadius: 2
          }}/>
          <span style={{
            display: "block", width: 22, height: 3,
            background: "#fff", borderRadius: 2
          }}/>
        </button>
      )}

      {/* MENU FILTRES */}
      {(!isMobile || showMenuMobile) && (
        <div
          className="map-filter-menu compact"
          style={{
            position: "absolute", top: isMobile ? 15 : 14, left: isMobile ? 8 : 10,
            zIndex: 1600,
            minWidth: 180, maxWidth: 220,
            transition: "all 0.3s cubic-bezier(.4,.3,0,1.2)",
            ...(isMobile
              ? { boxShadow: "0 3px 16px 1px #111c", border: "1px solid #222" }
              : {})
          }}
        >
          {/* Label + croix sur la même ligne */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <label style={{ flex: 1, display: "flex", alignItems: "center" }}>
              <input
                type="checkbox"
                checked={showPoints}
                onChange={e => setShowPoints(e.target.checked)}
                style={{ marginRight: 5 }}
              />
              <b>Afficher les points</b>
            </label>
            {/* Croix visible seulement en mobile */}
            {isMobile && (
              <button
                className="menu-close-btn"
                aria-label="Fermer le menu"
                style={{
                  fontSize: "1.35em", color: "#fff", background: "transparent",
                  border: 0, cursor: "pointer", marginLeft: 5, marginTop: -1, padding: "0 2px"
                }}
                onClick={() => setShowMenuMobile(false)}
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
          <div style={{ margin: "9px 0" }}>
            <label>
              Du&nbsp;
              <input
                type="date"
                value={filters.start}
                min={START_DATE}
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
                max={END_DATE}
                disabled={!showPoints}
                onChange={e =>
                  setFilters(f => ({ ...f, end: e.target.value }))
                }
              />
            </label>
          </div>
        </div>
      )}
      <CesiumMap incidents={filteredIncidents} />
    </div>
  );
}
