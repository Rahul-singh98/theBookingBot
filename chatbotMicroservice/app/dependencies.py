from typing import Optional
from fastapi import Header, HTTPException, Depends
import httpx
import os
from enum import Enum
from prometheus_client import Gauge, Counter, Histogram

AUTH_SERVICE_URL = os.environ.get("AUTH_SERVICE_URL", "http://localhost:8000")
# METRIC_SERVICE_URL = os.environ.get(
#     "METRIC_SERVICE_URL", "http://localhost:8002")


class AuthEndpoints(str, Enum):
    CHECK_PERMISSIONS = "/api/auth/check-permissions"
    CHECK_USERNAME = "/api/users/check/username"
    CHECK_USER = "/api/users"


class MetricsEndpoints(str, Enum):
    CHATBOT_COUNTER = "/api/metrics/chatbot_counter"


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


async def create_subadmin(
    username: str,
    password: str,
    email: str,
    token: str
) -> dict:
    data = {
        'username': username,
        'email': email,
        'password': password,
        'status': 'password_reset_required'
    }

    async with httpx.AsyncClient() as client:
        print("token", token)  # Debugging
        response = await client.post(
            AUTH_SERVICE_URL + AuthEndpoints.CHECK_USER.value,
            json=data,
            headers={"Authorization": f"Bearer {token}"}
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail=response.json().get("detail", "Something went wrong")
        )

    return response.json()


# async def create_chatbot_counter(
#     bot_id: str,
#     bot_name: str,
#     author: str,
#     token: str
# ) -> dict:
#     data = {
#         'bot_id': bot_id,
#         'bot_name': bot_name,
#         'author': author,
#         'status': 'active'
#     }

#     async with httpx.AsyncClient() as client:
#         response = await client.post(
#             METRIC_SERVICE_URL + MetricsEndpoints.CHATBOT_COUNTER.value,
#             json=data,
#             headers={"Authorization": f"Bearer {token}"}
#         )

#     if response.status_code != 200:
#         raise HTTPException(
#             status_code=response.status_code,
#             detail=response.json().get("detail", "Something went wrong")
#         )

#     return response.json()


# async def delete_chatbot_counter(
#     bot_id: str,
#     bot_name: str,
#     author: str,
#     token: str
# ) -> dict:
#     data = {
#         'bot_id': bot_id,
#         'bot_name': bot_name,
#         'author': author,
#         'status': 'inactive'
#     }

#     async with httpx.AsyncClient() as client:
#         response = await client.put(
#             METRIC_SERVICE_URL + MetricsEndpoints.CHATBOT_COUNTER.value,
#             json=data,
#             headers={"Authorization": f"Bearer {token}"}
#         )

#     if response.status_code != 200:
#         raise HTTPException(
#             status_code=response.status_code,
#             detail=response.json().get("detail", "Something went wrong")
#         )

#     return response.json()

# Prometheus metrics
# Metric to track the number of chatbots that are up and running
CHATBOTS_GAUGE = Gauge(
    'chatbots_gauge_total',
    'Number of chatbots up and running',
    ['bot_id', 'bot_name', 'bot_author']
)

# Metric to track traffic analysis
CHATBOTS_TRAFFIC = Counter(
    'chatbots_traffic_total',
    'Total number of sessions processed by chatbots',
    ['bot_id', 'bot_author', "s_id", 'v_id']
)

# Regional sessions label (region is coarse; see note)
CHATBOTS_REGIONAL = Counter(
    'chatbots_regional_sessions_total',
    'Number of sessions by region for chatbots',
    ['bot_id', 'v_id', "lat", 'long']
)

# Payments counters and amount histogram
PAYMENTS_COUNTER = Counter(
    'payments_total',
    'Total number of successful payments processed',
    ['bot_id', 'v_id']
)

PAYMENTS_AMOUNT = Histogram(
    'payments_amount_usd',
    'Histogram of payment amounts (USD cents)',
    ['bot_id', 'v_id']
)

# Quotes / get-quotes bill events
QUOTES_COUNTER = Counter(
    'quotes_requests_total',
    'Number of quote requests / bill generation events',
    ['bot_id', 'v_id']
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
