import { useEffect, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function StockChart({ data }) {
  const chartRef = useRef(null);
  const [showIndicators, setShowIndicators] = useState({
    sma: true,
    ema: false,
    bb: true,
    volume: true
  });

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

  // 準備技術指標數據
  const indicators = data.indicators || [];
  const sma20Data = indicators.map(d => d.sma_20 || null);
  const sma50Data = indicators.map(d => d.sma_50 || null);
  const ema12Data = indicators.map(d => d.ema_12 || null);
  const ema26Data = indicators.map(d => d.ema_26 || null);
  const bbUpperData = indicators.map(d => d.bb_upper || null);
  const bbMiddleData = indicators.map(d => d.bb_middle || null);
  const bbLowerData = indicators.map(d => d.bb_lower || null);

  // 準備圖表數據集
  const datasets = [
    {
      label: '歷史股價',
      data: historicalValues,
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderWidth: 2,
      pointRadius: 3,
      pointHoverRadius: 5,
      tension: 0.3,
      order: 1
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
      tension: 0.3,
      order: 1
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
      tension: 0.3,
      order: 3
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
      tension: 0.3,
      order: 3
    }
  ];

  // 添加移動平均線
  if (showIndicators.sma) {
    datasets.push({
      label: 'SMA(20)',
      data: [...sma20Data, ...Array(data.predictions.length).fill(null)],
      borderColor: 'rgba(255, 159, 64, 0.8)',
      borderWidth: 2,
      pointRadius: 0,
      tension: 0.3,
      order: 2
    });
    datasets.push({
      label: 'SMA(50)',
      data: [...sma50Data, ...Array(data.predictions.length).fill(null)],
      borderColor: 'rgba(153, 102, 255, 0.8)',
      borderWidth: 2,
      pointRadius: 0,
      tension: 0.3,
      order: 2
    });
  }

  if (showIndicators.ema) {
    datasets.push({
      label: 'EMA(12)',
      data: [...ema12Data, ...Array(data.predictions.length).fill(null)],
      borderColor: 'rgba(75, 192, 192, 0.8)',
      borderWidth: 2,
      pointRadius: 0,
      tension: 0.3,
      borderDash: [5, 5],
      order: 2
    });
    datasets.push({
      label: 'EMA(26)',
      data: [...ema26Data, ...Array(data.predictions.length).fill(null)],
      borderColor: 'rgba(255, 99, 132, 0.8)',
      borderWidth: 2,
      pointRadius: 0,
      tension: 0.3,
      borderDash: [5, 5],
      order: 2
    });
  }

  // 添加布林通道
  if (showIndicators.bb) {
    datasets.push({
      label: 'BB Upper',
      data: [...bbUpperData, ...Array(data.predictions.length).fill(null)],
      borderColor: 'rgba(201, 203, 207, 0.6)',
      borderWidth: 1,
      pointRadius: 0,
      fill: false,
      tension: 0.3,
      order: 2
    });
    datasets.push({
      label: 'BB Middle',
      data: [...bbMiddleData, ...Array(data.predictions.length).fill(null)],
      borderColor: 'rgba(201, 203, 207, 0.4)',
      borderWidth: 1,
      pointRadius: 0,
      fill: false,
      tension: 0.3,
      borderDash: [3, 3],
      order: 2
    });
    datasets.push({
      label: 'BB Lower',
      data: [...bbLowerData, ...Array(data.predictions.length).fill(null)],
      borderColor: 'rgba(201, 203, 207, 0.6)',
      borderWidth: 1,
      pointRadius: 0,
      fill: false,
      tension: 0.3,
      order: 2
    });
  }

  const chartData = {
    labels,
    datasets
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

  // 準備 MACD 圖表數據
  const macdLabels = indicators.map(d => d.date);
  const macdData = indicators.map(d => d.macd || null);
  const macdSignalData = indicators.map(d => d.macd_signal || null);
  const macdHistogramData = indicators.map(d => d.macd_histogram || null);

  const macdChartData = {
    labels: macdLabels,
    datasets: [
      {
        label: 'MACD',
        data: macdData,
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.3,
        type: 'line'
      },
      {
        label: 'Signal',
        data: macdSignalData,
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.3,
        type: 'line'
      },
      {
        label: 'Histogram',
        data: macdHistogramData,
        backgroundColor: macdHistogramData.map(v => v >= 0 ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)'),
        type: 'bar'
      }
    ]
  };

  const macdOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 10,
          font: { size: 11 }
        }
      },
      title: {
        display: true,
        text: 'MACD (Moving Average Convergence Divergence)'
      }
    },
    scales: {
      y: {
        beginAtZero: false,
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

  // 準備 RSI 圖表數據
  const rsiData = indicators.map(d => d.rsi || null);

  const rsiChartData = {
    labels: macdLabels,
    datasets: [
      {
        label: 'RSI',
        data: rsiData,
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        borderWidth: 2,
        pointRadius: 0,
        fill: true,
        tension: 0.3
      },
      {
        label: '超買線 (70)',
        data: Array(rsiData.length).fill(70),
        borderColor: 'rgba(239, 68, 68, 0.5)',
        borderWidth: 1,
        borderDash: [5, 5],
        pointRadius: 0
      },
      {
        label: '超賣線 (30)',
        data: Array(rsiData.length).fill(30),
        borderColor: 'rgba(34, 197, 94, 0.5)',
        borderWidth: 1,
        borderDash: [5, 5],
        pointRadius: 0
      }
    ]
  };

  const rsiOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 10,
          font: { size: 11 }
        }
      },
      title: {
        display: true,
        text: 'RSI (Relative Strength Index)'
      }
    },
    scales: {
      y: {
        min: 0,
        max: 100,
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
    <div>
      {/* 控制按鈕 */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setShowIndicators({...showIndicators, sma: !showIndicators.sma})}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{
            backgroundColor: showIndicators.sma ? 'var(--primary-100)' : 'var(--bg-200)',
            color: showIndicators.sma ? 'var(--bg-100)' : 'var(--text-100)'
          }}
          onMouseEnter={(e) => {
            if (!showIndicators.sma) e.target.style.backgroundColor = 'var(--bg-300)';
          }}
          onMouseLeave={(e) => {
            if (!showIndicators.sma) e.target.style.backgroundColor = 'var(--bg-200)';
          }}
        >
          SMA
        </button>
        <button
          onClick={() => setShowIndicators({...showIndicators, ema: !showIndicators.ema})}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{
            backgroundColor: showIndicators.ema ? 'var(--primary-100)' : 'var(--bg-200)',
            color: showIndicators.ema ? 'var(--bg-100)' : 'var(--text-100)'
          }}
          onMouseEnter={(e) => {
            if (!showIndicators.ema) e.target.style.backgroundColor = 'var(--bg-300)';
          }}
          onMouseLeave={(e) => {
            if (!showIndicators.ema) e.target.style.backgroundColor = 'var(--bg-200)';
          }}
        >
          EMA
        </button>
        <button
          onClick={() => setShowIndicators({...showIndicators, bb: !showIndicators.bb})}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{
            backgroundColor: showIndicators.bb ? 'var(--primary-100)' : 'var(--bg-200)',
            color: showIndicators.bb ? 'var(--bg-100)' : 'var(--text-100)'
          }}
          onMouseEnter={(e) => {
            if (!showIndicators.bb) e.target.style.backgroundColor = 'var(--bg-300)';
          }}
          onMouseLeave={(e) => {
            if (!showIndicators.bb) e.target.style.backgroundColor = 'var(--bg-200)';
          }}
        >
          Bollinger Bands
        </button>
      </div>

      {/* 主股價圖 */}
      <div style={{ height: '400px' }} className="mb-6">
        <Line ref={chartRef} data={chartData} options={options} />
      </div>

      {/* MACD 圖表 */}
      {indicators.length > 0 && (
        <div style={{ height: '250px' }} className="mb-6">
          <Line data={macdChartData} options={macdOptions} />
        </div>
      )}

      {/* RSI 圖表 */}
      {indicators.length > 0 && (
        <div style={{ height: '250px' }}>
          <Line data={rsiChartData} options={rsiOptions} />
        </div>
      )}
    </div>
  );
}

export default StockChart;
