from enum import Enum


class QuestionTypes(str, Enum):
    START = "Start"
    DROPDOWN = "Dropdown"
    DATE = "Date"
    TIME = "Time"
    DATETIME = "DateTime"
    NUMBER = "Number"
    INPUT = "Input"
    CONDITIONAL = "Conditional"
    EMAIL = "Email"
    PHONE = "Phone"
    CLICKLIST = "ClickList"
    ADDRESS = "Address"
    PAYMENT = "Payment"
    END = "End"


class ComparisonOperator(str, Enum):
    EQUALS = "eq"
    NOT_EQUALS = "ne"
    GREATER_THAN = "gt"
    LESS_THAN = "lt"
    GREATER_EQUAL = "gte"
    LESS_EQUAL = "lte"
    CONTAINS = "contains"
    NOT_CONTAINS = "not_contains"
    IN = "in"
    NOT_IN = "not_in"


class LogicalOperator(str, Enum):
    AND = "and"
    OR = "or"


class AuthMethodChoices(str, Enum):
    NONE = "none"
    BASIC = "basic"
    BEARER = "bearer"
