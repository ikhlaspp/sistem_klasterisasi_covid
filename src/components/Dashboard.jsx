import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MapComponent from './MapComponent';
import ElbowChart from './ElbowChart';
import './Dashboard.css'; 

const Dashboard = () => {
  const [clusterData, setClusterData] = useState(null);
  const [elbowData, setElbowData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

//   // Ganti dengan URL API back-end Anda
//   const API_BASE_URL = 'http://127.0.0.1:8000/api';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [clusterResponse, elbowResponse] = await Promise.all([
        //   axios.get(`${API_BASE_URL}/clusters`),
        //   axios.get(`${API_BASE_URL}/elbow-analysis`)
        ]);

        setClusterData(clusterResponse.data);
        setElbowData(elbowResponse.data);
        setError(null);
      } catch (err) {
        setError('Gagal mengambil data dari server. Pastikan server back-end berjalan.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="status">Memuat data...</div>;
  }

  if (error) {
    return <div className="status error">{error}</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard Analisis Klaster COVID-19 Indonesia</h1>
      <div className="content">
        <div className="map-container">
          <h2>Peta Sebaran Klaster Provinsi</h2>
          {clusterData && <MapComponent data={clusterData} />}
        </div>
        <div className="chart-container">
          <h2>Analisis Elbow Method (Penentuan k)</h2>
          {elbowData && <ElbowChart data={elbowData} />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;