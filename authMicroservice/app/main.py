from fastapi import FastAPI
from app.routers.auth import auth_router
from app.routers.users import user_router
from app.database import init_db
from fastapi.middleware.cors import CORSMiddleware
import os


app = FastAPI()

# Create the database tables


@app.on_event("startup")
def on_startup():
    init_db()


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

# Register routes
app.include_router(auth_router, prefix="/api/auth")
app.include_router(user_router, prefix="/api/users")
