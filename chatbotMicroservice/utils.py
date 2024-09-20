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

    @classmethod
    def choices(cls):
        return [(key.value, key.name) for key in cls]


class AuthMethodChoices(Enum):
    GET = "GET"
    POST = "POST"
    PUT = "PUT"

    @classmethod
    def choices(cls):
        return [(key.value, key.name) for key in cls]
