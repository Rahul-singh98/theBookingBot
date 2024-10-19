from fastapi import FastAPI
from app.api.v1.endpoints import analytics

app = FastAPI(
    title="Chatbot Analytics API",
    description="API for analyzing chatbot usage and performance",
    version="1.0.0"
)

app.include_router(analytics.router, prefix="/api/v1")
