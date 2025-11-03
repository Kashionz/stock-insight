import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import StockChart from './components/StockChart';
import TechnicalIndicators from './components/TechnicalIndicators';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

function StockInsightApp() {
  const { user, loading: authLoading, signOut, getAccessToken } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [symbol, setSymbol] = useState('2330.TW');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-200)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--primary-100)' }}></div>
          <p style={{ color: 'var(--text-200)' }}>載入中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (showRegister) {
      return <Register onSwitchToLogin={() => setShowRegister(false)} />;
    }
    return <Login onSwitchToRegister={() => setShowRegister(true)} />;
  }

  const handlePredict = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = await getAccessToken();
      
      const response = await fetch(
        `http://localhost:8000/predict?symbol=${symbol}&days=7&force_refresh=${forceRefresh}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('無法取得預測資料');
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('登出失敗:', err);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-200)' }}>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="relative max-w-6xl mx-auto mb-4">
            <h1 className="text-4xl font-bold" style={{ color: 'var(--text-100)' }}>
              📈 Stock Insight
            </h1>
            <div className="absolute right-0 top-0 flex items-center gap-4">
              <span className="text-sm" style={{ color: 'var(--text-200)' }}>
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg transition-colors text-sm"
                style={{ 
                  backgroundColor: 'var(--text-200)', 
                  color: 'var(--bg-100)' 
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--text-100)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--text-200)'}
              >
                登出
              </button>
            </div>
          </div>
          <p style={{ color: 'var(--text-200)' }}>AI 驅動的股票預測平台</p>
        </div>

        <div className="max-w-2xl mx-auto rounded-lg shadow-sm p-6 mb-8" style={{ backgroundColor: 'var(--bg-100)' }}>
          <div className="flex flex-col sm:flex-row gap-4 sm:items-start">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-100)' }}>
                股票代號
              </label>
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                placeholder="例如：2330.TW"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all"
                style={{ 
                  borderColor: 'var(--bg-300)', 
                  backgroundColor: 'var(--bg-100)',
                  color: 'var(--text-100)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--primary-100)';
                  e.target.style.boxShadow = `0 0 0 3px ${getComputedStyle(document.documentElement).getPropertyValue('--primary-200')}33`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--bg-300)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <p className="text-xs mt-1" style={{ color: 'var(--text-200)' }}>
                台股請加上 .TW（例如：2330.TW）
              </p>
            </div>
            
            <div className="flex gap-2 sm:pt-7">
              <button
                onClick={() => handlePredict(false)}
                disabled={loading || !symbol}
                className="px-6 py-2 rounded-lg disabled:cursor-not-allowed transition-colors font-medium whitespace-nowrap"
                style={{ 
                  backgroundColor: loading || !symbol ? 'var(--bg-300)' : 'var(--primary-100)',
                  color: 'var(--bg-100)'
                }}
                onMouseEnter={(e) => {
                  if (!loading && symbol) e.target.style.backgroundColor = 'var(--accent-200)';
                }}
                onMouseLeave={(e) => {
                  if (!loading && symbol) e.target.style.backgroundColor = 'var(--primary-100)';
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5" style={{ color: 'var(--bg-100)' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    預測中...
                  </span>
                ) : (
                  '開始預測'
                )}
              </button>
              
              {data && data.symbol === symbol && (
                <button
                  onClick={() => handlePredict(true)}
                  disabled={loading}
                  className="px-4 py-2 rounded-lg disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-1 whitespace-nowrap"
                  title="強制刷新最新股價"
                  style={{ 
                    backgroundColor: loading ? 'var(--bg-300)' : 'var(--accent-100)',
                    color: 'var(--bg-100)'
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) e.target.style.backgroundColor = 'var(--accent-200)';
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) e.target.style.backgroundColor = 'var(--accent-100)';
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  刷新
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 border rounded-lg" style={{ 
              backgroundColor: '#fee', 
              borderColor: '#fcc',
              color: '#c33'
            }}>
              <p className="text-sm">❌ {error}</p>
            </div>
          )}
        </div>

        {data && (
          <div className="max-w-6xl mx-auto">
            {/* 資料更新時間提示 */}
            <div className="mb-4 p-3 border rounded-lg" style={{ 
              backgroundColor: 'var(--bg-100)', 
              borderColor: 'var(--primary-200)'
            }}>
              <p className="text-sm" style={{ color: 'var(--primary-100)' }}>
                📊 資料最後更新時間：{data.last_update}
                {data.timestamp && (
                  <span className="ml-2 text-xs" style={{ color: 'var(--text-200)' }}>
                    (查詢時間: {new Date(data.timestamp).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei', hour12: false })})
                  </span>
                )}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-200)' }}>
                💡 提示：如果需要最新股價，請點擊「刷新」按鈕
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="rounded-lg shadow-sm p-6" style={{ backgroundColor: 'var(--bg-100)' }}>
                <p className="text-sm mb-1" style={{ color: 'var(--text-200)' }}>股票代號</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--text-100)' }}>{data.symbol}</p>
              </div>
              
              <div className="rounded-lg shadow-sm p-6" style={{ backgroundColor: 'var(--bg-100)' }}>
                <p className="text-sm mb-1" style={{ color: 'var(--text-200)' }}>目前價格</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--primary-100)' }}>
                  ${data.current_price}
                </p>
              </div>
              
              <div className="rounded-lg shadow-sm p-6" style={{ backgroundColor: 'var(--bg-100)' }}>
                <p className="text-sm mb-1" style={{ color: 'var(--text-200)' }}>預測天數</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--accent-100)' }}>
                  {data.days} 天
                </p>
              </div>
            </div>

            <div className="rounded-lg shadow-sm p-6" style={{ backgroundColor: 'var(--bg-100)' }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-100)' }}>
                股價走勢與預測
              </h2>
              <StockChart data={data} />
            </div>

            {/* 技術指標卡片 */}
            {data.latest_indicators && (
              <div className="mt-8">
                <TechnicalIndicators indicators={data.latest_indicators} />
              </div>
            )}

            <div className="rounded-lg shadow-sm p-6 mt-8" style={{ backgroundColor: 'var(--bg-100)' }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-100)' }}>
                預測明細
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y" style={{ borderColor: 'var(--bg-300)' }}>
                  <thead style={{ backgroundColor: 'var(--bg-200)' }}>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-200)' }}>
                        日期
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-200)' }}>
                        預測價格
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-200)' }}>
                        預測區間
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ backgroundColor: 'var(--bg-100)', borderColor: 'var(--bg-300)' }}>
                    {data.predictions.map((pred, index) => (
                      <tr 
                        key={index} 
                        className="transition-colors"
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-200)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-100)'}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: 'var(--text-100)' }}>
                          {pred.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold" style={{ color: 'var(--primary-100)' }}>
                          ${pred.predicted}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--text-200)' }}>
                          ${pred.lower} - ${pred.upper}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mt-12 text-sm" style={{ color: 'var(--text-200)' }}>
          <p>⚠️ 此預測僅供參考，不構成投資建議</p>
          <p className="mt-2">Built with FastAPI + React + Prophet + Technical Indicators</p>
        </div>
      </div>
    </div>
  );
}

export default StockInsightApp;
