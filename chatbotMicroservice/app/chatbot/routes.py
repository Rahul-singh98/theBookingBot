from fastapi import APIRouter, Depends, HTTPException, Query, status, UploadFile, Request, Header, Body
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
from app.utils.crypto_utils import decrypt_value, encrypt_value
from app.utils.pagination import Pagination
from app.dependencies import (
    check_permission, get_visitor_id, check_user_exists,
    # create_chatbot_counter, delete_chatbot_counter
)
from app.dependencies import CHATBOTS_GAUGE, PAYMENTS_COUNTER, PAYMENTS_AMOUNT
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
    # _: dict = Depends(check_permission("chatbots:list"))
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
    # return ChatbotConfigurationResponse.model_validate(db_chatbot)
    return db_chatbot


@chatbot_router.get("/{chatbot_id}/keys")
def get_chatbot_keys(chatbot_id: str, db: Session = Depends(get_db)):
    db_chatbot = crud.get_chatbot(db, chatbot_id=chatbot_id)
    if db_chatbot is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Chatbot not found")

    # decrypt keys if present
    gm_key = os.environ.get("MAPS_CLIENT_KEY", "")
    sp_key = os.environ.get("STRIPE_CLIENT_KEY", "")

    return {"gm_key": gm_key, "sp_key": sp_key}


@chatbot_router.post("/{chatbot_id}/keys")
def set_chatbot_keys(chatbot_id: str, payload: dict = Body(...), db: Session = Depends(get_db)):
    db_chatbot = crud.get_chatbot(db, chatbot_id=chatbot_id)
    if db_chatbot is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Chatbot not found")

    try:
        gm = payload.get("gm_key")
        sp = payload.get("sp_key")
        if gm:
            db_chatbot.gm_key_encrypted = encrypt_value(gm)
        if sp:
            db_chatbot.sp_key_encrypted = encrypt_value(sp)
        db.commit()
        db.refresh(db_chatbot)
        return {"status": "ok"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


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
    if authorization and authorization.lower().startswith('bearer'):
        authorization = authorization.split(" ")[1]

    if not await check_user_exists(chatbot.created_by, authorization):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail='User not exists, please provide valid user id')

    if crud.get_chatbot_by_name(db, chatbot.name):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail='Chatbot with this name already exists, please choose different name')

    new_chatbot = await crud.create_chatbot(db=db, chatbot=chatbot,
                                            user_id=chatbot.created_by)

    CHATBOTS_GAUGE.labels(bot_id=new_chatbot.id, bot_name=new_chatbot.name,
                          bot_author=chatbot.created_by).inc()
    # create_chatbot_counter(bot_id=new_chatbot.id, bot_name=new_chatbot.name,
    #                        author=chatbot.created_by, token=authorization)

    return new_chatbot


@chatbot_router.put("/{chatbot_id}", response_model=ChatbotConfigurationResponse)
def update_chatbot(
        chatbot_id: str, bot_update: ChatbotConfigurationUpdate,
        db: Session = Depends(get_db),
        _: dict = Depends(check_permission("chatbots:write")),
        authorization: str = Header(None)
):
    updated_bot = crud.update_chatbot(
        db=db, chatbot_id=chatbot_id, bot_update=bot_update)
    if not updated_bot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Chatbot not found")
    return updated_bot


@chatbot_router.delete("/{chatbot_id}", response_model=ChatbotConfigurationResponse)
def delete_chatbot(
    chatbot_id: str, db: Session = Depends(get_db),
    _: dict = Depends(check_permission("chatbots:delete")),
    authorization: str = Header(None)
):
    db_bot = crud.delete_chatbot(db=db, chatbot_id=chatbot_id)
    CHATBOTS_GAUGE.labels(
        bot_id=chatbot_id, bot_name=db_bot.name, bot_author=db_bot.created_by).dec()
    # delete_chatbot_counter(
    #     bot_id=chatbot_id, bot_name=db_bot.name, author=db_bot.created_by, token=authorization)
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
        # include metadata to identify bot/subadmin
        metadata = {}
        if payment_request.bot_id:
            metadata['bot_id'] = payment_request.bot_id
        if payment_request.v_id:
            metadata['v_id'] = payment_request.v_id

        intent = stripe.PaymentIntent.create(
            amount=payment_request.amount,
            currency=payment_request.currency,
            metadata=metadata,
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
            # increment metrics if metadata available
            try:
                v_id = payment_intent.get('metadata', {}).get('v_id')
                bot_id = payment_intent.get('metadata', {}).get('bot_id')
                amount = payment_intent.get('amount')
                if v_id and bot_id:
                    PAYMENTS_COUNTER.labels(bot_id=bot_id, v_id=v_id).inc()
                    if amount is not None:
                        try:
                            PAYMENTS_AMOUNT.labels(
                                bot_id=bot_id, v_id=v_id).observe(float(amount))
                        except Exception:
                            pass
            except Exception:
                pass
        elif event["type"] == "payment_intent.payment_failed":
            payment_intent = event["data"]["object"]
            print(f"Payment failed: {payment_intent}")
        return JSONResponse({"status": "success"})
    except stripe.error.SignatureVerificationError as e:
        return HTTPException(status_code=400, detail="Invalid signature")
    except Exception as e:
        return HTTPException(status_code=400, detail="Webhook error")
