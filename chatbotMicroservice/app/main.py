from fastapi import FastAPI
from app import models
from app.database import engine
from app.chatbot.routes import chatbot_router
from app.chats.routes import chats_router
from app.questions.routes import questions_router
from fastapi.staticfiles import StaticFiles

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="TBB Chatbot Microservice")
# app = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)

app.include_router(chatbot_router, prefix='/api/chatbots')
app.include_router(chats_router, prefix='/api/chats')
app.include_router(questions_router, prefix='/api/questions')

app.mount("/static", StaticFiles(directory="app/static"), name="static")
