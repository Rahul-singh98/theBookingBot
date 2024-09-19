from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.models import QuestionTypes


class QuestionOptionBase(BaseModel):
    option_text: str
    option_order: int


class QuestionOptionCreate(QuestionOptionBase):
    pass


class QuestionOptionUpdate(QuestionOptionBase):
    pass


class QuestionOptionResponse(QuestionOptionBase):
    id: int

    class Config:
        orm_mode = True


class QuestionBase(BaseModel):
    bot_id: int
    question: str
    question_order: int
    response_type: QuestionTypes
    variable: str
    created_by: int


class QuestionCreate(QuestionBase):
    options: List[QuestionOptionCreate] = []


class QuestionUpdate(BaseModel):
    bot_id: Optional[int] = None
    question: Optional[str] = None
    question_order: Optional[int] = None
    response_type: Optional[QuestionTypes] = None
    variable: Optional[str] = None
    options: Optional[List[QuestionOptionCreate]] = None


class QuestionResponse(QuestionBase):
    id: int
    created_at: datetime
    updated_at: datetime
    options: List[QuestionOptionResponse] = []

    class Config:
        orm_mode = True
