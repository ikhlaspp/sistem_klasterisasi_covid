import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MapComponent from './MapComponent';
import ElbowChart from './ElbowChart';

const dummyClusterData = {
  cluster_centers: [
    [184277, 164871, 8064],
    [396184, 381568, 6399],
    [20139, 18003, 497],
  ],
  provinces: [
    { name: "DKI JAKARTA", cluster: 1, membership: 0.98 },
    { name: "JAWA BARAT", cluster: 0, membership: 0.95 },
    { name: "JAWA TENGAH", cluster: 0, membership: 0.91 },
    { name: "JAWA TIMUR", cluster: 0, membership: 0.89 },
    { name: "ACEH", cluster: 2, membership: 0.99 },
    { name: "SULAWESI SELATAN", cluster: 2, membership: 0.97 },
    { name: "KALIMANTAN TIMUR", cluster: 2, membership: 0.96 },
    // Tambahkan provinsi lain jika diperlukan untuk pengujian
  ],
};

const dummyElbowData = {
  k_values: [2, 3, 4, 5, 6],
  sse_scores: [250.5, 95.2, 55.1, 48.8, 45.3], // Ada "siku" yang jelas di k=3
};

const Dashboard = () => {
  const [clusterData] = useState(dummyClusterData);
  const [elbowData] = useState(dummyElbowData);
//   const [clusterData, setClusterData] = useState(null);
//   const [elbowData, setElbowData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Ganti dengan URL API back-end Anda
//   const API_BASE_URL = 'http://127.0.0.1:8000/api';

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         const [clusterResponse, elbowResponse] = await Promise.all([
//         //   axios.get(`${API_BASE_URL}/clusters`),
//         //   axios.get(`${API_BASE_URL}/elbow-analysis`)
//         ]);

//         setClusterData(clusterResponse.data);
//         setElbowData(elbowResponse.data);
//         setError(null);
//       } catch (err) {
//         setError('Gagal mengambil data dari server. Pastikan server back-end berjalan.');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading) {
//     return <div className="status">Memuat data...</div>;
//   }

//   if (error) {
//     return <div className="status error">{error}</div>;
//   }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
        Dashboard Analisis Klaster COVID-19 Indonesia
      </h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 lg:w-2/3 p-4 bg-white border border-gray-200 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Peta Sebaran Klaster Provinsi</h2>
          {clusterData && <MapComponent data={clusterData} />}
        </div>
        <div className="flex-1 lg:w-1/3 p-4 bg-white border border-gray-200 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Analisis Elbow Method (Penentuan k)</h2>
          {elbowData && <ElbowChart data={elbowData} />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;