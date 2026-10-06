import os
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "InfraSight Backend"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api"

    # Database
    DATABASE_URL: str = "sqlite:///./infrasight.db"

    # Supabase
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_KEY: str = ""

    # AI & Vision LLM
    MOCK_AI: bool = True
    LLM_PROVIDER: str = "gemini"  # "gemini" or "claude"
    LLM_API_KEY: str = ""
    LLM_MODEL: str = "gemini-1.5-flash"

    # Overpass OSM API
    OVERPASS_URL: str = "https://overpass-api.de/api/interpreter"

    # Complaints & Email
    RESEND_API_KEY: str = ""
    COMPLAINT_FROM_EMAIL: str = "complaints@infrasight.indore.gov.in"
    COMPLAINT_TO_EMAIL: str = "imc-road-works-test@indore.nic.in"
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_USE_TLS: bool = True

    # Server & Security
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173"
    SECRET_KEY: str = "infrasight-super-secret-key-indore-2025"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

    @property
    def cors_origin_list(self) -> List[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]

settings = Settings()
