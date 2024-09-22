from pydantic import BaseModel
from typing import List
from datetime import datetime
from app.utils.constants import QuestionTypes
from app.utils.pagination import PaginationResponse


class QuestionOptionBase(BaseModel):
    question_id: str
    option_text: str
    option_order: int


class QuestionOptionCreate(QuestionOptionBase):
    pass


class QuestionOptionUpdate(QuestionOptionBase):
    pass


class QuestionOptionResponse(QuestionOptionBase):
    id: str


class PaginatedQuestionOptionResponse(BaseModel):
    items: List[QuestionOptionResponse]
    pagination: PaginationResponse


class QuestionBase(BaseModel):
    bot_id: str
    question: str
    question_order: int
    response_type: QuestionTypes
    variable: str
    created_by: str
    options: List[QuestionOptionCreate] = []


class QuestionCreate(QuestionBase):
    pass


class QuestionUpdate(QuestionBase):
    pass


class QuestionResponse(QuestionBase):
    id: str
    created_at: datetime
    updated_at: datetime


class PaginatedQuestionsResponse(BaseModel):
    items: List[QuestionOptionResponse]
    pagination: PaginationResponse
