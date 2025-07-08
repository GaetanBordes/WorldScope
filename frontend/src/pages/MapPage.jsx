import React, { useEffect, useState } from "react";
import CesiumMap from "../components/CesiumMap";
import "./MapPage.scss";

// Listes fixes pour filtres (adaptables)
const EVENT_TYPES = [
  "Batailles",
  "Émeutes",
  "Protestations",
  "Violences contre les civils",
];
const EVENT_SUBTYPES = [
  "Manifestation violente",
  "Protestation avec intervention",
  "Manifestation pacifique",
  "Pillage/destruction de biens",
  "Force excessive contre les manifestants",
  "Arrestations",
  "Enlèvement/disparition forcée",
];
const ACTOR_TYPES = [
  "Forces de l'État",
  "Groupe rebelle",
  "Civils",
  "Émeutiers",
  "Manifestants",
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
    subType: "",
    actorType: "",
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
          type: evt["Type d'événement"] || evt.event_type,
          subType: evt["Sous-type d'événement"] || evt.sub_type,
          actorType: evt["Type d'acteur"] || evt.actor_type,
          actor: evt["Acteur"] || evt.actor,
          country: evt.country,
          date: evt.event_date, // format "2024-05-19" ou "31 August 2023"
        }));
        setIncidents(formatted);
      })
      .catch(console.error);
  }, []);

  // Utilitaires pour dates
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

  // Filtrage incidents (seulement si showPoints)
  const filteredIncidents = showPoints
    ? incidents.filter(evt =>
        (!filters.type || evt.type === filters.type) &&
        (!filters.subType || evt.subType === filters.subType) &&
        (!filters.actorType || evt.actorType === filters.actorType) &&
        isDateInRange(evt.date, filters.start, filters.end)
      )
    : [];

  // ---- JSX ----
  return (
    <div className="map-page">
      {/* BOUTON BURGER MOBILE */}
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
          {/* HEADER ligne: checkbox + texte + CROIX (mobile) */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: 3 }}>
            <label style={{ flex: 1, marginBottom: 0 }}>
              <input
                type="checkbox"
                checked={showPoints}
                onChange={e => setShowPoints(e.target.checked)}
              />
              <b>Afficher les points</b>
            </label>
            {isMobile && showMenuMobile && (
              <button
                className="menu-close-btn"
                aria-label="Fermer le menu"
                onClick={() => setShowMenuMobile(false)}
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
              <option key={type} value={type}>{type}</option>
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
              <option key={sub} value={sub}>{sub}</option>
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
              <option key={a} value={a}>{a}</option>
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

      {/* LA CARTE */}
      <CesiumMap incidents={filteredIncidents} />
    </div>
  );
}
