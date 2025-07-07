import React, { useEffect, useState } from "react";
import CesiumMap from "../components/CesiumMap";
import "./MapPage.scss";

const FILTER_TYPES = ['Battles', 'Explosions/Remote violence', 'Armed clash'];

export default function MapPage() {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/acled-local?limit=5000`)
      .then((res) => res.json())
      .then(({ data }) => {
        const filtered = data
          .filter(
            (evt) =>
              FILTER_TYPES.includes(evt.event_type) &&
              evt.latitude &&
              evt.longitude
          )
          .map((evt) => ({
            lat: +evt.latitude,
            lon: +evt.longitude,
            type: evt.event_type,
            country: evt.country,
            date: evt.event_date,
          }));
        setIncidents(filtered);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="map-page">
      <CesiumMap incidents={incidents} />
    </div>
  );
}
