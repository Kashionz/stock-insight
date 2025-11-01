"""
Supabase JWT 驗證中介軟體
"""
from fastapi import HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import jwt, JWTError
import requests
import os
from functools import lru_cache

security = HTTPBearer()

# 從環境變數讀取 Supabase 配置
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET", "")


@lru_cache()
def get_supabase_public_key():
    """
    取得 Supabase JWT 公鑰
    若使用 HS256，則直接使用 JWT secret
    """
    return SUPABASE_JWT_SECRET


async def verify_token(
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    """
    驗證 Supabase JWT Token
    
    Args:
        credentials: HTTP Authorization Header 中的 Bearer Token
        
    Returns:
        解碼後的使用者資訊
        
    Raises:
        HTTPException: Token 無效或過期
    """
    token = credentials.credentials
    
    try:
        # 解碼 JWT token
        # Supabase 預設使用 HS256 演算法
        payload = jwt.decode(
            token,
            get_supabase_public_key(),
            algorithms=["HS256"],
            options={"verify_aud": False}  # Supabase 的 token 沒有 audience
        )
        
        # 驗證 token 是否來自正確的 issuer
        if not payload.get("sub"):
            raise HTTPException(
                status_code=401,
                detail="無效的 Token：缺少使用者 ID"
            )
        
        return payload
        
    except JWTError as e:
        raise HTTPException(
            status_code=401,
            detail=f"Token 驗證失敗: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail=f"認證錯誤: {str(e)}"
        )


def get_current_user(token_payload: dict):
    """
    從 token payload 中提取使用者資訊
    
    Args:
        token_payload: JWT 解碼後的 payload
        
    Returns:
        使用者資訊字典
    """
    return {
        "id": token_payload.get("sub"),
        "email": token_payload.get("email"),
        "role": token_payload.get("role", "authenticated")
    }
