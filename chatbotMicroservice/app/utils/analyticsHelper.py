import httpx
from fastapi import HTTPException, status, Depends, APIRouter
import os

ANALYTICS_SERVER_URL = os.environ.get("ANALYTICS_SERVER_URL", "http://localhost:8002")


async def ingest_chat_session(session_id: str, visitor_id: str, device_type: str, state: str = "started"):
    async with httpx.AsyncClient() as client:
        try:
            data = {
                "session_id": session_id,
                "state": state,
                "visitor_id": visitor_id,
                "device_type": device_type
            }

            # Make an asynchronous POST request to the analytics server
            response = await client.post(ANALYTICS_SERVER_URL, json=data)

            # Check if the request was successful
            if response.status_code != 200:
                raise HTTPException(status_code=500, detail="Failed to send data to analytics server")
        except httpx.RequestError as e:
            raise HTTPException(status_code=500, detail=f"Error sending data to analytics server: {str(e)}")
