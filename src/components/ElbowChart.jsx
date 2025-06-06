import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

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

  const chartData = {
    labels: data.k_values,
    datasets: [
      {
        label: 'Sum of Squared Error (SSE)',
        data: data.sse_scores,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Nilai SSE untuk Setiap Jumlah Klaster (k)',
      },
    },
    scales: {
        x: {
            title: {
                display: true,
                text: 'Jumlah Klaster (k)'
            }
        },
        y: {
            title: {
                display: true,
                text: 'Nilai SSE'
            }
        }
    }
  };

  return <Line options={options} data={chartData} />;
};

export default ElbowChart;