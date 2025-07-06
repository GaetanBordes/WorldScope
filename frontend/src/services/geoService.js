import axios from 'axios';

export async function fetchAllCountries() {
  try {
    const res = await axios.get(
      'https://restcountries.com/v3.1/all?fields=name,cca3,latlng,population,flags,borders'
    );
    const features = res.data.map((c) => {
      // On prend toujours un point (centre) pour l'instant
      const [lat, lng] = c.latlng || [0, 0];
      return {
        type: 'Feature',
        properties: {
          name: c.name.common,
          cca3: c.cca3,
          population: c.population,
          flag: c.flags?.png,
        },
        geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
      };
    });
    return {
      type: 'FeatureCollection',
      features,
    };
  } catch (err) {
    console.error('Erreur fetchAllCountries', err);
    return { type: 'FeatureCollection', features: [] };
  }
}