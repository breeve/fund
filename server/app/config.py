"""配置管理 - 环境变量"""
from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """应用配置"""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # 应用基础配置
    app_name: str = "天天开心"
    debug: bool = False
    cors_origins: List[str] = ["http://localhost:3000"]

    # 数据库配置
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/fund"

    # JWT 配置
    jwt_secret: str = "your-secret-key-change-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expire_hours: int = 720

    # AKShare 配置
    akshare_enabled: bool = True

    # 高德地图 API 配置
    amap_api_key: str = ""


@lru_cache()
def get_settings() -> Settings:
    return Settings()


# 全局 settings 实例
settings = get_settings()
