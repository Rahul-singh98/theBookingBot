from pydantic import BaseModel, validator
from typing import List, Optional, Dict, Any, Union
from app.utils.constants import QuestionTypes, ComparisonOperator, LogicalOperator
from app.utils.pagination import PaginationResponse


def _normalize_question_type(qt):
    """Normalize a question_type value to QuestionTypes enum when possible.

    Accepts a QuestionTypes member or a string like 'Start' or the enum value.
    Returns a QuestionTypes member or None if unknown.
    """
    if isinstance(qt, QuestionTypes):
        return qt
    if isinstance(qt, str):
        qtl = qt.strip().lower()
        for member in QuestionTypes:
            try:
                # match by enum name or by its value string
                if member.name.lower() == qtl or str(member.value).lower() == qtl:
                    return member
            except Exception:
                continue
    return None


class DropDownOption(BaseModel):
    htmlText: str
    value: str


class ClickListAction(BaseModel):
    id: str
    text: str
    value: str


class StartQuestion(BaseModel):
    description: Optional[str] = None


class MessageQuestion(BaseModel):
    description: Optional[str] = None


class ButtonQuestion(BaseModel):
    button_id: Optional[str] = None
    wait_after: Optional[float] = None


class RadioButtonAction(BaseModel):
    text: str


class SendEmail(BaseModel):
    recipient: str


class RadioButtonQuestion(BaseModel):
    open_radio: Optional[RadioButtonAction] = None
    open_close: Optional[RadioButtonAction] = None


class EndQuestion(BaseModel):
    redirect_to: str
    queryParams: Optional[List[str]] = None


class AddressQuestion(BaseModel):
    validation: Optional[Dict[str, Any]] = None


class PaymentQuestion(BaseModel):
    merchant: str


class DropDownQuestion(BaseModel):
    id: Optional[str] = None
    name: Optional[str] = None
    default: Optional[str] = None
    options: List[DropDownOption]


class ClickListQuestion(BaseModel):
    options: List[ClickListAction]


class DateQuestion(BaseModel):
    format: str
    validation: Optional[Dict[str, Any]] = None


class TimeQuestion(BaseModel):
    format: str
    validation: Optional[Dict[str, Any]] = None


class DateTimeQuestion(BaseModel):
    format: str
    validation: Optional[Dict[str, Any]] = None


class NumberQuestion(BaseModel):
    default: Optional[float] = None
    min: Optional[float] = None
    max: Optional[float] = None


class InputQuestion(BaseModel):
    pass


class EmailQuestion(BaseModel):
    pass
    # text: str
    # validation: Optional[Dict[str, Any]]

    # @validator('text')
    # def validate_email_text(cls, v):
    #     if not v:
    #         raise ValueError("Email question text cannot be empty")
    #     return v


class PhoneQuestion(BaseModel):
    pass
    # text: str

    # @validator('text')
    # def validate_phone_text(cls, v):
    #     if not v:
    #         raise ValueError("Phone question text cannot be empty")
    #     return v

# Condition Models


class SimpleCondition(BaseModel):
    variable: str
    operator: ComparisonOperator
    value: Any


class EmailCondition(BaseModel):
    type: str
    send_to: Optional[str] = None
    check_variable: Optional[str] = None


class ComplexCondition(BaseModel):
    logical_operator: LogicalOperator
    conditions: List[Union['SimpleCondition', 'ComplexCondition', 'EmailCondition']]


class ConditionalBranch(BaseModel):
    condition: Union[SimpleCondition, ComplexCondition, EmailCondition]
    next_question_id: str


class ConditionalQuestion(BaseModel):
    branches: List[ConditionalBranch]
    default_next_question_id: str


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
        from_attributes = True


class PaginatedQuestionOptionResponse(BaseModel):
    items: List[QuestionOptionResponse]
    pagination: PaginationResponse


class QuestionBase(BaseModel):
    bot_id: str
    question: str
    question_type: QuestionTypes
    data: Optional[Dict[str, Any]] = None
    variable: Optional[str] = None
    next_ques: Optional[str] = None

    @validator('data')
    def validate_question_data(cls, v, values):
        question_type = _normalize_question_type(values.get('question_type'))
        if not v:
            return v

        if question_type == QuestionTypes.START:
            StartQuestion(**v)
        elif question_type == QuestionTypes.DROPDOWN:
            DropDownQuestion(**v)
        elif question_type == QuestionTypes.DATE:
            DateQuestion(**v)
        elif question_type == QuestionTypes.TIME:
            TimeQuestion(**v)
        elif question_type == QuestionTypes.DATETIME:
            DateTimeQuestion(**v)
        elif question_type == QuestionTypes.NUMBER:
            NumberQuestion(**v)
        elif question_type == QuestionTypes.INPUT:
            InputQuestion(**v)
        elif question_type == QuestionTypes.CONDITIONAL:
            ConditionalQuestion(**v)
        elif question_type == QuestionTypes.EMAIL_CONDITIONAL:
            ConditionalQuestion(**v)
        elif question_type == QuestionTypes.EMAIL:
            EmailQuestion(**v)
        elif question_type == QuestionTypes.PHONE:
            PhoneQuestion(**v)
        elif question_type == QuestionTypes.CLICKLIST:
            ClickListQuestion(**v)
        elif question_type == QuestionTypes.ADDRESS:
            AddressQuestion(**v)
        elif question_type == QuestionTypes.MESSAGE:
            MessageQuestion(**v)
        elif question_type == QuestionTypes.BUTTON:
            ButtonQuestion(**v)
        elif question_type == QuestionTypes.RADIO:
            RadioButtonQuestion(**v)
        elif question_type == QuestionTypes.PAYMENT:
            PaymentQuestion(**v)
        elif question_type == QuestionTypes.SENDEMAIL:
            SendEmail(**v)
        else:
            EndQuestion(**v)

        return v


class QuestionCreate(QuestionBase):
    pass


class QuestionUpdate(BaseModel):
    bot_id: Optional[str] = None
    question: Optional[str] = None
    question_type: Optional[QuestionTypes] = None
    data: Optional[Dict[str, Any]] = None
    variable: Optional[str] = None
    next_ques: Optional[str] = None

    @validator('data')
    def validate_question_data(cls, v, values):
        # If no data provided on update, skip validation
        if not v:
            return v

        question_type = _normalize_question_type(values.get('question_type'))

        if question_type == QuestionTypes.START:
            StartQuestion(**v)
        elif question_type == QuestionTypes.DROPDOWN:
            DropDownQuestion(**v)
        elif question_type == QuestionTypes.DATE:
            DateQuestion(**v)
        elif question_type == QuestionTypes.TIME:
            TimeQuestion(**v)
        elif question_type == QuestionTypes.DATETIME:
            DateTimeQuestion(**v)
        elif question_type == QuestionTypes.NUMBER:
            NumberQuestion(**v)
        elif question_type == QuestionTypes.INPUT:
            InputQuestion(**v)
        elif question_type == QuestionTypes.CONDITIONAL:
            ConditionalQuestion(**v)
        elif question_type == QuestionTypes.EMAIL_CONDITIONAL:
            ConditionalQuestion(**v)
        elif question_type == QuestionTypes.EMAIL:
            EmailQuestion(**v)
        elif question_type == QuestionTypes.PHONE:
            PhoneQuestion(**v)
        elif question_type == QuestionTypes.CLICKLIST:
            ClickListQuestion(**v)
        elif question_type == QuestionTypes.ADDRESS:
            AddressQuestion(**v)
        elif question_type == QuestionTypes.MESSAGE:
            MessageQuestion(**v)
        elif question_type == QuestionTypes.BUTTON:
            ButtonQuestion(**v)
        elif question_type == QuestionTypes.RADIO:
            RadioButtonQuestion(**v)
        elif question_type == QuestionTypes.PAYMENT:
            PaymentQuestion(**v)
        elif question_type == QuestionTypes.SENDEMAIL:
            SendEmail(**v)
        else:
            EndQuestion(**v)

        return v


class QuestionResponse(QuestionBase):
    id: str

    class Config:
        from_attributes = True


class PaginatedQuestionsResponse(BaseModel):
    items: List[QuestionResponse]
    pagination: PaginationResponse


class ConditionEvaluator:
    def __init__(self, session_variables: Dict[str, Any]):
        self.variables = session_variables
        self.operators = {
            ComparisonOperator.EQUALS: lambda a, b: b == a,
            ComparisonOperator.NOT_EQUALS: lambda a, b: b != a,
            ComparisonOperator.GREATER_THAN: lambda a, b: a > b,
            ComparisonOperator.LESS_THAN: lambda a, b: a < b,
            ComparisonOperator.GREATER_EQUAL: lambda a, b: a >= b,
            ComparisonOperator.LESS_EQUAL: lambda a, b: a <= b,
            ComparisonOperator.CONTAINS: lambda a, b: b in a,
            ComparisonOperator.NOT_CONTAINS: lambda a, b: b not in a,
            ComparisonOperator.IN: lambda a, b: a in b,
            ComparisonOperator.NOT_IN: lambda a, b: a not in b,
        }

    def evaluate_simple_condition(self, condition: SimpleCondition) -> bool:
        if condition.variable not in self.variables:
            return False

        variable_value = self.variables[condition.variable]
        compare_func = self.operators[condition.operator]

        try:
            return compare_func(variable_value, condition.value)
        except (TypeError, ValueError):
            return False
        
    def evaluate_email_condition(self, condition: EmailCondition) -> bool:
        print(f"Evaluating email condition: {condition}")
        if condition.type == "GET_QUOTE":
            return True
        return False

    def evaluate_complex_condition(self, condition: ComplexCondition) -> bool:
        results = [
            self.evaluate_simple_condition(c) if isinstance(c, SimpleCondition)
            else self.evaluate_complex_condition(c)
            for c in condition.conditions
        ]

        if condition.logical_operator == LogicalOperator.AND:
            return all(results)
        return any(results)

    def evaluate(self, condition: Union[SimpleCondition, ComplexCondition, EmailCondition]) -> bool:
        if isinstance(condition, SimpleCondition):
            return self.evaluate_simple_condition(condition)
        if isinstance(condition, EmailCondition):
            return self.evaluate_email_condition(condition)
        return self.evaluate_complex_condition(condition)


def parse_condition_data(condition_dict: Dict) -> Union[SimpleCondition, ComplexCondition, EmailCondition]:
    """
    Parse a dictionary of condition data into SimpleCondition or ComplexCondition instances.
    """
    # If the dictionary has a logical_operator, it's a complex condition
    if "logical_operator" in condition_dict:
        nested_conditions = [
            parse_condition_data(cond) for cond in condition_dict["conditions"]
        ]
        return ComplexCondition(
            logical_operator=condition_dict["logical_operator"],
            conditions=nested_conditions
        )
    elif "type" in condition_dict:
        return EmailCondition(
            type=condition_dict["type"],
            send_to=condition_dict.get("send_to"),
            check_variable=condition_dict.get("check_variable")
        )
    else:
        return SimpleCondition(
            variable=condition_dict["variable"],
            operator=condition_dict["operator"],
            value=condition_dict["value"]
        )
