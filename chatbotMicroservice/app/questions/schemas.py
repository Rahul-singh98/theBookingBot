from pydantic import BaseModel, Field
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

    class Config:
        orm_mode = True
        from_attribute = True


class PaginatedQuestionOptionResponse(BaseModel):
    items: List[QuestionOptionResponse]
    pagination: PaginationResponse


class QuestionBase(BaseModel):
    bot_id: str
    question: str
    question_order: int = Field(
        ge=0, le=100, description="Question order must be between 0 and 100")
    response_type: QuestionTypes
    variable: str
    options: List[QuestionOptionResponse] = []


class QuestionCreate(QuestionBase):
    pass


class QuestionUpdate(QuestionBase):
    pass


class QuestionResponse(QuestionBase):
    id: str
    # created_by: str
    # created_at: datetime
    # updated_at: datetime

    class Config:
        orm_mode = True
        from_attributes = True


class PaginatedQuestionsResponse(BaseModel):
    items: List[QuestionResponse]
    pagination: PaginationResponse
