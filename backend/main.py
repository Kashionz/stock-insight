from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from prophet import Prophet
import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta
from typing import Optional
import logging
import pytz
from utils.cache import CacheManager
from utils.auth import verify_token, get_current_user
from utils.indicators import calculate_all_indicators, get_latest_indicators, format_indicators_for_chart

# 設定日誌
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Stock Insight API", version="1.0.0")

# CORS 設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 初始化快取管理器
cache_manager = CacheManager()


@app.get("/")
async def root():
    """API 根路徑"""
    return {
        "message": "Welcome to Stock Insight API",
        "endpoints": {
            "/predict": "預測股價",
            "/history": "取得歷史股價",
            "/health": "健康檢查"
        }
    }


@app.get("/health")
async def health_check():
    """健康檢查端點"""
    taipei_tz = pytz.timezone('Asia/Taipei')
    return {"status": "healthy", "timestamp": datetime.now(taipei_tz).isoformat()}


@app.get("/history")
async def get_history(symbol: str, range: str = "3mo"):
    """
    取得歷史股價資料與技術指標
    
    Args:
        symbol: 股票代號（例如：2330.TW）
        range: 時間範圍（1mo, 3mo, 6mo, 1y）
    """
    try:
        logger.info(f"Fetching history for {symbol} with range {range}")
        
        # 下載股價資料
        stock = yf.Ticker(symbol)
        df = stock.history(period=range)
        
        if df.empty:
            raise HTTPException(status_code=404, detail=f"找不到股票代號 {symbol} 的資料")
        
        # 計算技術指標
        indicators = calculate_all_indicators(df)
        latest_indicators = get_latest_indicators(df)
        
        # 轉換資料格式
        history_data = []
        for date, row in df.iterrows():
            history_data.append({
                "date": date.strftime("%Y-%m-%d"),
                "open": round(float(row['Open']), 2),
                "high": round(float(row['High']), 2),
                "low": round(float(row['Low']), 2),
                "close": round(float(row['Close']), 2),
                "volume": int(row['Volume'])
            })
        
        # 格式化指標數據
        indicators_data = format_indicators_for_chart(df, indicators)
        
        return {
            "symbol": symbol,
            "range": range,
            "data": history_data,
            "indicators": indicators_data,
            "latest_indicators": latest_indicators
        }
    
    except Exception as e:
        logger.error(f"Error fetching history: {str(e)}")
        raise HTTPException(status_code=500, detail=f"取得歷史資料時發生錯誤: {str(e)}")


@app.get("/predict")
async def predict_stock(
    symbol: str, 
    days: int = 7,
    force_refresh: bool = False,
    token_payload: dict = Depends(verify_token)
):
    """
    預測股價（需要驗證）
    
    Args:
        symbol: 股票代號（例如：2330.TW）
        days: 預測天數（預設 7 天）
        force_refresh: 是否強制刷新（忽略快取）
        token_payload: JWT token 解碼後的使用者資訊
    """
    try:
        user = get_current_user(token_payload)
        logger.info(f"User {user['email']} predicting {symbol} for {days} days (force_refresh={force_refresh})")
        
        # 如果強制刷新，清除該股票的快取
        if force_refresh:
            cache_manager.clear_symbol_cache(symbol, days)
            logger.info(f"Cache cleared for {symbol} due to force_refresh")
        
        # 檢查快取
        if not force_refresh:
            cached_result = cache_manager.get_prediction(symbol, days)
            if cached_result:
                logger.info(f"Returning cached prediction for {symbol}")
                return cached_result
        
        # 下載最近六個月的股價資料
        stock = yf.Ticker(symbol)
        df = stock.history(period="6mo")
        
        if df.empty:
            raise HTTPException(status_code=404, detail=f"找不到股票代號 {symbol} 的資料")
        
        # 計算技術指標
        indicators = calculate_all_indicators(df)
        latest_indicators = get_latest_indicators(df)
        
        # 準備 Prophet 資料格式（移除時區資訊）
        prophet_df = pd.DataFrame({
            'ds': df.index.tz_localize(None),
            'y': df['Close']
        })
        
        # 訓練 Prophet 模型
        model = Prophet(
            daily_seasonality=True,
            yearly_seasonality=True,
            weekly_seasonality=True
        )
        model.fit(prophet_df)
        
        # 建立未來日期
        future = model.make_future_dataframe(periods=days)
        forecast = model.predict(future)
        
        # 取得歷史資料（最近 30 天）
        historical_data = []
        recent_df = df.tail(30)
        for date, row in recent_df.iterrows():
            historical_data.append({
                "date": date.strftime("%Y-%m-%d"),
                "actual": round(float(row['Close']), 2),
                "type": "historical"
            })
        
        # 取得預測資料（未來 N 天）
        prediction_data = []
        last_date = pd.Timestamp(df.index[-1]).tz_localize(None)
        forecast_future = forecast[forecast['ds'] > last_date].head(days)
        
        for _, row in forecast_future.iterrows():
            prediction_data.append({
                "date": row['ds'].strftime("%Y-%m-%d"),
                "predicted": round(float(row['yhat']), 2),
                "lower": round(float(row['yhat_lower']), 2),
                "upper": round(float(row['yhat_upper']), 2),
                "type": "prediction"
            })
        
        # 格式化指標數據
        indicators_data = format_indicators_for_chart(df, indicators)
        
        taipei_tz = pytz.timezone('Asia/Taipei')
        result = {
            "symbol": symbol,
            "days": days,
            "current_price": round(float(df['Close'].iloc[-1]), 2),
            "last_update": df.index[-1].strftime("%Y-%m-%d"),
            "historical": historical_data,
            "predictions": prediction_data,
            "indicators": indicators_data,
            "latest_indicators": latest_indicators,
            "timestamp": datetime.now(taipei_tz).isoformat()
        }
        
        # Debug: 檢查 indicators_data 是否正確格式化
        if indicators_data and len(indicators_data) > 0:
            logger.info(f"Indicators data sample: {indicators_data[0]}")
        else:
            logger.warning("Indicators data is empty!")
        
        # 儲存到快取
        cache_manager.save_prediction(symbol, days, result)
        
        return result
    
    except Exception as e:
        logger.error(f"Error predicting stock: {str(e)}")
        raise HTTPException(status_code=500, detail=f"預測時發生錯誤: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
