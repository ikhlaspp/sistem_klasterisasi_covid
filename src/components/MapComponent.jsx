import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Tooltip,
  ZoomControl
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import indonesiaGeoJSONFile from "../assets/indonesia-prov.geojson?url";

// Add custom CSS for the popups
import { useEffect as useEffectLayout } from 'react';

// Custom CSS hook for the popup styling
const usePopupStyles = () => {
  useEffectLayout(() => {
    // Insert CSS for custom popups
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .custom-popup .leaflet-popup-content-wrapper {
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      }
      .custom-popup .leaflet-popup-content {
        margin: 12px 16px;
        min-width: 220px;
      }
      .custom-popup .leaflet-popup-tip {
        background-color: white;
      }
    `;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
};

// Name mapping between GeoJSON and API data
const nameMapping = {
  // Standard mappings
  "DI. ACEH": "Aceh",
  "SUMATERA UTARA": "Sumatera Utara",
  "SUMATERA BARAT": "Sumatera Barat",
  "RIAU": "Riau",
  "JAMBI": "Jambi",
  "SUMATERA SELATAN": "Sumatera Selatan",
  "BENGKULU": "Bengkulu",
  "LAMPUNG": "Lampung",
  "KEPULAUAN BANGKA BELITUNG": "Kep. Bangka Belitung", // Fixed for CSV format
  "KEPULAUAN RIAU": "Kepulauan Riau",
  "DKI JAKARTA": "DKI Jakarta",
  "JAWA BARAT": "Jawa Barat",
  "JAWA TENGAH": "Jawa Tengah",
  "DAERAH ISTIMEWA YOGYAKARTA": "D.I Yogyakarta", // Fixed for CSV format
  "JAWA TIMUR": "Jawa Timur",
  "BANTEN": "Banten",
  "BALI": "Bali",
  "NUSA TENGGARA BARAT": "NTB", // Fixed for CSV format
  "NUSA TENGGARA TIMUR": "NTT", // Fixed for CSV format
  "KALIMANTAN BARAT": "Kalimantan Barat",
  "KALIMANTAN TENGAH": "Kalimantan Tengah",
  "KALIMANTAN SELATAN": "Kalimantan Selatan",
  "KALIMANTAN TIMUR": "Kalimantan Timur",
  "KALIMANTAN UTARA": "Kalimantan Utara",
  "SULAWESI UTARA": "Sulawesi Utara",
  "SULAWESI TENGAH": "Sulawesi Tengah",
  "SULAWESI SELATAN": "Sulawesi Selatan",
  "SULAWESI TENGGARA": "Sulawesi Tenggara",
  "GORONTALO": "Gorontalo",
  "SULAWESI BARAT": "Sulawesi Barat",
  "MALUKU": "Maluku",
  "MALUKU UTARA": "Maluku Utara",
  "PAPUA BARAT": "Papua Barat",
  "PAPUA": "Papua"
};

// Utility function to match province names consistently across the component
const matchProvinceName = (provinceName, dataProvinceName) => {
  // Direct match
  if (dataProvinceName === provinceName) return true;
  
  // Case-insensitive comparison
  if (dataProvinceName && provinceName && 
      dataProvinceName.toUpperCase() === provinceName.toUpperCase()) return true;
      
  // Handle abbreviations (like NTB, NTT)
  if (dataProvinceName === "NTB" && 
      (provinceName === "NUSA TENGGARA BARAT" || provinceName.includes("TENGGARA BARAT"))) return true;
  if (dataProvinceName === "NTT" && 
      (provinceName === "NUSA TENGGARA TIMUR" || provinceName.includes("TENGGARA TIMUR"))) return true;
  
  // Handle special cases
  if ((dataProvinceName === "D.I Yogyakarta" || dataProvinceName === "DI Yogyakarta") && 
      provinceName.includes("YOGYAKARTA")) return true;
  if ((dataProvinceName === "Kep. Bangka Belitung" || dataProvinceName.includes("Bangka")) && 
      provinceName.includes("BANGKA")) return true;
      
  return false;
};

const MapComponent = ({ data }) => {
  const [geoJSONData, setGeoJSONData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [clusterStats, setClusterStats] = useState([]);
  
  // Apply custom popup styles
  usePopupStyles();
  
  // Calculate additional statistics for each cluster
  useEffect(() => {
    if (data && data.provinces && data.clusters) {
      const stats = data.clusters.map((provinceList, clusterIndex) => {
        // If empty cluster
        if (provinceList.length === 0) {
          return {
            count: 0,
            minCases: 0,
            maxCases: 0,
            avgCases: 0,
            minRecovery: 0,
            maxRecovery: 0,
            minDeaths: 0,
            maxDeaths: 0
          };
        }
        
        // Extract features from all provinces in this cluster
        const caseCounts = provinceList.map(p => p.features[0]);
        const recoveryCounts = provinceList.map(p => p.features[1]);
        const deathCounts = provinceList.map(p => p.features[2]);
        
        return {
          count: provinceList.length,
          minCases: Math.min(...caseCounts),
          maxCases: Math.max(...caseCounts),
          avgCases: caseCounts.reduce((a, b) => a + b, 0) / caseCounts.length,
          minRecovery: Math.min(...recoveryCounts),
          maxRecovery: Math.max(...recoveryCounts),
          minDeaths: Math.min(...deathCounts),
          maxDeaths: Math.max(...deathCounts),
        };
      });
      
      setClusterStats(stats);
    }
  }, [data]);
  // Define cluster colors with more distinct options
  const clusterColors = {
    0: '#FF0000', // Red for cluster 1
    1: '#00CC00', // Green for cluster 2
    2: '#0000FF', // Blue for cluster 3
    3: '#FFA500', // Orange for cluster 4
    4: '#800080', // Purple for cluster 5
    5: '#00CCCC', // Cyan for cluster 6
    6: '#FF6699', // Pink for cluster 7
    7: '#663300', // Brown for cluster 8
    8: '#FFFF00', // Yellow for cluster 9
    9: '#999999'  // Gray for cluster 10
  };
  // Load GeoJSON data
  useEffect(() => {
    fetch(indonesiaGeoJSONFile)
      .then(response => response.json())
      .then(data => {
        setGeoJSONData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error loading GeoJSON:", error);
        setError("Failed to load map data");
        setLoading(false);
      });
  }, []);
  
  // Create a unique key for the GeoJSON component to force re-render when selectedProvince changes
  const geoJSONKey = `geojson-${selectedProvince || 'none'}`;  const getFeatureStyle = (feature) => {
    if (!data?.provinces) return { 
      fillColor: '#e5e5e5',
      weight: 1,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.7
    };
    
    const provinceName = feature.properties.Propinsi;
    
    // Try to match using the name mapping first
    const mappedName = nameMapping[provinceName] || provinceName;
    
    // Debug logs to help identify any remaining matching issues
    // console.log(`Mapping ${provinceName} to ${mappedName}`);
      // Use the utility function for province name matching
    const provinceData = data.provinces.find(p => 
      matchProvinceName(provinceName, p.name) || matchProvinceName(mappedName, p.name)
    );    // If no match found, use default style
    if (!provinceData) {
      console.warn(`No matching data found for province: ${provinceName} (mapped to ${mappedName})`);
      
      // Only print this information once during development
      if (!window._printedProvinceList) {
        console.log("All available province names in data:", 
          data.provinces.map(p => p.name).sort().join(", "));
        window._printedProvinceList = true;
      }
      
      return { 
        fillColor: '#e5e5e5',
        weight: 1,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7
      };
    }

    const isSelected = selectedProvince === provinceName;

    return {
      fillColor: clusterColors[provinceData.cluster],
      weight: isSelected ? 2 : 1,
      opacity: 1,
      color: isSelected ? '#333' : 'white',
      fillOpacity: isSelected ? 0.85 : 0.7
    };
  };  const onEachFeature = (feature, layer) => {
    if (!feature.properties) return;
    
    // Get province data for the popup
    const provinceName = feature.properties.Propinsi;
    const mappedName = nameMapping[provinceName] || provinceName;
      // Use the utility function for province name matching
    const provinceData = data?.provinces?.find(p => 
      matchProvinceName(provinceName, p.name) || matchProvinceName(mappedName, p.name)
    );
    
    // Custom popup with detailed information
    if (provinceData) {
      const clusterNumber = provinceData.cluster + 1; // 1-indexed for display
      const positiveCount = provinceData.features[0];
      const recoveredCount = provinceData.features[1];
      const deathCount = provinceData.features[2];
      const recoveryRate = ((recoveredCount / positiveCount) * 100).toFixed(2);
      const deathRate = ((deathCount / positiveCount) * 100).toFixed(2);
        // Get cluster label
      const getClusterLabel = (idx) => {
        switch (idx) {
          case 0: return "Sangat Tinggi";
          case 1: return "Tinggi";
          case 2: return "Sedang";
          case 3: return "Rendah";
          case 4: return "Sangat Rendah";
          default: return `Cluster ${idx + 1}`;
        }
      };
      
      const clusterLabel = getClusterLabel(provinceData.cluster);
      
      const popupContent = `
        <div class="custom-popup">
          <h3 class="text-lg font-bold">${mappedName}</h3>
          <div class="mt-1 text-sm">
            <div class="flex justify-between">
              <span class="font-medium">Cluster:</span>
              <span class="ml-2">
                <span class="px-2 py-0.5 rounded" style="background-color:${clusterColors[provinceData.cluster]}; color: white;">
                  ${clusterLabel}
                </span>
              </span>
            </div>
            <div class="flex justify-between mt-1">
              <span class="font-medium">Kasus Positif:</span>
              <span class="ml-2">${positiveCount.toLocaleString()}</span>
            </div>
            <div class="flex justify-between mt-1">
              <span class="font-medium">Kasus Sembuh:</span>
              <span class="ml-2">${recoveredCount.toLocaleString()} (${recoveryRate}%)</span>
            </div>
            <div class="flex justify-between mt-1">
              <span class="font-medium">Kasus Meninggal:</span>
              <span class="ml-2">${deathCount.toLocaleString()} (${deathRate}%)</span>
            </div>
          </div>
        </div>
      `;
      
      const popup = layer.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'custom-popup'
      });
      
      // Handle popup events
      popup.on('popupopen', () => {
        setSelectedProvince(provinceName);
      });
      
      popup.on('popupclose', () => {
        setSelectedProvince(null);
      });
    }

    // Event handlers for hover effects
    layer.on({
      mouseover: () => {
        setSelectedProvince(provinceName);
        layer.bringToFront();
      },
      mouseout: () => {
        if (!layer.getPopup() || !layer.getPopup().isOpen()) {
          setSelectedProvince(null);
        }
      },
      click: () => {
        setSelectedProvince(provinceName);
      }
    });

    // Simple tooltip for hover
    layer.bindTooltip(feature.properties.Propinsi, {
      permanent: false,
      direction: 'center',
      className: 'bg-white bg-opacity-90 border border-slate-200 px-2 py-1 rounded text-sm'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-500">
        Loading map data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 text-red-500 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }
  return (
    <div className="relative h-[600px] mt-4">
      <MapContainer
        center={[-2.5489, 118.0149]}
        zoom={5}
        className="h-full w-full rounded-lg"
        zoomControl={false}
      >
        <ZoomControl position="topleft" />
        <TileLayer
          attribution='© OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />        {geoJSONData && (
          <GeoJSON
            key={geoJSONKey}
            data={geoJSONData}
            style={getFeatureStyle}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>      {data && (
        <>
          {/* Legend panel */}
          <div className="absolute left-4 bottom-4 bg-white rounded-lg shadow-lg p-4 z-[1000] min-w-[250px]">
            <div className="font-medium text-gray-800 mb-2">Cluster Legend</div>            {data.cluster_centers.map((center, index) => {
              const stats = clusterStats[index] || {};
              
              // Definisi label untuk setiap cluster
              const getClusterLabel = (idx) => {
                switch (idx) {
                  case 0: return "Sangat Tinggi";
                  case 1: return "Tinggi";
                  case 2: return "Sedang";
                  case 3: return "Rendah";
                  case 4: return "Sangat Rendah";
                  default: return `Cluster ${idx + 1}`;
                }
              };
              
              return (
                <div key={index} className="mb-4 last:mb-0 border-b pb-3 last:border-b-0 last:pb-0">
                  <div className="flex items-start">
                    <div 
                      className="w-4 h-4 mr-2 mt-1 rounded-sm"
                      style={{ backgroundColor: clusterColors[index] }}
                    ></div>
                    <div className="w-full">
                      <div className="font-medium flex justify-between">
                        <span>Cluster {index + 1} <span className="text-xs font-normal">({getClusterLabel(index)})</span></span>
                        {stats.count > 0 && (
                          <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded-full">
                            {stats.count} provinsi
                          </span>
                        )}
                      </div>
                      
                      <div className="text-xs mt-1">
                        <div className="font-medium mb-1">Nilai Rata-rata Cluster:</div>
                        <div className="bg-gray-50 p-1.5 rounded mb-1">
                          <div>Kasus Positif: {Math.round(center[0]).toLocaleString()}</div>
                          <div>Kasus Sembuh: {Math.round(center[1]).toLocaleString()} ({((center[1]/center[0])*100).toFixed(2)}%)</div>
                          <div>Kasus Meninggal: {Math.round(center[2]).toLocaleString()} ({((center[2]/center[0])*100).toFixed(2)}%)</div>
                        </div>
                        
                        {stats.count > 0 && (
                          <details className="mt-1">
                            <summary className="font-medium cursor-pointer">Rentang Nilai</summary>
                            <div className="bg-gray-50 p-1.5 rounded mt-1">
                              <div>Kasus Positif: {Math.round(stats.minCases).toLocaleString()} - {Math.round(stats.maxCases).toLocaleString()}</div>
                              <div>Kasus Sembuh: {Math.round(stats.minRecovery).toLocaleString()} - {Math.round(stats.maxRecovery).toLocaleString()}</div>
                              <div>Kasus Meninggal: {Math.round(stats.minDeaths).toLocaleString()} - {Math.round(stats.maxDeaths).toLocaleString()}</div>
                            </div>
                          </details>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Province detail panel */}
          {selectedProvince && (
            <div className="absolute right-4 bottom-4 bg-white rounded-lg shadow-lg p-4 z-[1000] max-w-[300px]">              {(() => {
                const provinceName = selectedProvince;
                const mappedName = nameMapping[provinceName] || provinceName;
                  // Use the utility function for province name matching
                const provinceData = data.provinces.find(p => 
                  matchProvinceName(provinceName, p.name) || matchProvinceName(mappedName, p.name)
                );
                
                if (!provinceData) return <div>No data available</div>;
                
                const clusterNumber = provinceData.cluster + 1;
                const positiveCount = provinceData.features[0];
                const recoveredCount = provinceData.features[1];
                const deathCount = provinceData.features[2];
                const recoveryRate = ((recoveredCount / positiveCount) * 100).toFixed(2);
                const deathRate = ((deathCount / positiveCount) * 100).toFixed(2);
                  // Fungsi untuk mendapatkan label cluster
                const getClusterLabel = (idx) => {
                  switch (idx) {
                    case 0: return "Sangat Tinggi";
                    case 1: return "Tinggi";
                    case 2: return "Sedang";
                    case 3: return "Rendah";
                    case 4: return "Sangat Rendah";
                    default: return `Cluster ${idx + 1}`;
                  }
                };
              
                return (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-bold text-gray-800">{mappedName}</h3>
                      <span 
                        className="px-2 py-0.5 rounded text-white text-xs"
                        style={{ backgroundColor: clusterColors[provinceData.cluster] }}
                      >
                        {getClusterLabel(provinceData.cluster)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-blue-50 p-2 rounded">
                        <div className="text-xs text-blue-500 font-medium">Kasus Positif</div>
                        <div className="font-bold text-blue-700">{positiveCount.toLocaleString()}</div>
                      </div>
                      <div className="bg-green-50 p-2 rounded">
                        <div className="text-xs text-green-500 font-medium">Kasus Sembuh</div>
                        <div className="font-bold text-green-700">
                          {recoveredCount.toLocaleString()}
                          <span className="text-xs font-normal ml-1">({recoveryRate}%)</span>
                        </div>
                      </div>
                      <div className="bg-red-50 p-2 rounded">
                        <div className="text-xs text-red-500 font-medium">Kasus Meninggal</div>
                        <div className="font-bold text-red-700">
                          {deathCount.toLocaleString()}
                          <span className="text-xs font-normal ml-1">({deathRate}%)</span>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="text-xs text-gray-500 font-medium">Membership Score</div>
                        <div className="font-bold text-gray-700">
                          {(provinceData.membership * 100).toFixed(2)}%
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Klik area lain pada peta untuk melihat detail provinsi lainnya
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MapComponent;
