# 📈 Stock Insight - AI 股票預測平台

[![Python](https://img.shields.io/badge/Python-3.11-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-green.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

一個使用 AI 技術預測股票價格的完整 Web 應用，結合 FastAPI 後端與 React 前端，適合作為技術面試的 Side Project 展示。

## 🎯 專案特色

- 🤖 **AI 驅動預測**：使用 Prophet 時間序列模型進行股價預測
- � **使用者驗證**：整合 Supabase Auth 完整的註冊/登入系統
- �📊 **視覺化圖表**：使用 Chart.js 呈現歷史股價與預測結果
- ⚡ **快取機制**：SQLite 資料庫快取預測結果，提升響應速度
- 🐳 **Docker 部署**：完整的 Docker Compose 配置，一鍵啟動
- 🎨 **現代化 UI**：使用 TailwindCSS 打造美觀介面
- 🔌 **RESTful API**：清晰的 API 設計，JWT token 驗證

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                       Browser                           │
│                   (localhost:5173)                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTP Request
                     │
┌────────────────────▼────────────────────────────────────┐
│                  React Frontend                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │  • Stock Input Box                               │   │
│  │  • Chart.js Visualization                        │   │
│  │  • TailwindCSS Styling                           │   │
│  └──────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ API Call
                     │
┌────────────────────▼────────────────────────────────────┐
│                  FastAPI Backend                        │
│  ┌──────────────────────────────────────────────────┐   │
│  │  API Endpoints:                                  │   │
│  │  • GET /predict?symbol=2330.TW&days=7            │   │
│  │  • GET /history?symbol=2330.TW&range=3mo         │   │
│  │  • GET /health                                   │   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   yfinance   │  │   Prophet    │  │    SQLite    │   │
│  │  Stock Data  │  │ AI Prediction│  │Cache Database│   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## 🛠️ 技術棧

### 後端
- **FastAPI** - 高效能的 Python Web 框架
- **yfinance** - 取得股票歷史資料
- **Prophet** - Facebook 開發的時間序列預測模型
- **SQLite** - 輕量級資料庫用於快取
- **Pandas** - 資料處理與分析

### 前端
- **React 19** - 使用 Vite 構建工具
- **Supabase Auth** - 使用者認證與授權
- **TailwindCSS** - 實用優先的 CSS 框架
- **Chart.js** - 互動式圖表庫
- **react-chartjs-2** - Chart.js 的 React 封裝

### 部署
- **Docker** - 容器化應用
- **Docker Compose** - 多容器編排

## 📦 專案結構

```
stock-insight/
├── backend/                   # 後端應用
│   ├── main.py                # FastAPI 主程式
│   ├── requirements.txt       # Python 依賴
│   ├── Dockerfile             # 後端容器配置
│   └── utils/
│       └── cache.py           # SQLite 快取管理
├── frontend/                  # 前端應用
│   ├── src/
│   │   ├── App.jsx            # 主應用元件
│   │   ├── App.css            # 樣式文件
│   │   ├── main.jsx           # 應用入口
│   │   └── components/
│   │       └── StockChart.jsx # 圖表元件
│   ├── index.html             # HTML 模板
│   ├── package.json           # Node.js 依賴
│   ├── vite.config.js         # Vite 配置
│   ├── tailwind.config.js     # Tailwind 配置
│   ├── postcss.config.js      # PostCSS 配置
│   └── Dockerfile             # 前端容器配置
├── docker-compose.yml         # Docker Compose 配置
├── .gitignore                 # Git 忽略文件
└── README.md                  # 專案說明文件
```

## 🚀 快速開始

### ⚙️ 前置設定：Supabase 配置

1. **建立 Supabase 專案**
   - 前往 [Supabase Dashboard](https://app.supabase.com/)
   - 建立新專案並啟用 Email Authentication

2. **設定環境變數**
   ```bash
   # Frontend
   cd frontend
   cp .env.example .env
   # 編輯 .env 填入 SUPABASE_URL 和 SUPABASE_ANON_KEY
   
   # Backend
   cd ../backend
   cp .env.example .env
   # 編輯 .env 填入 SUPABASE_URL 和 SUPABASE_JWT_SECRET
   ```

### 方法一：使用 Docker（推薦）

1. **確保已安裝 Docker 和 Docker Compose**
   ```bash
   docker --version
   docker-compose --version
   ```

2. **克隆專案並啟動**
   ```bash
   cd stock-insight
   docker-compose up --build
   ```

3. **訪問應用**
   - 前端：http://localhost:5173
   - 後端 API：http://localhost:8000
   - API 文檔：http://localhost:8000/docs

### 方法二：本機開發

#### 後端設置

1. **建立虛擬環境**
   ```bash
   cd backend
   python -m venv venv
   
   # Windows
   .\venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

2. **安裝依賴**
   ```bash
   pip install -r requirements.txt
   ```

3. **啟動後端**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

#### 前端設置

1. **安裝依賴**
   ```bash
   cd frontend
   npm install
   ```

2. **啟動開發伺服器**
   ```bash
   npm run dev
   ```

## 📡 API 文檔

### 🔐 認證

大部分 API endpoints 需要 JWT token 驗證。在請求 header 中加入：
```
Authorization: Bearer <your_jwt_token>
```

### 1. 預測股價 🔒

**Endpoint:** `GET /predict`

**需要認證：** ✅ 是

**參數：**
- `symbol` (required): 股票代號（例如：2330.TW）
- `days` (optional): 預測天數，預設為 7

**範例請求：**
```bash
curl "http://localhost:8000/predict?symbol=2330.TW&days=7"
```

**範例回應：**
```json
{
  "symbol": "2330.TW",
  "days": 7,
  "current_price": 585.0,
  "last_update": "2025-11-01",
  "historical": [
    {
      "date": "2025-10-28",
      "actual": 580.0,
      "type": "historical"
    }
  ],
  "predictions": [
    {
      "date": "2025-11-04",
      "predicted": 590.5,
      "lower": 575.2,
      "upper": 605.8,
      "type": "prediction"
    }
  ],
  "timestamp": "2025-11-02T10:30:00"
}
```

### 2. 取得歷史股價

**Endpoint:** `GET /history`

**參數：**
- `symbol` (required): 股票代號
- `range` (optional): 時間範圍（1mo, 3mo, 6mo, 1y），預設為 3mo

**範例請求：**
```bash
curl "http://localhost:8000/history?symbol=2330.TW&range=3mo"
```

**範例回應：**
```json
{
  "symbol": "2330.TW",
  "range": "3mo",
  "data": [
    {
      "date": "2025-08-01",
      "open": 570.0,
      "high": 575.0,
      "low": 568.0,
      "close": 572.0,
      "volume": 25000000
    }
  ]
}
```

### 3. 健康檢查

**Endpoint:** `GET /health`

**範例回應：**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-02T10:30:00"
}
```

## 🖼️ 使用介面

### 主畫面
![主畫面](https://via.placeholder.com/800x450?text=Stock+Insight+Main+Screen)

- 輸入股票代號（支援台股、美股等）
- 點擊「開始預測」按鈕
- 查看預測結果與圖表

### 預測結果
![預測結果](https://via.placeholder.com/800x450?text=Prediction+Chart)

- 藍色線：歷史股價
- 綠色虛線：預測股價
- 紅色區域：預測信賴區間

## 💡 使用範例

### 台灣股票（台積電）
```
輸入：2330.TW
```

### 美國股票（蘋果）
```
輸入：AAPL
```

### 香港股票（騰訊）
```
輸入：0700.HK
```

## 🧪 測試

### 測試 API
```bash
# 健康檢查
curl http://localhost:8000/health

# 預測台積電股價
curl "http://localhost:8000/predict?symbol=2330.TW&days=7"

# 取得歷史資料
curl "http://localhost:8000/history?symbol=2330.TW&range=3mo"
```

## 📝 面試展示重點

1. **技術廣度**
   - 前後端分離架構
   - RESTful API 設計
   - Docker 容器化部署

2. **AI/ML 應用**
   - Prophet 時間序列預測
   - 資料前處理與特徵工程
   - 模型評估與優化

3. **工程實踐**
   - 快取機制提升效能
   - 錯誤處理與日誌記錄
   - CORS 跨域處理
   - 程式碼結構化與模組化

4. **前端技能**
   - React Hooks 使用
   - 狀態管理
   - 圖表視覺化
   - 響應式設計

## 🔧 常見問題

### Q1: 為什麼預測結果與實際有差異？
A: Prophet 是基於歷史資料的統計模型，僅供參考，不構成投資建議。股市受多種因素影響，包括新聞、政策、市場情緒等。

### Q2: 支援哪些股票市場？
A: 支援 yfinance 可存取的所有市場，包括台灣（.TW）、美國、香港（.HK）、日本（.T）等。

### Q3: 快取多久會過期？
A: 預測結果快取 24 小時，過期後會自動重新預測。

### Q4: 如何修改預測天數？
A: 在前端程式碼中修改 API 呼叫參數，或直接透過 API 傳入 `days` 參數。

## � 技術指標分析

本專案現已整合多種專業技術指標，提供全面的股票技術分析：

### 已實作指標

#### 趨勢指標
- **SMA(20/50)** - 簡單移動平均線
- **EMA(12/26)** - 指數移動平均線

#### 動量指標
- **RSI** - 相對強弱指標（超買超賣分析）
- **MACD** - 移動平均收斂發散指標
- **Stochastic** - 隨機指標
- **CCI** - 商品通道指數
- **Williams %R** - 威廉指標

#### 波動性指標
- **Bollinger Bands** - 布林通道
- **ATR** - 平均真實波動幅度

#### 成交量指標
- **OBV** - 能量潮指標
- **VWAP** - 成交量加權平均價

#### 趨勢強度指標
- **ADX** - 平均趨向指標

### 視覺化功能
- 📈 主圖表整合 SMA、EMA、布林通道
- 📊 獨立 MACD 子圖（含柱狀圖）
- 📉 獨立 RSI 子圖（含超買超賣線）
- 💡 智能信號提示（看漲/看跌/中性）
- 🎯 即時指標數值卡片

詳細指標說明請參考 [技術指標文檔](TECHNICAL_INDICATORS.md)

## �🚧 未來改進方向

- [x] 加入使用者認證系統（已完成 - Supabase Auth）
- [x] 加入更多技術指標（已完成 - RSI、MACD、Bollinger Bands 等 12+ 指標）
- [ ] 支援多個股票比較
- [ ] 使用者投資組合管理
- [ ] 整合即時股價 WebSocket
- [ ] 加入模型準確度評估
- [ ] 支援更多預測模型（LSTM、ARIMA 等）
- [ ] 加入股票新聞爬蟲與情緒分析
- [ ] 建立自動化測試
