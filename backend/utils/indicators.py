"""
技術指標計算模組
使用 pandas 和 numpy 計算各種技術指標
"""
import pandas as pd
import numpy as np


def calculate_sma(df: pd.DataFrame, period: int = 20) -> pd.Series:
    """計算簡單移動平均線 (Simple Moving Average)"""
    return df['Close'].rolling(window=period).mean()


def calculate_ema(df: pd.DataFrame, period: int = 20) -> pd.Series:
    """計算指數移動平均線 (Exponential Moving Average)"""
    return df['Close'].ewm(span=period, adjust=False).mean()


def calculate_rsi(df: pd.DataFrame, period: int = 14) -> pd.Series:
    """
    計算相對強弱指標 (Relative Strength Index)
    RSI 值介於 0-100，通常 >70 視為超買，<30 視為超賣
    """
    delta = df['Close'].diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
    
    rs = gain / loss
    rsi = 100 - (100 / (1 + rs))
    return rsi


def calculate_macd(df: pd.DataFrame, fast: int = 12, slow: int = 26, signal: int = 9) -> dict:
    """
    計算 MACD 指標 (Moving Average Convergence Divergence)
    返回: {'macd': MACD線, 'signal': 信號線, 'histogram': 柱狀圖}
    """
    ema_fast = df['Close'].ewm(span=fast, adjust=False).mean()
    ema_slow = df['Close'].ewm(span=slow, adjust=False).mean()
    
    macd_line = ema_fast - ema_slow
    signal_line = macd_line.ewm(span=signal, adjust=False).mean()
    histogram = macd_line - signal_line
    
    return {
        'macd': macd_line,
        'signal': signal_line,
        'histogram': histogram
    }


def calculate_bollinger_bands(df: pd.DataFrame, period: int = 20, std_dev: int = 2) -> dict:
    """
    計算布林通道 (Bollinger Bands)
    返回: {'upper': 上軌, 'middle': 中軌, 'lower': 下軌}
    """
    middle_band = df['Close'].rolling(window=period).mean()
    std = df['Close'].rolling(window=period).std()
    
    upper_band = middle_band + (std * std_dev)
    lower_band = middle_band - (std * std_dev)
    
    return {
        'upper': upper_band,
        'middle': middle_band,
        'lower': lower_band
    }


def calculate_stochastic(df: pd.DataFrame, k_period: int = 14, d_period: int = 3) -> dict:
    """
    計算隨機指標 (Stochastic Oscillator)
    返回: {'k': %K線, 'd': %D線}
    """
    low_min = df['Low'].rolling(window=k_period).min()
    high_max = df['High'].rolling(window=k_period).max()
    
    k = 100 * ((df['Close'] - low_min) / (high_max - low_min))
    d = k.rolling(window=d_period).mean()
    
    return {
        'k': k,
        'd': d
    }


def calculate_atr(df: pd.DataFrame, period: int = 14) -> pd.Series:
    """
    計算平均真實波動幅度 (Average True Range)
    用於衡量市場波動性
    """
    high_low = df['High'] - df['Low']
    high_close = np.abs(df['High'] - df['Close'].shift())
    low_close = np.abs(df['Low'] - df['Close'].shift())
    
    true_range = pd.concat([high_low, high_close, low_close], axis=1).max(axis=1)
    atr = true_range.rolling(window=period).mean()
    
    return atr


def calculate_obv(df: pd.DataFrame) -> pd.Series:
    """
    計算能量潮指標 (On-Balance Volume)
    用於衡量買賣力道
    """
    obv = (np.sign(df['Close'].diff()) * df['Volume']).fillna(0).cumsum()
    return obv


def calculate_adx(df: pd.DataFrame, period: int = 14) -> pd.Series:
    """
    計算平均趨向指標 (Average Directional Index)
    ADX > 25 表示強勢趨勢，< 20 表示弱勢或盤整
    """
    # 計算 +DM 和 -DM
    high_diff = df['High'].diff()
    low_diff = -df['Low'].diff()
    
    plus_dm = high_diff.where((high_diff > low_diff) & (high_diff > 0), 0)
    minus_dm = low_diff.where((low_diff > high_diff) & (low_diff > 0), 0)
    
    # 計算 TR (True Range)
    tr = calculate_atr(df, period=1)
    
    # 計算平滑的 +DI 和 -DI
    plus_di = 100 * (plus_dm.rolling(window=period).mean() / tr.rolling(window=period).mean())
    minus_di = 100 * (minus_dm.rolling(window=period).mean() / tr.rolling(window=period).mean())
    
    # 計算 DX 和 ADX
    dx = 100 * np.abs(plus_di - minus_di) / (plus_di + minus_di)
    adx = dx.rolling(window=period).mean()
    
    return adx


def calculate_cci(df: pd.DataFrame, period: int = 20) -> pd.Series:
    """
    計算商品通道指數 (Commodity Channel Index)
    CCI > 100 視為超買，< -100 視為超賣
    """
    tp = (df['High'] + df['Low'] + df['Close']) / 3
    sma_tp = tp.rolling(window=period).mean()
    mad = tp.rolling(window=period).apply(lambda x: np.abs(x - x.mean()).mean())
    
    cci = (tp - sma_tp) / (0.015 * mad)
    return cci


def calculate_williams_r(df: pd.DataFrame, period: int = 14) -> pd.Series:
    """
    計算威廉指標 (Williams %R)
    值介於 -100 到 0，< -80 視為超賣，> -20 視為超買
    """
    highest_high = df['High'].rolling(window=period).max()
    lowest_low = df['Low'].rolling(window=period).min()
    
    williams_r = -100 * ((highest_high - df['Close']) / (highest_high - lowest_low))
    return williams_r


def calculate_vwap(df: pd.DataFrame) -> pd.Series:
    """
    計算成交量加權平均價 (Volume Weighted Average Price)
    通常用於當日交易
    """
    typical_price = (df['High'] + df['Low'] + df['Close']) / 3
    vwap = (typical_price * df['Volume']).cumsum() / df['Volume'].cumsum()
    return vwap


def calculate_all_indicators(df: pd.DataFrame) -> dict:
    """
    計算所有技術指標
    
    Args:
        df: 包含 OHLCV 資料的 DataFrame
        
    Returns:
        包含所有指標的字典
    """
    indicators = {}
    
    try:
        # 移動平均線
        indicators['sma_20'] = calculate_sma(df, 20)
        indicators['sma_50'] = calculate_sma(df, 50)
        indicators['ema_12'] = calculate_ema(df, 12)
        indicators['ema_26'] = calculate_ema(df, 26)
        
        # RSI
        indicators['rsi'] = calculate_rsi(df, 14)
        
        # MACD
        macd_data = calculate_macd(df)
        indicators['macd'] = macd_data['macd']
        indicators['macd_signal'] = macd_data['signal']
        indicators['macd_histogram'] = macd_data['histogram']
        
        # 布林通道
        bb_data = calculate_bollinger_bands(df)
        indicators['bb_upper'] = bb_data['upper']
        indicators['bb_middle'] = bb_data['middle']
        indicators['bb_lower'] = bb_data['lower']
        
        # 隨機指標
        stoch_data = calculate_stochastic(df)
        indicators['stoch_k'] = stoch_data['k']
        indicators['stoch_d'] = stoch_data['d']
        
        # 其他指標
        indicators['atr'] = calculate_atr(df, 14)
        indicators['obv'] = calculate_obv(df)
        indicators['adx'] = calculate_adx(df, 14)
        indicators['cci'] = calculate_cci(df, 20)
        indicators['williams_r'] = calculate_williams_r(df, 14)
        indicators['vwap'] = calculate_vwap(df)
        
    except Exception as e:
        print(f"計算指標時發生錯誤: {str(e)}")
    
    return indicators


def get_latest_indicators(df: pd.DataFrame) -> dict:
    """
    取得最新的技術指標數值（用於顯示）
    
    Returns:
        包含最新指標值的字典
    """
    indicators = calculate_all_indicators(df)
    latest = {}
    
    for key, series in indicators.items():
        if series is not None and len(series) > 0:
            # 取得最後一個非 NaN 的值
            value = series.dropna().iloc[-1] if len(series.dropna()) > 0 else None
            if value is not None and not np.isnan(value):
                latest[key] = round(float(value), 2)
    
    return latest


def format_indicators_for_chart(df: pd.DataFrame, indicators: dict) -> list:
    """
    將指標格式化為圖表可用的格式
    
    Args:
        df: 原始數據 DataFrame
        indicators: 指標字典
        
    Returns:
        格式化後的指標列表
    """
    formatted = []
    
    for idx, date in enumerate(df.index):
        point = {
            'date': date.strftime('%Y-%m-%d')
        }
        
        # 添加每個指標的值
        for key, series in indicators.items():
            if series is not None and idx < len(series):
                value = series.iloc[idx]
                if not np.isnan(value):
                    point[key] = round(float(value), 2)
        
        formatted.append(point)
    
    return formatted
