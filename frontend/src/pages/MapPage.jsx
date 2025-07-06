import React, { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MapPage.scss';

const TYPE_COLORS = {
  Battles: '#f1c40f',
  'Explosions/Remote violence': '#e74c3c',
  'Armed clash': '#2c3e50',
  default: '#95a5a6'
};

const FILTER_TYPES = ['Battles', 'Explosions/Remote violence', 'Armed clash'];

function ZoomButtons() {
  const map = useMap();
  return (
    <div className="zoom-buttons">
      <button onClick={() => map.zoomIn()}>＋</button>
      <button onClick={() => map.zoomOut()}>－</button>
    </div>
  );
}

export default function MapPage() {
  const [incidents, setIncidents] = useState([]);
  const [markerLimit, setMarkerLimit] = useState(5000);
  const [selectedTypes, setSelectedTypes] = useState({
    Battles: true,
    'Explosions/Remote violence': true,
    'Armed clash': true
  });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/acled-local?limit=${markerLimit}`)
      .then(res => res.json())
      .then(({ data }) => {
        const filtered = data
          .filter(evt =>
            FILTER_TYPES.includes(evt.event_type) &&
            evt.latitude && evt.longitude
          )
          .map(evt => ({
            lat: +evt.latitude,
            lon: +evt.longitude,
            type: evt.event_type,
            country: evt.country,
            date: evt.event_date
          }));
        setIncidents(filtered);
      })
      .catch(console.error);
  }, [markerLimit]);

  const visibleIncidents = incidents.filter(i => selectedTypes[i.type]);

  return (
    <div className="map-page">
      {/* 🛠️ Contrôles */}
      <div className="map-controls-container">
        <div className="map-controls">
          <div>
            <label className="limit-label">
              Max marqueurs :
              <input
                type="number"
                min={100}
                step={100}
                value={markerLimit}
                onChange={e => setMarkerLimit(+e.target.value)}
              />
            </label>
          </div>

          <div>
            <strong>Types affichés :</strong>
            <div className="checkbox-grid">
              {FILTER_TYPES.map(type => (
                <label key={type}>
                  <input
                    type="checkbox"
                    checked={selectedTypes[type]}
                    onChange={() =>
                      setSelectedTypes(prev => ({
                        ...prev,
                        [type]: !prev[type]
                      }))
                    }
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 🌍 Carte */}
      <MapContainer
        center={[20, 0]}
        zoom={2}
        zoomControl={false}
        className="leaflet-container"
        style={{ height: '100vh', width: '100%' }}
        maxBounds={[[-90, -180], [90, 180]]}
        maxBoundsViscosity={1.0}
        worldCopyJump={false}
      >
        <ZoomButtons />

        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
        />

        {visibleIncidents.map((evt, idx) => (
          <CircleMarker
            key={idx}
            center={[evt.lat, evt.lon]}
            radius={5}
            color={TYPE_COLORS[evt.type] || TYPE_COLORS.default}
            fillOpacity={0.6}
          >
            <Popup>
              <strong>{evt.type}</strong><br />
              {evt.country}<br />
              {new Date(evt.date).toLocaleDateString('fr-FR')}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* 🔎 Légende */}
      <div className="map-legend">
        <div className="legend-item battles">
          <span className="legend-dot type-battles" /> Battles
        </div>
        <div className="legend-item explosions">
          <span className="legend-dot type-explosions" /> Explosions/Remote violence
        </div>
        <div className="legend-item armedclash">
          <span className="legend-dot type-armedclash" /> Armed clash
        </div>
      </div>
    </div>
  );
}
