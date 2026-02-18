from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///../common.db"
    AUTH_SERVICE_URL: str = "http://localhost:8000"
    CHATBOT_SERVICE_URL: str = "http://localhost:8001"
    ALLOWED_ORIGINS: str = "*"
    ALLOWED_METHODS: str = "*"
    ALLOWED_HEADERS: str = "*"


    class Config:
        env_file = ".env"


settings = Settings()
