import os
from functools import lru_cache
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATA_MODE: str = "indian_stock_api"
    PORT: int = 8000
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"
    INDIAN_STOCK_API_BASE_URL: str = "http://127.0.0.1:5001"
    INDIAN_STOCK_API_TIMEOUT_SECONDS: float = 8.0
    INDIAN_STOCK_API_CACHE_TTL_SECONDS: int = 20

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]

@lru_cache()
def get_settings() -> Settings:
    return Settings()
