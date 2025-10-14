from typing import Optional
from fastapi import Header, HTTPException, Depends
import httpx
import os
from enum import Enum

AUTH_SERVICE_URL = os.environ.get("AUTH_SERVICE_URL", "http://localhost:8000")
CHATBOT_SERVICE_URL = os.environ.get(
    "CHATBOT_SERVICE_URL", "http://localhost:8001")


class AuthEndpoints(str, Enum):
    CHECK_PERMISSIONS = "/api/auth/check-permissions"
    CHECK_USERNAME = "/api/users/check/username"
    CHECK_USER = "/api/users"


class ChatbotEndpoints(str, Enum):
    CHATBOT_CONFIGURATIONS = "/api/chatbots"


async def get_token(
    authorization: Optional[str] = Header(None)
) -> str:
    """Extract and validate the Bearer token from the Authorization header."""
    print("authorization", authorization)
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(
            status_code=401,
            detail={
                "error": "Invalid or missing token",
                "received_header": authorization,
                "message": "Please provide 'Bearer {token}'"
            }
        )
    token = authorization.split(" ")[1]
    return token


async def get_visitor_id(
    visitor: Optional[str] = Header(None)
) -> str:
    """Extract and validate the Bearer token from the Authorization header."""
    if not visitor:
        raise HTTPException(
            status_code=422,
            detail={
                "error": "Invalid or missing visitor id",
                "received_header": visitor,
                "message": "Please provide valid visitor id"
            }
        )
    return visitor


async def check_permission_logic(
    required_permission: str,
    token: str
) -> dict:
    """Check permission logic implementation."""
    headers = {"Authorization": f"Bearer {token}"}
    params = {"required_permission": required_permission}

    async with httpx.AsyncClient() as client:
        response = await client.get(
            AUTH_SERVICE_URL + AuthEndpoints.CHECK_PERMISSIONS.value,
            headers=headers,
            params=params
        )

    if response.status_code != 200:
        print(response.json())
        raise HTTPException(
            status_code=response.status_code,
            detail=response.json().get("detail", "Permission check failed")
        )

    print("Response", response.json())
    print("Response", response.content)
    return response.json()


def check_permission(required_permission: str):
    """Create a dependency that checks for a specific permission."""
    async def check_permission_dependency(
        token: str = Depends(get_token)
    ) -> dict:
        return await check_permission_logic(required_permission, token)
    return check_permission_dependency


async def check_username_exists(
    username: str
) -> bool:
    params = {"username": username}

    async with httpx.AsyncClient() as client:
        response = await client.get(
            AUTH_SERVICE_URL + AuthEndpoints.CHECK_USERNAME.value,
            params=params
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail=response.json().get("detail", "Somethig went wrong")
        )

    return response.json().get('exists')


async def check_user_exists(
    userid: str,
    token: str = None
) -> bool:
    async with httpx.AsyncClient() as client:
        response = await client.get(
            AUTH_SERVICE_URL + AuthEndpoints.CHECK_USER.value + f"/{userid}",
            headers={"Authorization": f"Bearer {token}"}
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail=response.json().get("detail", "Somethig went wrong")
        )

    return response.json().get('email')


async def get_chatbots_info(
    ids: list,
    token: str = None
) -> dict:
    async with httpx.AsyncClient() as client:
        response = await client.post(
            CHATBOT_SERVICE_URL + ChatbotEndpoints.CHATBOT_CONFIGURATIONS.value + "/bulk",
            json={"ids": ids, "fields": ["id", "name", "created_by"]},
            # headers={"Authorization": f"Bearer {token}"}
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail=response.json().get("detail", "No Chatbots found")
        )

    return response.json()