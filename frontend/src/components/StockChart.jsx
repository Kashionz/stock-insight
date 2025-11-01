import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function StockChart({ data }) {
  const chartRef = useRef(null);

  if (!data) return null;

  // 合併歷史資料與預測資料
  const labels = [
    ...data.historical.map(d => d.date),
    ...data.predictions.map(d => d.date)
  ];

  const historicalValues = [
    ...data.historical.map(d => d.actual),
    ...Array(data.predictions.length).fill(null)
  ];

  const predictedValues = [
    ...Array(data.historical.length).fill(null),
    ...data.predictions.map(d => d.predicted)
  ];

  const upperBound = [
    ...Array(data.historical.length).fill(null),
    ...data.predictions.map(d => d.upper)
  ];

  const lowerBound = [
    ...Array(data.historical.length).fill(null),
    ...data.predictions.map(d => d.lower)
  ];

  const chartData = {
    labels,
    datasets: [
      {
        label: '歷史股價',
        data: historicalValues,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        tension: 0.3
      },
      {
        label: '預測股價',
        data: predictedValues,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.3
      },
      {
        label: '預測上界',
        data: upperBound,
        borderColor: 'rgba(239, 68, 68, 0.3)',
        backgroundColor: 'rgba(239, 68, 68, 0.05)',
        borderWidth: 1,
        borderDash: [2, 2],
        pointRadius: 0,
        fill: false,
        tension: 0.3
      },
      {
        label: '預測下界',
        data: lowerBound,
        borderColor: 'rgba(239, 68, 68, 0.3)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 1,
        borderDash: [2, 2],
        pointRadius: 0,
        fill: '-1',
        tension: 0.3
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += '$' + context.parsed.y.toFixed(2);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: function(value) {
            return '$' + value.toFixed(0);
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  };

  return (
    <div style={{ height: '400px' }}>
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  );
}

export default StockChart;
