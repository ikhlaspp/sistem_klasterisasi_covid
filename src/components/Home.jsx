import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../leaflet-setup"; // Import the leaflet setup file
import axios from "axios";

import indonesiaGeoJSON from "../assets/indonesia-prov.geojson";

const Home = () => {
  const [geoData, setGeoData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const mapCenter = [-2.548926, 118.0148634];
  const mapZoom = 5;

  const mapStyle = {
    fillColor: "#394a6d",
    weight: 1,
    opacity: 1,
    color: "#8aa6b5",
    fillOpacity: 0.7,
  };
  
  // Function to handle each feature and add properties
  const onEachFeature = (feature, layer) => {
    // Find the property that contains province name (could be NAME_1, Provinsi, etc.)
    const provinceName = 
      feature.properties?.NAME_1 || 
      feature.properties?.name || 
      feature.properties?.Provinsi || 
      "Unknown Province";
    
    layer.bindTooltip(provinceName);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("GeoJSON data:", indonesiaGeoJSON);
        
        // Check if the GeoJSON data is valid
        if (indonesiaGeoJSON && 
            indonesiaGeoJSON.type === "FeatureCollection" && 
            Array.isArray(indonesiaGeoJSON.features)) {
          console.log("Features count:", indonesiaGeoJSON.features.length);
          setGeoData(indonesiaGeoJSON);
        } else {
          // If import doesn't work, try fetching the file directly
          console.log("Imported GeoJSON failed, trying to fetch the file...");
          
          // Try with a direct path
          const response = await axios.get("/src/assets/indonesia-prov.geojson");
          
          if (response.data) {
            console.log("Fetched GeoJSON data:", response.data);
            setGeoData(response.data);
          } else {
            throw new Error("Failed to fetch GeoJSON data");
          }
        }
      } catch (err) {
        setError(`Error processing GeoJSON: ${err.message}`);
        console.error("Error processing GeoJSON:", err);
        
        // Try with a different path as a fallback
        try {
          const fallbackResponse = await axios.get("/assets/indonesia-prov.geojson");
          if (fallbackResponse.data) {
            console.log("Fetched GeoJSON from fallback path:", fallbackResponse.data);
            setGeoData(fallbackResponse.data);
            setError(null); // Clear error if fallback succeeds
          }
        } catch (fallbackErr) {
          console.error("Fallback fetch also failed:", fallbackErr);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {loading && (
        <div className="absolute top-0 left-0 z-50 bg-blue-500 text-white p-4 m-4 rounded">
          Loading map data...
        </div>
      )}
      
      {error && (
        <div className="absolute top-0 left-0 z-50 bg-red-500 text-white p-4 m-4 rounded">
          Error: {error}
        </div>
      )}
      
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
        scrollWheelZoom={true}
        dragging={true}
        attributionControl={true}
        className="z-0"
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        {geoData && (
          <GeoJSON 
            key="indonesia-map" 
            data={geoData} 
            style={mapStyle} 
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="z-10 text-center text-white bg-black/50 backdrop-blur-sm p-10 rounded-2xl max-w-xl">
          <h1 className="text-6xl font-bold tracking-wider">SiKov-Clust</h1>
          <p className="mt-4 mb-8 text-xl leading-relaxed">
            Visualisasi Analisis Klaster Persebaran COVID-19 di Seluruh Provinsi
            Indonesia.
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
