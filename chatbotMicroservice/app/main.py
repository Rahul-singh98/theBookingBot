from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from app import models
from app.database import engine
from app.chatbot.routes import chatbot_router
from app.chats.routes import chats_router
from app.questions.routes import questions_router, options_router
from app.submit_configs.routes import submit_config_router
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from prometheus_client import make_asgi_app
import os

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="TBB Chatbot Microservice")
# app = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)

# origins = [
#     "http://localhost.tiangolo.com",
#     "https://localhost.tiangolo.com",
#     "http://localhost",
#     "http://localhost:8000",
#     "http://localhost:8001"
# ]
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

app.include_router(chatbot_router, prefix='/api/chatbots')
app.include_router(chats_router, prefix='/api/chats')
app.include_router(questions_router, prefix='/api/questions')
app.include_router(options_router, prefix='/api/options')
app.include_router(submit_config_router, prefix='/api/submit-configs')

app.mount("/static", StaticFiles(directory="app/static"), name="static")

# Add prometheus asgi middleware to route /api/metrics requests
metrics_app = make_asgi_app()
app.mount("/api/metrics", metrics_app)