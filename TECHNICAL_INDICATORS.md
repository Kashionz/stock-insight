# 技術指標說明

本應用程式現已整合多種技術指標，協助您進行更全面的股票分析。

## 📊 已實作的技術指標

### 1. 趨勢指標 (Trend Indicators)

#### SMA - 簡單移動平均線 (Simple Moving Average)
- **SMA(20)**: 20日簡單移動平均
- **SMA(50)**: 50日簡單移動平均
- **用途**: 識別價格趨勢方向，當價格高於SMA為上升趨勢，低於SMA為下降趨勢
- **交易信號**: 
  - 黃金交叉：短期SMA向上穿越長期SMA（看漲）
  - 死亡交叉：短期SMA向下穿越長期SMA（看跌）

#### EMA - 指數移動平均線 (Exponential Moving Average)
- **EMA(12)**: 12日指數移動平均
- **EMA(26)**: 26日指數移動平均
- **用途**: 比SMA更敏感，對近期價格變化反應更快
- **特點**: 賦予近期數據更高權重

### 2. 動量指標 (Momentum Indicators)

#### RSI - 相對強弱指標 (Relative Strength Index)
- **範圍**: 0-100
- **超買**: RSI > 70
- **超賣**: RSI < 30
- **用途**: 衡量價格變動的速度和幅度
- **交易信號**:
  - RSI > 70 且開始下降：可能是賣出信號
  - RSI < 30 且開始上升：可能是買入信號

#### MACD - 移動平均收斂發散指標
- **組成**:
  - MACD線 = EMA(12) - EMA(26)
  - 信號線 = MACD的9日EMA
  - 柱狀圖 = MACD線 - 信號線
- **交易信號**:
  - MACD線向上穿越信號線：看漲信號
  - MACD線向下穿越信號線：看跌信號
  - 柱狀圖由負轉正：動能轉強
  - 柱狀圖由正轉負：動能轉弱

#### Stochastic Oscillator - 隨機指標
- **組成**: %K線和%D線
- **範圍**: 0-100
- **超買**: > 80
- **超賣**: < 20
- **用途**: 比較收盤價與一段時間內的價格範圍

#### CCI - 商品通道指數 (Commodity Channel Index)
- **超買**: CCI > 100
- **超賣**: CCI < -100
- **用途**: 識別價格偏離其統計平均值的程度

#### Williams %R - 威廉指標
- **範圍**: -100 到 0
- **超買**: > -20
- **超賣**: < -80
- **用途**: 衡量當前收盤價在最近一段時間內的價格範圍中的位置

### 3. 波動性指標 (Volatility Indicators)

#### Bollinger Bands - 布林通道
- **組成**:
  - 中軌 = 20日SMA
  - 上軌 = 中軌 + (2 × 標準差)
  - 下軌 = 中軌 - (2 × 標準差)
- **用途**: 衡量市場波動性和相對價格水平
- **交易信號**:
  - 價格觸碰上軌：可能回落
  - 價格觸碰下軌：可能反彈
  - 通道收窄：波動性降低，可能出現大幅波動
  - 通道擴大：波動性增加

#### ATR - 平均真實波動幅度 (Average True Range)
- **用途**: 衡量市場波動性，不提供方向性信號
- **應用**: 
  - 設定止損點
  - 調整倉位大小
  - 識別突破的有效性

### 4. 成交量指標 (Volume Indicators)

#### OBV - 能量潮指標 (On-Balance Volume)
- **用途**: 透過累計成交量變化來預測價格走勢
- **原理**: 
  - 價格上漲日：OBV 加上當日成交量
  - 價格下跌日：OBV 減去當日成交量
- **信號**: OBV 與價格趨勢背離時，可能預示趨勢反轉

#### VWAP - 成交量加權平均價 (Volume Weighted Average Price)
- **用途**: 顯示證券在某一天內的平均成交價格，考慮了成交量因素
- **應用**: 
  - 日內交易參考價格
  - 評估交易執行品質
  - 價格高於VWAP表示買方力量較強

### 5. 趨勢強度指標

#### ADX - 平均趨向指標 (Average Directional Index)
- **範圍**: 0-100
- **強勢趨勢**: ADX > 25
- **弱勢/盤整**: ADX < 20
- **用途**: 衡量趨勢強度（不指示趨勢方向）
- **特點**: ADX 上升表示趨勢增強，下降表示趨勢減弱

## 🚀 如何使用

### 後端 API

1. **安裝新依賴**:
```bash
cd backend
pip install -r requirements.txt
```

2. **API 回應包含技術指標**:
   - `/predict` 端點：包含 `indicators` 和 `latest_indicators`
   - `/history` 端點：包含 `indicators` 和 `latest_indicators`

### 前端顯示

1. **主圖表**: 顯示股價走勢、預測、移動平均線和布林通道
2. **MACD 子圖**: 顯示 MACD 線、信號線和柱狀圖
3. **RSI 子圖**: 顯示 RSI 值和超買超賣線
4. **技術指標卡片**: 顯示所有指標的最新數值和交易信號

## 📈 綜合分析建議

使用多個指標進行交叉驗證：

### 看漲信號組合
- RSI < 30（超賣）
- MACD 線向上穿越信號線
- 價格突破 SMA(20)
- ADX > 25（趨勢強勁）

### 看跌信號組合
- RSI > 70（超買）
- MACD 線向下穿越信號線
- 價格跌破 SMA(20)
- 成交量背離

### 盤整信號
- ADX < 20
- 價格在布林通道中軌附近震蕩
- RSI 在 40-60 之間

## ⚠️ 注意事項

1. **沒有完美的指標**: 所有技術指標都有滯後性，應結合多個指標使用
2. **市場環境**: 不同指標在不同市場環境下表現不同
3. **假信號**: 技術指標可能產生假信號，需要確認
4. **風險管理**: 永遠使用止損，不要僅依賴技術指標
5. **基本面分析**: 技術分析應與基本面分析結合使用

## 🔧 程式碼結構

```
backend/
  utils/
    indicators.py      # 技術指標計算模組
  main.py             # API 端點整合技術指標

frontend/
  src/
    components/
      StockChart.jsx            # 增強版圖表（含指標）
      TechnicalIndicators.jsx   # 技術指標顯示組件
    App.jsx                     # 整合技術指標
```

## 📚 參考資料

- [Investopedia - Technical Indicators](https://www.investopedia.com/terms/t/technicalindicator.asp)
- [TradingView - Technical Analysis](https://www.tradingview.com/education/)
- [pandas-ta Documentation](https://github.com/twopirllc/pandas-ta)

---

**免責聲明**: 本應用程式提供的技術指標僅供教育和參考用途，不構成投資建議。投資有風險，請謹慎決策。
