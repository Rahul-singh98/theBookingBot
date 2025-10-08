from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.submit_configs import schemas
from app.dependencies import check_permission
from app.submit_configs import crud
from app.utils.pagination import Pagination

submit_config_router = APIRouter()


@submit_config_router.get(
    "", response_model=schemas.PaginatedChatSessionReponse)
async def list_configurations(
    page: int = 1, size: int = 100,
    db: Session = Depends(get_db),
    _=Depends(check_permission("submitConfigs:list"))
):
    offset = Pagination.get_offset(page, size)
    items, total = crud.list_submit_configurations(db, offset, size)
    paginated_obj = Pagination.paginate(total, size, page)
    return schemas.PaginatedChatSessionReponse(
        items=[schemas.ChatbotSubmitConfigurationResponse.model_validate(
            item) for item in items],
        pagination=paginated_obj
    )


@submit_config_router.get("{config_id}", response_model=schemas.ChatbotSubmitConfigurationResponse)
async def read_configuration(config_id: str, db: Session = Depends(get_db)):
    config = await crud.get_submit_configuration(db, config_id)
    if not config:
        raise HTTPException(status_code=404, detail="Configuration not found")
    return config


@submit_config_router.post("", response_model=schemas.ChatbotSubmitConfigurationResponse)
def create_configuration(
    config: schemas.ChatbotSubmitConfigurationCreate,
    db: Session = Depends(get_db),
    _=Depends(check_permission("submitConfigs:create"))
):
    return crud.create_submit_configuration(db, config)


@submit_config_router.put("{config_id}", response_model=schemas.ChatbotSubmitConfigurationResponse)
async def update_configuration(config_id: str, config: schemas.ChatbotSubmitConfigurationUpdate, db: Session = Depends(get_db)):
    updated_config = await crud.update_submit_configuration(db, config_id, config)
    if not updated_config:
        raise HTTPException(status_code=404, detail="Configuration not found")
    return updated_config


@submit_config_router.delete("{config_id}", response_model=schemas.ChatbotSubmitConfigurationResponse)
async def delete_configuration(config_id: str, db: Session = Depends(get_db)):
    deleted_config = await crud.delete_submit_configuration(db, config_id)
    if not deleted_config:
        raise HTTPException(status_code=404, detail="Configuration not found")
    return deleted_config
