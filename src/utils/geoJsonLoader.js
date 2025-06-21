import axios from 'axios';

export const loadGeoJsonData = async () => {
  try {
    // Using axios to fetch the GeoJSON file from the public folder
    const response = await axios.get('/src/assets/indonesia-prov.geojson');
    return response.data;
  } catch (error) {
    console.error('Error loading GeoJSON data:', error);
    return null;
  }
};

// Alternative method using fetch API
export const loadGeoJsonWithFetch = async () => {
  try {
    const response = await fetch('/src/assets/indonesia-prov.geojson');
    if (!response.ok) {
      throw new Error(`Error fetching GeoJSON: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading GeoJSON with fetch:', error);
    return null;
  }
};
