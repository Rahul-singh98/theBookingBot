from fastapi import APIRouter, Depends, HTTPException, Query, status, UploadFile, Request, Header
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.chatbot.schemas import (
    ChatbotConfigurationResponse, PaginatedChatbotConfigurationResponse,
    ChatbotConfigurationCreate, ChatbotConfigurationUpdate,
    ChatbotSubmitConfigurationResponse, PaginatedChatbotSubmitConfigurationResponse,
    ChatbotSubmitConfigurationUpdate, ChatbotSubmitConfigurationCreate,
    PaymentRequest
)
from app.chatbot import crud
from app.utils.pagination import Pagination
from app.dependencies import check_permission, get_visitor_id, check_username_exists
from app.dependencies import CHATBOTS_GAUGE
from typing import Annotated
import os
import stripe


stripe.api_key = os.environ.get("STRIPE_API_KEY")
chatbot_router = APIRouter()


@chatbot_router.get("", response_model=PaginatedChatbotConfigurationResponse)
async def list_chatbots(
    user_id: str = Query("", max_length=45),
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(10, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db),
    visitor: str = Depends(get_visitor_id),
    _: dict = Depends(check_permission("chatbots:list"))
):
    # Calculate offset
    offset = Pagination.get_offset(page, size)

    configurations, total = crud.list_chatbots_by_user_id(
        db, offset, size, user_id) if user_id else crud.list_chatbots(db, offset, size)

    pagination_obj = Pagination.paginate(total, size, page)

    return PaginatedChatbotConfigurationResponse(items=configurations, pagination=pagination_obj)


@chatbot_router.get("/{chatbot_id}", response_model=ChatbotConfigurationResponse)
def read_chatbot(
    chatbot_id: str,
    db: Session = Depends(get_db),
    # _: dict = Depends(check_permission("chatbots:read"))
):
    db_chatbot = crud.get_chatbot(db, chatbot_id=chatbot_id)
    if db_chatbot is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Chatbot not found")
    # return ChatbotConfigurationResponse.from_orm(db_chatbot)
    return db_chatbot


@chatbot_router.get("/{chatbot_id}/history", response_model=ChatbotConfigurationResponse)
def read_chatbot_history(
    chatbot_id: str,
    db: Session = Depends(get_db)
):
    db_chatbot = crud.get_chatbot(db, chatbot_id=chatbot_id)
    if db_chatbot is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Chatbot not found")

    db_chatbot.chat_sessions
    return db_chatbot


@chatbot_router.post("", response_model=ChatbotConfigurationResponse)
async def create_chatbot(
    chatbot: ChatbotConfigurationCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(check_permission("chatbots:write")),
    authorization: str = Header(None)
):
    print("Checking username")
    if await check_username_exists(chatbot.name):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail='User/Chatbot with same name already exists')

    if authorization and authorization.lower().startswith('bearer'):
        authorization = authorization.split(" ")[1]

    print("username not found, creating new chatbot")
    new_chatbot = await crud.create_chatbot(db=db, chatbot=chatbot,
                                            user_id=current_user.get("id"), token=authorization)

    CHATBOTS_GAUGE.labels(bot_id=new_chatbot.id, bot_name=new_chatbot.name,
                          bot_author=current_user.get("id")).inc()

    return new_chatbot


@chatbot_router.put("/{chatbot_id}", response_model=ChatbotConfigurationResponse)
def update_chatbot(chatbot_id: str, bot_update: ChatbotConfigurationUpdate, db: Session = Depends(get_db)):
    updated_bot = crud.update_chatbot(
        db=db, chatbot_id=chatbot_id, bot_update=bot_update)
    if not updated_bot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Chatbot not found")
    return updated_bot


@chatbot_router.delete("/{chatbot_id}", response_model=ChatbotConfigurationResponse)
def delete_chatbot(chatbot_id: str, db: Session = Depends(get_db)):
    db_bot = crud.delete_chatbot(db=db, chatbot_id=chatbot_id)
    CHATBOTS_GAUGE.labels(
        bot_id=chatbot_id, bot_name=db_bot.name, bot_author=db_bot.created_by).dec()
    if db_bot is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Chatbot not found")
    return db_bot


@chatbot_router.get("/submit-configs", response_model=PaginatedChatbotSubmitConfigurationResponse)
def list_chatbots_sumit_configs(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(10, ge=1, le=100, description="Items per page")
):
    # Calculate offset
    offset = Pagination.get_offset(page, size)

    configurations, total = crud.list_chatbots_submit_configs(db, offset, size)

    pagination_obj = Pagination.paginate(total, size, page)

    return PaginatedChatbotSubmitConfigurationResponse(items=configurations, pagination=pagination_obj)


@chatbot_router.get("/submit-configs/{config_id}", response_model=ChatbotSubmitConfigurationResponse)
def read_chatbot_submit_configs(config_id: str, db: Session = Depends(get_db)):
    db_chatbot = crud.get_chatbot_submit_config(db, config_id=config_id)
    if db_chatbot is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Submit Configurations not found")
    return db_chatbot


@chatbot_router.post("/submit-configs/")
def create_chatbot_submit_configs(sumbit_config: ChatbotSubmitConfigurationCreate, db: Session = Depends(get_db)):
    return crud.create_chatbot_submit_config(db=db, config=sumbit_config)


@chatbot_router.put("/submit-configs/{config_id}", response_model=ChatbotSubmitConfigurationResponse)
def update_chatbot_submit_configs(config_id: str, bot_update: ChatbotSubmitConfigurationUpdate, db: Session = Depends(get_db)):
    updated_bot = crud.update_chatbot_submit_config(
        db=db, config_id=config_id, bot_update=bot_update)
    if not updated_bot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Chatbot not found")
    return updated_bot


@chatbot_router.delete("/submit-configs/{config_id}", response_model=ChatbotSubmitConfigurationResponse)
def delete_chatbot_submit_configs(config_id: str, db: Session = Depends(get_db)):
    db_bot = crud.delete_chatbot_submit_config(db=db, config_id=config_id)
    if db_bot is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Chatbot not found")
    return db_bot


@chatbot_router.post("/upload")
async def upload_file(file: UploadFile):
    file_path = os.path.join("app/static", file.filename)
    with open(file_path, "wb") as f:
        contents = await file.read()
        f.write(contents)

    return {"file_path": f""}

# Create payment intent endpoint


@chatbot_router.post("/create-payment-intent")
async def create_payment_intent(payment_request: PaymentRequest):
    try:
        intent = stripe.PaymentIntent.create(
            amount=payment_request.amount,
            currency=payment_request.currency,
            automatic_payment_methods={
                'enabled': True,
            }
        )
        return {"clientSecret": intent["client_secret"]}
    except stripe.error.StripeError as e:
        # Handle errors from Stripe API
        return HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        return HTTPException(status_code=500, detail="Internal server error")

# Webhook endpoint to handle Stripe events (optional)


@chatbot_router.post("/webhook")
async def stripe_webhook(request: Request):
    webhook_secret = "whsec_your_webhook_secret"  # Replace with your webhook secret
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        # Verify the webhook signature
        event = stripe.Webhook.construct_event(
            payload, sig_header, webhook_secret)
        # Handle the event (e.g., payment success)
        if event["type"] == "payment_intent.succeeded":
            payment_intent = event["data"]["object"]
            print(f"Payment succeeded: {payment_intent}")
        elif event["type"] == "payment_intent.payment_failed":
            payment_intent = event["data"]["object"]
            print(f"Payment failed: {payment_intent}")
        return JSONResponse({"status": "success"})
    except stripe.error.SignatureVerificationError as e:
        return HTTPException(status_code=400, detail="Invalid signature")
    except Exception as e:
        return HTTPException(status_code=400, detail="Webhook error")
