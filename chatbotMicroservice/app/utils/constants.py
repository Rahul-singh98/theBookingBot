from enum import Enum


class QuestionTypes(Enum):
    DROPDOWN = "dropdown"
    DATETIME = "datetime"
    ADDRESS = "address"
    NUMBER = "number"
    CLICKLIST = "clicklist"
    INPUT = "input"
    PHONE = "phone"
    EMAIL = "email"


class AuthMethodChoices(str, Enum):
    NONE = "none"
    BASIC = "basic"
    BEARER = "bearer"
