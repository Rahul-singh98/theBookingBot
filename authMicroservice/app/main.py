from fastapi import FastAPI
from app.users import routes as user_routes
from app.auth import routes as auth_routes
from app.database import engine
from app.models import Base
from fastapi.middleware.cors import CORSMiddleware
import os


# Create the database tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

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

# Register routes
app.include_router(user_routes.router, prefix="/api/users")
app.include_router(auth_routes.router, prefix="/api/auth")
