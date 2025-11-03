import React from 'react';

function TechnicalIndicators({ indicators }) {
  if (!indicators) return null;

  // 指標分類
  const trendIndicators = [
    { key: 'sma_20', label: 'SMA(20)', description: '20日簡單移動平均' },
    { key: 'sma_50', label: 'SMA(50)', description: '50日簡單移動平均' },
    { key: 'ema_12', label: 'EMA(12)', description: '12日指數移動平均' },
    { key: 'ema_26', label: 'EMA(26)', description: '26日指數移動平均' },
  ];

  const momentumIndicators = [
    { key: 'rsi', label: 'RSI(14)', description: '相對強弱指標', signal: getRSISignal(indicators.rsi) },
    { key: 'macd', label: 'MACD', description: 'MACD線', signal: getMACDSignal(indicators.macd, indicators.macd_signal) },
    { key: 'macd_signal', label: 'MACD Signal', description: 'MACD信號線' },
    { key: 'stoch_k', label: 'Stoch %K', description: '隨機指標K線', signal: getStochSignal(indicators.stoch_k) },
    { key: 'cci', label: 'CCI(20)', description: '商品通道指數', signal: getCCISignal(indicators.cci) },
    { key: 'williams_r', label: 'Williams %R', description: '威廉指標', signal: getWilliamsSignal(indicators.williams_r) },
  ];

  const volatilityIndicators = [
    { key: 'bb_upper', label: 'BB Upper', description: '布林通道上軌' },
    { key: 'bb_middle', label: 'BB Middle', description: '布林通道中軌' },
    { key: 'bb_lower', label: 'BB Lower', description: '布林通道下軌' },
    { key: 'atr', label: 'ATR(14)', description: '平均真實波動幅度' },
  ];

  const volumeIndicators = [
    { key: 'obv', label: 'OBV', description: '能量潮指標' },
    { key: 'vwap', label: 'VWAP', description: '成交量加權平均價' },
  ];

  const trendStrengthIndicators = [
    { key: 'adx', label: 'ADX(14)', description: '平均趨向指標', signal: getADXSignal(indicators.adx) },
  ];

  function getRSISignal(value) {
    if (!value) return null;
    if (value > 70) return { text: '超買', color: 'text-red-600' };
    if (value < 30) return { text: '超賣', color: 'text-green-600' };
    return { text: '中性', color: 'text-gray-600' };
  }

  function getMACDSignal(macd, signal) {
    if (!macd || !signal) return null;
    if (macd > signal) return { text: '看漲', color: 'text-green-600' };
    return { text: '看跌', color: 'text-red-600' };
  }

  function getStochSignal(value) {
    if (!value) return null;
    if (value > 80) return { text: '超買', color: 'text-red-600' };
    if (value < 20) return { text: '超賣', color: 'text-green-600' };
    return { text: '中性', color: 'text-gray-600' };
  }

  function getCCISignal(value) {
    if (!value) return null;
    if (value > 100) return { text: '超買', color: 'text-red-600' };
    if (value < -100) return { text: '超賣', color: 'text-green-600' };
    return { text: '中性', color: 'text-gray-600' };
  }

  function getWilliamsSignal(value) {
    if (!value) return null;
    if (value > -20) return { text: '超買', color: 'text-red-600' };
    if (value < -80) return { text: '超賣', color: 'text-green-600' };
    return { text: '中性', color: 'text-gray-600' };
  }

  function getADXSignal(value) {
    if (!value) return null;
    if (value > 25) return { text: '強勢趨勢', color: 'text-green-600' };
    if (value < 20) return { text: '弱勢/盤整', color: 'text-gray-600' };
    return { text: '中等趨勢', color: 'text-blue-600' };
  }

  const IndicatorCard = ({ indicator }) => {
    const value = indicators[indicator.key];
    if (value === undefined || value === null) return null;

    return (
      <div 
        className="rounded-lg p-4 transition-colors" 
        style={{ backgroundColor: 'var(--bg-200)' }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-300)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-200)'}
      >
        <div className="flex justify-between items-start mb-1">
          <span className="text-sm font-semibold" style={{ color: 'var(--text-100)' }}>{indicator.label}</span>
          {indicator.signal && (
            <span className={`text-xs font-medium ${indicator.signal.color}`}>
              {indicator.signal.text}
            </span>
          )}
        </div>
        <div className="text-2xl font-bold mb-1" style={{ color: 'var(--text-100)' }}>
          {typeof value === 'number' ? value.toFixed(2) : value}
        </div>
        <div className="text-xs" style={{ color: 'var(--text-200)' }}>{indicator.description}</div>
      </div>
    );
  };

  const IndicatorSection = ({ title, indicatorList, icon }) => {
    const hasData = indicatorList.some(ind => indicators[ind.key] !== undefined && indicators[ind.key] !== null);
    if (!hasData) return null;

    return (
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-4 flex items-center" style={{ color: 'var(--text-100)' }}>
          <span className="mr-2">{icon}</span>
          {title}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {indicatorList.map(indicator => (
            <IndicatorCard key={indicator.key} indicator={indicator} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-lg shadow-sm p-6" style={{ backgroundColor: 'var(--bg-100)' }}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-100)' }}>技術指標分析</h2>
        <p className="text-sm" style={{ color: 'var(--text-200)' }}>
          以下是基於歷史數據計算的各種技術指標，可用於輔助投資決策
        </p>
      </div>

      <IndicatorSection
        title="趨勢指標"
        icon="📈"
        indicatorList={trendIndicators}
      />

      <IndicatorSection
        title="動量指標"
        icon="⚡"
        indicatorList={momentumIndicators}
      />

      <IndicatorSection
        title="波動性指標"
        icon="📊"
        indicatorList={volatilityIndicators}
      />

      <IndicatorSection
        title="成交量指標"
        icon="📦"
        indicatorList={volumeIndicators}
      />

      <IndicatorSection
        title="趨勢強度指標"
        icon="💪"
        indicatorList={trendStrengthIndicators}
      />

      <div className="mt-6 p-4 border rounded-lg" style={{ 
        backgroundColor: 'var(--bg-200)', 
        borderColor: 'var(--primary-200)'
      }}>
        <h4 className="font-semibold mb-2" style={{ color: 'var(--text-100)' }}>💡 指標使用提示</h4>
        <ul className="text-sm space-y-1" style={{ color: 'var(--text-200)' }}>
          <li>• <strong>RSI</strong>: &gt;70 超買，&lt;30 超賣</li>
          <li>• <strong>MACD</strong>: 線在信號線上方為看漲，下方為看跌</li>
          <li>• <strong>布林通道</strong>: 價格接近上軌可能回落，接近下軌可能反彈</li>
          <li>• <strong>ADX</strong>: &gt;25 表示強勢趨勢，&lt;20 表示弱勢或盤整</li>
          <li>• <strong>Stochastic</strong>: &gt;80 超買，&lt;20 超賣</li>
        </ul>
      </div>
    </div>
  );
}

export default TechnicalIndicators;
