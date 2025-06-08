import React from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Popup,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import indonesiaGeoJSON from "../assets/provinsi.json";
import MapLegend from "./MapLegend";

// --- KAMUS PEMETAAN NAMA PROVINSI ---
// Kiri: Nama di file Peta (GeoJSON). Kanan: Nama di file Data (data_covid.csv).
// Nama diubah menjadi huruf besar semua untuk pencocokan yang konsisten.
const nameMapping = {
  ACEH: "Aceh",
  "SUMATERA UTARA": "Sumatera Utara",
  "SUMATERA BARAT": "Sumatera Barat",
  RIAU: "Riau",
  JAMBI: "Jambi",
  "SUMATERA SELATAN": "Sumatera Selatan",
  BENGKULU: "Bengkulu",
  LAMPUNG: "Lampung",
  "KEPULAUAN BANGKA BELITUNG": "Babel", // Contoh pemetaan
  "KEPULAUAN RIAU": "Kepulauan Riau",
  "DKI JAKARTA": "DKI Jakarta",
  "JAWA BARAT": "Jawa Barat",
  "JAWA TENGAH": "Jawa Tengah",
  "DI YOGYAKARTA": "DI Yogyakarta",
  "JAWA TIMUR": "Jawa Timur",
  BANTEN: "Banten",
  BALI: "Bali",
  "NUSA TENGGARA BARAT": "Nusa Tenggara Barat",
  "NUSA TENGGARA TIMUR": "Nusa Tenggara Timur",
  "KALIMANTAN BARAT": "Kalimantan Barat",
  "KALIMANTAN TENGAH": "Kalimantan Tengah",
  "KALIMANTAN SELATAN": "Kalimantan Selatan",
  "KALIMANTAN TIMUR": "Kalimantan Timur",
  "KALIMANTAN UTARA": "Kalimantan Utara",
  "SULAWESI UTARA": "Sulawesi Utara",
  "SULAWESI TENGAH": "Sulawesi Tengah",
  "SULAWESI SELATAN": "Sulawesi Selatan",
  "SULAWESI TENGGARA": "Sulawesi Tenggara",
  GORONTALO: "Gorontalo",
  "SULAWESI BARAT": "Sulawesi Barat",
  MALUKU: "Maluku",
  "MALUKU UTARA": "Maluku Utara",
  "IRIAN JAYA BARAT": "Papua Barat", // Ini pemetaan penting dari kasus Anda
  PAPUA: "Papua",
};
// ------------------------------------

const clusterInfo = [
  { id: 0, color: "#fee08b", label: "Klaster 1 (Risiko Sedang)" },
  { id: 1, color: "#d73027", label: "Klaster 2 (Risiko Tinggi)" },
  { id: 2, color: "#4575b4", label: "Klaster 3 (Risiko Rendah)" },
];

const getClusterColor = (clusterId) => {
  const info = clusterInfo.find((c) => c.id === clusterId);
  return info ? info.color : "#CCCCCC";
};

const MapComponent = ({ data }) => {
  const mapCenter = [-2.548926, 118.0148634];
  const mapZoom = 5;

  const styleFeature = (feature) => {
    const geoJsonName = feature.properties.Propinsi.toUpperCase();
    const mappedName = nameMapping[geoJsonName] || geoJsonName;

    const provinceData = data.provinces.find(
      (p) => p.name.toUpperCase() === mappedName.toUpperCase()
    );

    const fillColor = provinceData
      ? getClusterColor(provinceData.cluster)
      : "#CCCCCC";

    return {
      fillColor: fillColor,
      weight: 1,
      opacity: 1,
      color: "white",
      dashArray: "3",
      fillOpacity: 0.7,
    };
  };

  const onEachFeature = (feature, layer) => {
    const geoJsonName = feature.properties.Propinsi.toUpperCase();
    const mappedName = nameMapping[geoJsonName] || geoJsonName;

    const provinceData = data.provinces.find(
      (p) => p.name.toUpperCase() === mappedName.toUpperCase()
    );

    layer.bindTooltip(feature.properties.Propinsi, {
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
