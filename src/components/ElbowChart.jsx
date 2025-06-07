import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ElbowChart = ({ data }) => {
  if (!data || !data.k_values || !data.sse_scores) {
    return <div>Data grafik tidak tersedia.</div>;
  }

  // Logika untuk menyorot titik siku (elbow)
  const elbowK = 3;
  const elbowIndex = data.k_values.indexOf(elbowK);

  const pointBackgroundColors = data.k_values.map(
    (k, index) => (index === elbowIndex ? "#facc15" : "rgb(75, 192, 192)") // Kuning untuk siku
  );

  const pointRadii = data.k_values.map(
    (k, index) => (index === elbowIndex ? 8 : 4) // Radius lebih besar untuk siku
  );

  const chartData = {
    labels: data.k_values,
    datasets: [
      {
        label: "Sum of Squared Error (SSE)",
        data: data.sse_scores,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.1,
        pointBackgroundColor: pointBackgroundColors,
        pointRadius: pointRadii,
        pointHoverRadius: 10,
        pointBorderColor: "#fff",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Nilai SSE untuk Setiap Jumlah Klaster (k)",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Jumlah Klaster (k)",
        },
      },
      y: {
        title: {
          display: true,
          text: "Nilai SSE",
        },
      },
    },
  };

  return (
    <div>
      <Line options={options} data={chartData} />
      <p className="text-center text-sm text-gray-600 mt-4">
        Berdasarkan grafik, jumlah klaster (k) yang direkomendasikan adalah{" "}
        <strong className="text-gray-800">3</strong> (titik siku).
      </p>
    </div>
  );
};

export default ElbowChart;
