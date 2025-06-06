import React from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import indonesiaGeoJSON from '../assets/indonesia-prov-placeholder.json';

const Home = () => {
  const mapCenter = [-2.548926, 118.0148634];
  const mapZoom = 5;

  const mapStyle = {
    fillColor: '#394a6d',
    weight: 1,
    opacity: 1,
    color: '#8aa6b5',
    fillOpacity: 0.7
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        scrollWheelZoom={false}
        dragging={false}
        attributionControl={false}
        className="pointer-events-none z-0" 
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        <GeoJSON data={indonesiaGeoJSON} style={mapStyle} />
      </MapContainer>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="z-10 text-center text-white bg-black/50 backdrop-blur-sm p-10 rounded-2xl max-w-xl">
          <h1 className="text-6xl font-bold tracking-wider">
            SiKov-Clust
          </h1>
          <p className="mt-4 mb-8 text-xl leading-relaxed">
            Visualisasi Analisis Klaster Persebaran COVID-19 di Seluruh Provinsi Indonesia.
          </p>
          <Link
            to="/dashboard"
            className="inline-block px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-300 transform hover:-translate-y-1"
          >
            Lihat Dashboard Analisis
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;