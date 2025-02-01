from enum import Enum


class UserStatus(str, Enum):
    ACTIVE = 'active'
    INACTIVE = 'inactive'
    SUSPENDED = 'suspended'
    PASSWORD_RESET_REQUIRED = 'password_reset_required'
