from fastapi import FastAPI
from src.db.base import Base, engine
from src.api.ingest.chatbots import router as chatbot_router
from fastapi.middleware.cors import CORSMiddleware
import os

Base.metadata.create_all(bind=engine)

app = FastAPI(title="TBB Analytics Microservice")

ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS", "*").split(",")
ALLOWED_METHODS = os.environ.get("ALLOWED_METHODS", "*").split(",")
ALLOWED_HEADERS = os.environ.get("ALLOWED_HEADERS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=ALLOWED_METHODS,
    allow_headers=ALLOWED_HEADERS,
)

app.include_router(chatbot_router, prefix="/ingestion", tags=["ingestion"])

