import React from "react";

const MapLegend = ({ clusters = [], centerPoints = [] }) => {
  // Updated color scale to match MapComponent
  const clusterColors = ["#FF6B6B", "#4ECB71", "#4A90E2"];

  // If no clusters data, don't render the legend
  if (!clusters.length || !centerPoints.length) {
    return null;
  }

  const formatNumber = (num) => {
    return new Intl.NumberFormat("id-ID").format(num);
  };

  return (
    <div className="map-legend">
      <div className="legend-header">
        <h3>Cluster Legend</h3>
      </div>
      <div className="legend-content">
        {clusters.map((cluster, index) => (
          <div key={index} className="legend-item">
            <div
              className="color-box"
              style={{ backgroundColor: clusterColors[index] }}
            ></div>
            <div className="cluster-info">
              <h4>Cluster {index + 1}</h4>
              <div className="cluster-stats">
                <div className="stat-item">
                  <span className="stat-label">Cases:</span>
                  <span className="stat-value">
                    {formatNumber(Math.round(centerPoints[index][0]))}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Death Rate:</span>
                  <span className="stat-value">
                    {centerPoints[index][1].toFixed(2)}%
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Recovery:</span>
                  <span className="stat-value">
                    {centerPoints[index][2].toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapLegend;
