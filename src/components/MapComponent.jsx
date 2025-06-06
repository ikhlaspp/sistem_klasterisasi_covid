import React from 'react';
import { MapContainer, TileLayer, GeoJSON, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// PENTING: Anda perlu file GeoJSON untuk batas provinsi Indonesia.
// Kode ini menggunakan placeholder. Anda bisa mencari dan mengunduh file
// "indonesia-prov.geojson" lalu meletakkannya di folder public.
import indonesiaGeoJSON from '../assets/indonesia-prov-placeholder.json';

const MapComponent = ({ data }) => {
  const mapCenter = [-2.548926, 118.0148634]; 
  const mapZoom = 5;

  const getClusterColor = (clusterId) => {

    switch (clusterId) {
      case 0: return '#FF5733'; // Merah
      case 1: return '#33FF57'; // Hijau
      case 2: return '#3357FF'; // Biru
      default: return '#CCCCCC'; // Abu-abu
    }
  };

  const styleFeature = (feature) => {
    const provinceData = data.provinces.find(
      (p) => p.name.toLowerCase() === feature.properties.Propinsi.toLowerCase()
    );

    const fillColor = provinceData ? getClusterColor(provinceData.cluster) : '#CCCCCC';

    return {
      fillColor: fillColor,
      weight: 1,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.7,
    };
  };

  const onEachFeature = (feature, layer) => {
    const provinceName = feature.properties.Propinsi;
    const provinceData = data.provinces.find(
      (p) => p.name.toLowerCase() === provinceName.toLowerCase()
    );

    if (provinceData) {
      const popupContent = `
        <strong>${provinceData.name}</strong><br/>
        Cluster: ${provinceData.cluster + 1} <br/>
        Derajat Keanggotaan: ${provinceData.membership.toFixed(2)}
      `;
      layer.bindPopup(popupContent);
    }
  };


  return (
    <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {data && (
        <GeoJSON
          data={indonesiaGeoJSON}
          style={styleFeature}
          onEachFeature={onEachFeature}
        />
      )}
    </MapContainer>
  );
};

export default MapComponent;