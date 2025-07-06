import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL // ex: http://localhost:4000
});

export async function fetchLocalIncidents(params = {}) {
  try {
    const res = await API.get('/api/local-incidents', { params });
    return res.data; // { data: […] }
  } catch (err) {
    console.error('Erreur fetchLocalIncidents', err.response?.data || err);
    return { data: [] };
  }
}
