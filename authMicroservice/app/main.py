from dotenv import load_dotenv
load_dotenv()


from fastapi import FastAPI
from app.routers.auth import auth_router
from app.routers.users import user_router
from app.routers.groups import groups_router
from app.routers.permissions import permissions_router
from app.database import init_db
from fastapi.middleware.cors import CORSMiddleware
from app.utils.super_admin import create_super_admin #, create_organization_admin
import os


app = FastAPI()


# Create the database tables
@app.on_event("startup")
def on_startup():
    init_db()

    print("Creating Super Admin Started")
    create_super_admin()
    print("Creating Super Admin Completed")

    print("Creating Organization Admin Started")
    # create_organization_admin()
    print("Creating Organization Admin Completed")


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
app.include_router(groups_router, prefix="/api/groups")
app.include_router(permissions_router, prefix="/api/permissions")
