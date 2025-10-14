import os
from fastapi.middleware.cors import CORSMiddleware
from app.database import init_db
from fastapi import FastAPI
from app.chatbot_counter.routes import chatbot_counter_router
from app.chatbot_quotes.routes import chatbot_quotes_router
from app.chatbot_traffic.routes import chatbot_traffic_router
from dotenv import load_dotenv
load_dotenv()


app = FastAPI()


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


@app.on_event("startup")
def startup():
    init_db()


# Register routes
app.include_router(chatbot_counter_router, prefix="/api/metrics/chatbot_counter")
app.include_router(chatbot_quotes_router, prefix="/api/metrics/chatbot_quotes")
app.include_router(chatbot_traffic_router, prefix="/api/metrics/chatbot_traffic")
