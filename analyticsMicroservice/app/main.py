from fastapi.middleware.cors import CORSMiddleware
from app.core.database import init_db
from fastapi import FastAPI
from fastapi import APIRouter
from app.core.config import settings
from app.api.v1.routers import chatbot_counter_router
from app.api.v1.routers import chatbot_quote_router
from app.api.v1.routers import chatbot_traffic_router


app = FastAPI(title="Metrics API")
api_router = APIRouter(prefix="/api/metrics")


ALLOWED_ORIGINS = settings.ALLOWED_ORIGINS.split(",")
ALLOWED_METHODS = settings.ALLOWED_METHODS.split(",")
ALLOWED_HEADERS = settings.ALLOWED_HEADERS.split(",")
print(settings.ALLOWED_ORIGINS)

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
api_router.include_router(chatbot_counter_router.router)
api_router.include_router(chatbot_quote_router.router)
api_router.include_router(chatbot_traffic_router.router)

app.include_router(api_router)
