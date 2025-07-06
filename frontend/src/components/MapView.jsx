import React, { useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import './MapView.scss';

export default function MapView({
  center = [0, 20],
  zoom = 2,
  countries,
  incidents,
}) {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center,
      zoom,
      attributionControl: false,
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-left');

    map.current.on('load', () => {
      if (countries) addCountries(countries);
      if (incidents) addIncidents(incidents);
    });
  }, []);

  useEffect(() => {
    if (map.current?.isStyleLoaded() && countries) {
      addCountries(countries);
    }
  }, [countries]);

  useEffect(() => {
    if (map.current?.isStyleLoaded() && incidents) {
      addIncidents(incidents);
    }
  }, [incidents]);

  function addCountries(data) {
    const m = map.current;
    if (!m.getSource('countries')) {
      m.addSource('countries', { type: 'geojson', data });
      m.addLayer({
        id: 'country-points',
        type: 'circle',
        source: 'countries',
        paint: {
          'circle-radius': 4,
          'circle-color': '#3498db',
        },
      });
    } else {
      m.getSource('countries').setData(data);
    }
  }

  function addIncidents(data) {
    const m = map.current;

    // Préparation du GeoJSON
    const geojson = {
      type: 'FeatureCollection',
      features: data.map((d, i) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [d.longitude, d.latitude],
        },
        properties: {
          id: i,
          country: d.country,
          date: d.date,
          type: d.type
        }
      }))
    };

    // Couleurs personnalisées par type d'événement
    const TYPE_COLORS = {
      Battles: '#f1c40f',                     // Jaune
      'Explosions/Remote violence': '#e74c3c', // Rouge
      'Armed clash': '#2c3e50',               // Noir
    };

    if (!m.getSource('incidents')) {
      m.addSource('incidents', {
        type: 'geojson',
        data: geojson,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });

      m.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'incidents',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#e74c3c',
            10, '#e67e22',
            30, '#f1c40f'
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            15,
            10, 20,
            30, 25
          ]
        }
      });

      m.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'incidents',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
          'text-size': 12
        }
      });

      m.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'incidents',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-radius': 6,
          'circle-color': [
            'match',
            ['get', 'type'],
            'Battles', '#f1c40f',
            'Explosions/Remote violence', '#e74c3c',
            'Armed clash', '#2c3e50',
            '#bdc3c7' // couleur par défaut
          ]
        }
      });

      m.on('click', 'clusters', (e) => {
        const features = m.queryRenderedFeatures(e.point, { layers: ['clusters'] });
        const clusterId = features[0].properties.cluster_id;
        m.getSource('incidents').getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return;
          m.easeTo({ center: features[0].geometry.coordinates, zoom });
        });
      });

      m.on('click', 'unclustered-point', (e) => {
        const props = e.features[0].properties;
        new maplibregl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(`<strong>${props.country}</strong><br/>${props.date}`)
          .addTo(m);
      });

      m.on('mouseenter', 'unclustered-point', () => {
        m.getCanvas().style.cursor = 'pointer';
      });

      m.on('mouseleave', 'unclustered-point', () => {
        m.getCanvas().style.cursor = '';
      });
    } else {
      m.getSource('incidents').setData(geojson);
    }
  }

  return <div className="map-container" ref={mapContainer} />;
}
