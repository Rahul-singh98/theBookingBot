import enum


class QuestionTypes(enum.Enum):
    DROPDOWN = "dropdown"
    DATETIME = "datetime"
    ADDRESS = "address"
    NUMBER = "number"
    CLICKLIST = "clicklist"
    INPUT = "input"
    PHONE = "phone"
    EMAIL = "email"


class AuthMethodChoices(enum.Enum):
    GET = "GET"
    POST = "POST"
    PUT = "PUT"
