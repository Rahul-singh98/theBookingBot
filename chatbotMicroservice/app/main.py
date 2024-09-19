from fastapi import FastAPI
from app import models
from app.database import engine
from app.chatbot import routes as chatbot_routes
from app.chats import routes as chats_routes
from app.questions import routes as questions_routes

models.Base.metadata.create_all(bind=engine)

app = FastAPI()
# app = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)

app.include_router(chatbot_routes.router, prefix='/chatbots')
app.include_router(chats_routes.router, prefix='/chats')
app.include_router(questions_routes.router, prefix='/questions')
