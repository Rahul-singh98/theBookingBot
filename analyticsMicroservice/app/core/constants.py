from enum import Enum


class AuthEndpoints(str, Enum):
    CHECK_PERMISSIONS = "/api/auth/check-permissions"
    CHECK_USERNAME = "/api/users/check/username"
    CHECK_USER = "/api/users"


class ChatbotEndpoints(str, Enum):
    CHATBOT_CONFIGURATIONS = "/api/chatbots"
