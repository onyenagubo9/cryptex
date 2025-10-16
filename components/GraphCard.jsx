"use client";

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

export default function GraphCard({ title, data }) {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "Portfolio Value",
        data: data.values,
        fill: true,
        backgroundColor: "rgba(59, 130, 246, 0.2)", // blue gradient fill
        borderColor: "rgba(59, 130, 246, 1)", // line color
        tension: 0.4, // smooth curve
        pointBackgroundColor: "white",
        pointBorderColor: "rgba(59, 130, 246, 1)",
        pointRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "#111",
        titleColor: "#FACC15",
        bodyColor: "#fff",
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#FBBF24", // yellow
        },
        grid: {
          color: "rgba(255,255,255,0.05)",
        },
      },
      y: {
        ticks: {
          color: "#fff",
          callback: function (value) {
            return `$${value.toLocaleString()}`;
          },
        },
        grid: {
          color: "rgba(255,255,255,0.05)",
        },
      },
    },
  };

  return (
    <div className="bg-gray-800/60 backdrop-blur-md border border-gray-700 rounded-3xl p-6 shadow-xl hover:scale-105 transition-transform duration-300 w-full">
      {/* Card Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-yellow-400 text-2xl">📈</span>
        <h3 className="text-lg md:text-xl font-semibold text-yellow-400">{title}</h3>
      </div>

      {/* Chart */}
      <div className="w-full h-64 sm:h-72 md:h-80">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
