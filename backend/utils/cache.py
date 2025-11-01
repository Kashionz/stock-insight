import sqlite3
import json
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import logging

logger = logging.getLogger(__name__)


class CacheManager:
    """SQLite 快取管理器"""
    
    def __init__(self, db_path: str = "cache.db"):
        self.db_path = db_path
        self.init_db()
    
    def init_db(self):
        """初始化資料庫"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS predictions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    symbol TEXT NOT NULL,
                    days INTEGER NOT NULL,
                    data TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    expires_at TIMESTAMP NOT NULL
                )
            ''')
            
            # 建立索引
            cursor.execute('''
                CREATE INDEX IF NOT EXISTS idx_symbol_days 
                ON predictions(symbol, days)
            ''')
            
            conn.commit()
            conn.close()
            logger.info("Database initialized successfully")
        except Exception as e:
            logger.error(f"Error initializing database: {str(e)}")
    
    def get_prediction(self, symbol: str, days: int) -> Optional[Dict[Any, Any]]:
        """
        從快取取得預測結果
        
        Args:
            symbol: 股票代號
            days: 預測天數
            
        Returns:
            快取的預測結果，如果不存在或已過期則返回 None
        """
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # 查詢未過期的快取
            cursor.execute('''
                SELECT data FROM predictions
                WHERE symbol = ? AND days = ? AND expires_at > ?
                ORDER BY created_at DESC
                LIMIT 1
            ''', (symbol, days, datetime.now()))
            
            result = cursor.fetchone()
            conn.close()
            
            if result:
                logger.info(f"Cache hit for {symbol} ({days} days)")
                return json.loads(result[0])
            
            logger.info(f"Cache miss for {symbol} ({days} days)")
            return None
        
        except Exception as e:
            logger.error(f"Error getting prediction from cache: {str(e)}")
            return None
    
    def save_prediction(self, symbol: str, days: int, data: Dict[Any, Any]):
        """
        儲存預測結果到快取
        
        Args:
            symbol: 股票代號
            days: 預測天數
            data: 預測結果
        """
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # 設定快取有效期限（24小時）
            expires_at = datetime.now() + timedelta(hours=24)
            
            cursor.execute('''
                INSERT INTO predictions (symbol, days, data, expires_at)
                VALUES (?, ?, ?, ?)
            ''', (symbol, days, json.dumps(data), expires_at))
            
            conn.commit()
            conn.close()
            logger.info(f"Saved prediction to cache for {symbol} ({days} days)")
        
        except Exception as e:
            logger.error(f"Error saving prediction to cache: {str(e)}")
    
    def clear_expired(self):
        """清除過期的快取"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                DELETE FROM predictions
                WHERE expires_at < ?
            ''', (datetime.now(),))
            
            deleted_count = cursor.rowcount
            conn.commit()
            conn.close()
            
            if deleted_count > 0:
                logger.info(f"Cleared {deleted_count} expired cache entries")
        
        except Exception as e:
            logger.error(f"Error clearing expired cache: {str(e)}")
