from sqlalchemy.orm import Session
from src.models.chatbots import ChatbotIngestion
from src.schemas.chatbots import IngestionCreate, IngestionUpdate

class ChatbotRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_ingestion(self, ingestion: IngestionCreate):
        db_ingestion = ChatbotIngestion(
            datetime=ingestion.datetime,
            session_id=ingestion.session_id,
            state=ingestion.state,
            visitor_id=ingestion.visitor_id,
            device_type=ingestion.device_type
        )
        self.db.add(db_ingestion)
        self.db.commit()
        self.db.refresh(db_ingestion)
        return db_ingestion

    def get_ingestion(self, ingestion_id: int):
        return self.db.query(ChatbotIngestion).filter(ChatbotIngestion.id == ingestion_id).first()

    def update_ingestion(self, ingestion_id: int, ingestion: IngestionUpdate):
        db_ingestion = self.db.query(ChatbotIngestion).filter(ChatbotIngestion.id == ingestion_id).first()
        if db_ingestion:
            db_ingestion.datetime = ingestion.datetime
            db_ingestion.session_id = ingestion.session_id
            db_ingestion.state = ingestion.state
            db_ingestion.visitor_id = ingestion.visitor_id
            db_ingestion.device_type = ingestion.device_type
            self.db.commit()
            self.db.refresh(db_ingestion)
            return db_ingestion
        return None

    def get_all_ingestions(self):
        return self.db.query(ChatbotIngestion).all()
