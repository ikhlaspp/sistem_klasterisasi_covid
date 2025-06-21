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

const ElbowChart = ({ data }) => {  if (!data || !data.k_values || !data.sse_scores) {
    return <div>Data grafik tidak tersedia.</div>;
  }

  // Get optimal k from backend
  const elbowK = data.optimal_k;
  const elbowIndex = data.k_values.indexOf(elbowK);

  const pointBackgroundColors = data.k_values.map(
    (k, index) => (index === elbowIndex ? "#facc15" : "rgb(75, 192, 192)") // Kuning untuk siku (optimal k)
  );

  const pointRadii = data.k_values.map(
    (k, index) => (index === elbowIndex ? 8 : 4) // Radius lebih besar untuk optimal k
  );  const chartData = {
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
        yAxisID: 'y',
      },
      // Add FPC dataset if available
      ...(data.fpc_scores ? [{
        label: "Fuzzy Partition Coefficient (FPC)",
        data: data.fpc_scores,
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        tension: 0.1,
        borderDash: [3, 3],
        pointStyle: 'triangle',
        yAxisID: 'y2',
      }] : []),
    ],
  };const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },      title: {
        display: true,
        text: "Analisis Metode Elbow dan FPC untuk Penentuan Jumlah Cluster Optimal",
      },tooltip: {
        callbacks: {
          title: (context) => {
            return `k = ${context[0].label}`;
          },
          label: (context) => {
            if (context.dataset.label.includes("SSE")) {
              return `SSE: ${parseFloat(context.raw).toFixed(4)}`;
            } else if (context.dataset.label.includes("FPC")) {
              return `FPC: ${parseFloat(context.raw).toFixed(4)}`;
            }
            return context.formattedValue;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Jumlah Klaster (k)",
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.2)',
        }
      },
      y: {
        title: {
          display: true,
          text: "Nilai SSE",
        },
        position: 'left',
        grid: {
          color: 'rgba(75, 192, 192, 0.2)',
        }      },
      // Y-axis for FPC values
      ...(data.fpc_scores ? {
        y2: {
          title: {
            display: true,
            text: "Fuzzy Partition Coefficient (FPC)",
          },
          position: 'right',
          grid: {
            drawOnChartArea: false, // only show grid for left y-axis
          },
          min: 0,
          max: 1, // FPC values range from 0 to 1
          ticks: {
            callback: function(value) {
              return value.toFixed(2);
            }
          }
        }
      } : {})
    },
  };
  return (
    <div className="flex flex-col">
      <div className="h-[400px]">
        <Line options={options} data={chartData} />
      </div>      <div className="mt-6 text-center">
        <p className="text-gray-600 font-medium">
          Berdasarkan analisis Elbow Method, jumlah klaster optimal adalah{" "}
          <strong className="text-gray-800 text-xl">{elbowK}</strong>
        </p>
        {data.recommendation && (
          <p className="text-sm text-gray-500 mt-1">
            {data.recommendation.explanation}
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 max-w-2xl mx-auto">
          <div className="bg-slate-50 p-3 rounded-lg shadow-sm">
            <h3 className="text-sm font-semibold">SSE (Sum of Squared Error)</h3>
            <p className="text-xs text-gray-600 mt-1">
              Nilai SSE yang lebih rendah menunjukkan klaster lebih baik. Titik elbow adalah titik di mana penurunan SSE mulai melambat secara signifikan.
            </p>
          </div>
          {data.fpc_scores && (
            <div className="bg-slate-50 p-3 rounded-lg shadow-sm">
              <h3 className="text-sm font-semibold">FPC (Fuzzy Partition Coefficient)</h3>
              <p className="text-xs text-gray-600 mt-1">
                FPC mengukur kualitas clustering fuzzy, bernilai antara 0-1. Semakin tinggi nilai FPC menandakan keanggotaan klaster yang lebih jelas dan berkelompok.
              </p>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-4">
          <span className="bg-yellow-200 rounded-full w-3 h-3 inline-block mr-1"></span>
          Titik siku (elbow point) menandai jumlah cluster yang optimal pada grafik.
        </p>
      </div>
    </div>
  );
};

export default ElbowChart;
