from sqlalchemy.orm import Session
from src.db import base

def get_db():
    db = base.SessionLocal()
    try:
        yield db
    finally:
        db.close()
