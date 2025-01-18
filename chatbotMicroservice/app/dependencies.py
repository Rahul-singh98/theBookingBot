from typing import Optional
from fastapi import Header, HTTPException, Depends
import httpx
import os
from prometheus_client import Counter, Gauge, Histogram

AUTH_SERVICE_URL = os.environ.get("AUTH_SERVICE_URL", "http://localhost:8000")


async def get_token(
    authorization: Optional[str] = Header(None)
) -> str:
    """Extract and validate the Bearer token from the Authorization header."""

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
                "message": "Please provide 'Bearer {token}'"
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
    ENDPOINT = "/api/auth/check-permissions"

    async with httpx.AsyncClient() as client:
        response = await client.get(
            AUTH_SERVICE_URL + ENDPOINT,
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

# Prometheus metrics
# Metric to track the number of chatbots that are up and running
CHATBOTS_GAUGE = Gauge(
    'chatbots_gauge', 
    'Number of chatbots up and running',
    ['bot_id', 'bot_name', 'bot_author']
)

# Metric to track traffic analysis
CHATBOTS_TRAFFIC = Counter(
    'chatbots_traffic', 
    'Total number of sessions processed by chatbots',
    ['bot_id', 'bot_author', "s_id", 'v_id']
)

# # Metric to track completed payments
# PAYMENT_COMPLETED_COUNTER = Counter(
#     'payment_completed_total', 
#     'Total number of completed payments by user', 
#     ['visitor_id', 'session_id']
# )

# # Metric to track booking amount
# BOOKING_AMOUNT_HISTOGRAM = Histogram(
#     'booking_amount', 
#     'Distribution of booking amounts', 
#     ['visitor_id', 'session_id']
# )
