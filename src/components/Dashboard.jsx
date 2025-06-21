import React, { useState, useEffect } from "react";
import axios from "axios";
import MapComponent from "./MapComponent";
import ElbowChart from "./ElbowChart";

const Dashboard = () => {
  const [clusterData, setClusterData] = useState(null);
  const [elbowData, setElbowData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch clustering data
        const clusterResponse = await axios.get('http://127.0.0.1:8000/api/clusters');
        setClusterData(clusterResponse.data);

        // Fetch elbow analysis data
        const elbowResponse = await axios.get('http://127.0.0.1:8000/api/elbow-analysis');
        setElbowData(elbowResponse.data);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data from server");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 md:p-8 bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-slate-600">Loading data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 md:p-8 bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-red-500 bg-red-50 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
            Dashboard Analisis Klaster COVID-19
          </h1>
          <p className="mt-2 text-slate-500">
            Visualisasi persebaran kasus COVID-19 di Indonesia menggunakan metode klastering.
          </p>
        </div>
          <div className="flex flex-col gap-8">
          {/* Full-width Map Container */}
          <div className="w-full bg-white p-6 rounded-xl shadow-lg border border-slate-200">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-slate-700">
                Peta Sebaran Klaster Provinsi
              </h2>
              <p className="text-sm text-slate-500">
                Visualisasi persebaran kasus COVID-19 di Indonesia menggunakan metode klastering
              </p>
            </div>
            {clusterData && <MapComponent data={clusterData} />}
          </div>

          {/* Elbow Chart Below Map */}
          <div className="w-full bg-white p-6 rounded-xl shadow-lg border border-slate-200">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-slate-700">
                Analisis Elbow Method
              </h2>
              <p className="text-sm text-slate-500">
                Metode untuk menentukan jumlah cluster optimal berdasarkan SSE (Sum of Squared Error)
              </p>
            </div>
            {elbowData ? (
              <ElbowChart data={elbowData} />
            ) : (
              <div className="flex items-center justify-center h-56">
                <div className="text-slate-500">Loading elbow analysis data...</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
