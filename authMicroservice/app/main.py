from fastapi import FastAPI
from app.users import routes as user_routes
from app.auth import routes as auth_routes
from app.database import engine
from app.models import Base

# Create the database tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Register routes
app.include_router(user_routes.router, prefix="/api/users")
app.include_router(auth_routes.router, prefix="/api/auth")
