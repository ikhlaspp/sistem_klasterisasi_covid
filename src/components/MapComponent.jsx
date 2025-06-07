import React from "react";
import { MapContainer, TileLayer, GeoJSON, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import indonesiaGeoJSON from "../assets/indonesia-prov-placeholder.json";
import MapLegend from "./MapLegend";

// PENTING: Anda perlu file GeoJSON untuk batas provinsi Indonesia.
// Kode ini menggunakan placeholder. Anda bisa mencari dan mengunduh file
// "indonesia-prov.geojson" lalu meletakkannya di folder public.

const clusterInfo = [
  { id: 0, color: "#fee08b", label: "Klaster 1 (Risiko Sedang)" },
  { id: 1, color: "#d73027", label: "Klaster 2 (Risiko Tinggi)" },
  { id: 2, color: "#4575b4", label: "Klaster 3 (Risiko Rendah)" },
];

const getClusterColor = (clusterId) => {
  const info = clusterInfo.find((c) => c.id === clusterId);
  return info ? info.color : "#CCCCCC"; // Abu-abu jika tidak ditemukan
};

const MapComponent = ({ data }) => {
  const mapCenter = [-2.548926, 118.0148634];
  const mapZoom = 5;

  const styleFeature = (feature) => {
    const provinceData = data.provinces.find(
      (p) => p.name.toLowerCase() === feature.properties.Propinsi.toLowerCase()
    );

    const fillColor = provinceData
      ? getClusterColor(provinceData.cluster)
      : "#CCCCCC";

    return {
      fillColor: fillColor,
      weight: 1,
      opacity: 1,
      color: "white",
      fillOpacity: 0.7,
    };
  };

  const onEachFeature = (feature, layer) => {
    const provinceName = feature.properties.Propinsi;
    const provinceData = data.provinces.find(
      (p) => p.name.toLowerCase() === provinceName.toLowerCase()
    );
    // tooltip saat hover
    layer.bindTooltip(provinceName, {
      permanent: false,
      direction: "center",
      className: "leaflet-tooltip-custom",
    });

    if (provinceData) {
      const clusterLabel =
        clusterInfo.find((c) => c.id === provinceData.cluster)?.label ||
        `Klaster ${provinceData.cluster + 1}`;
      const popupContent = `
        <div class="p-1">
            <strong class="text-base font-bold">${
              provinceData.name
            }</strong><br/>
            <span class="text-sm">${clusterLabel}</span><br/>
            <span class="text-xs">Derajat Keanggotaan: ${provinceData.membership.toFixed(
              2
            )}</span>
        </div>
      `;
      layer.bindPopup(popupContent);
    }
  };

  return (
    // div dengan position: relative untuk positioning legenda
    <div className="relative h-[500px] w-full">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: "100%", width: "100%", borderRadius: "0.75rem" }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        {data && (
          <GeoJSON
            data={indonesiaGeoJSON}
            style={styleFeature}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>
      <MapLegend clusterInfo={clusterInfo} />
    </div>
  );
};

export default MapComponent;
