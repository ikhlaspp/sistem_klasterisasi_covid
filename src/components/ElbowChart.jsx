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

  // Get optimal k from backend or default to 3
  const elbowK = data.optimal_k || 3;
  const elbowIndex = data.k_values.indexOf(elbowK);

  const pointBackgroundColors = data.k_values.map(
    (k, index) => (index === elbowIndex ? "#facc15" : "rgb(75, 192, 192)") // Kuning untuk siku (optimal k)
  );

  const pointRadii = data.k_values.map(
    (k, index) => (index === elbowIndex ? 8 : 4) // Radius lebih besar untuk optimal k
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
        yAxisID: 'y',
      },
      // Add percentage decrease dataset if available
      ...(data.percentage_decrease ? [{
        label: "Persentase Penurunan SSE (%)",
        data: data.percentage_decrease,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderDash: [5, 5],
        tension: 0.1,
        yAxisID: 'y1',
      }] : []),
    ],
  };  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Analisis Elbow Method untuk Penentuan Jumlah Cluster Optimal",
      },
      tooltip: {
        callbacks: {
          title: (context) => {
            return `k = ${context[0].label}`;
          },
          label: (context) => {
            if (context.dataset.label.includes("SSE")) {
              return `SSE: ${parseFloat(context.raw).toFixed(4)}`;
            } else if (context.dataset.label.includes("Persentase")) {
              return `Penurunan: ${parseFloat(context.raw).toFixed(2)}%`;
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
        }
      },
      // Second Y-axis for percentage decrease
      ...(data.percentage_decrease ? {
        y1: {
          title: {
            display: true,
            text: "Persentase Penurunan SSE (%)",
          },
          position: 'right',
          grid: {
            drawOnChartArea: false, // only show grid for left y-axis
          }
        }
      } : {})
    },
  };
  return (
    <div className="flex flex-col">
      <div className="h-[400px]">
        <Line options={options} data={chartData} />
      </div>
      <div className="mt-6 text-center">
        <p className="text-gray-600 font-medium">
          Berdasarkan analisis Elbow Method, jumlah klaster optimal adalah{" "}
          <strong className="text-gray-800 text-xl">{elbowK}</strong>
        </p>
        {data.recommendation && (
          <p className="text-sm text-gray-500 mt-1">
            {data.recommendation.explanation}
          </p>
        )}
        <p className="text-xs text-gray-400 mt-2">
          <span className="bg-yellow-200 rounded-full w-3 h-3 inline-block mr-1"></span>
          Titik siku (elbow point) menandai jumlah cluster yang optimal pada grafik.
        </p>
      </div>
    </div>
  );
};

export default ElbowChart;
