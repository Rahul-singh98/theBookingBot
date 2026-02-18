from fastapi import HTTPException
import httpx
from app.core.config import settings
from app.core.constants import ChatbotEndpoints


CHATBOT_SERVICE_URL = settings.CHATBOT_SERVICE_URL


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
