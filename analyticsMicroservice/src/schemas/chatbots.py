from pydantic import BaseModel
from datetime import datetime
from enum import Enum

class State(str, Enum):
    started = "started"
    completed = "completed"

class IngestionBase(BaseModel):
    session_id: str
    state: State
    visitor_id: str
    device_type: str

class IngestionCreate(IngestionBase):
    pass

class IngestionUpdate(IngestionBase):
    pass

class Ingestion(IngestionBase):
    id: int

    class Config:
        orm_mode = True
