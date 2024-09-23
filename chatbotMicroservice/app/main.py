from fastapi import FastAPI
from app import models
from app.database import engine
from app.chatbot.routes import chatbot_router
from app.chats.routes import chats_router
from app.questions.routes import questions_router
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
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
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chatbot_router, prefix='/api/chatbots')
app.include_router(chats_router, prefix='/api/chats')
app.include_router(questions_router, prefix='/api/questions')

app.mount("/static", StaticFiles(directory="app/static"), name="static")
