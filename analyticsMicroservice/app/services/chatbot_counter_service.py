from typing import Optional, Dict
from datetime import datetime
from sqlalchemy.orm import Session

from app.repositories.chatbot_counter_repository import ChatbotCounterRepository
from app.schemas import chatbot_counter_schema as schema
from app.integrations.chatbot_api_client import get_chatbots_info


class ChatbotCounterService:
    """Business logic for Chatbot Counters."""

    def __init__(self, db: Session):
        self.repo = ChatbotCounterRepository(db)

    async def get_total(
        self,
        start: Optional[str] = None,
        end: Optional[str] = None,
        status: Optional[str] = None
    ) -> int:
        """Return total count of chatbots."""
        start_dt = datetime.fromisoformat(start) if start else None
        end_dt = datetime.fromisoformat(end) if end else None
        status_bool = self._parse_status(status)
        return self.repo.get_total(start_dt, end_dt, status_bool)

    async def list_counters(
        self,
        start: Optional[str] = None,
        end: Optional[str] = None,
        status: Optional[str] = None
    ) -> Dict[str, any]:
        """Return chatbot events with metadata from chatbot service."""
        start_dt = datetime.fromisoformat(start) if start else None
        end_dt = datetime.fromisoformat(end) if end else None
        status_bool = self._parse_status(status)

        total = self.repo.get_total(start_dt, end_dt, status_bool)
        all_chatbots = self.repo.list_counters(start_dt, end_dt, status_bool)
        bot_ids = [bot["bot_id"] for bot in all_chatbots]

        if not bot_ids:
            return {"total": total, "items": []}

        # Fetch metadata from chatbot service
        bot_metadata = await get_chatbots_info(bot_ids)

        items = []
        for idx, bot in enumerate(all_chatbots):
            bot_config = bot_metadata[idx] if idx < len(bot_metadata) else None

            items.append({
                "bot_id": bot.get("bot_id"),
                "name": getattr(bot_config, "name", None),
                "author": getattr(bot_config, "created_by", None),
                "status": bot.get("status"),
                "timestamp": bot.get("timestamp"),
                "count": bot.get("count"),
            })

        return {"total": total, "items": items}

    async def create_counter(self, chatbot_counter: schema.ChatbotCounterCreate):
        """Create new chatbot counter record."""
        return self.repo.create(chatbot_counter)

    def _parse_status(self, status: Optional[str]) -> Optional[bool]:
        """Convert query param '1'/'0'/'true'/'false' to boolean."""
        if status is None:
            return None
        return str(status).lower() in ("1", "true", "yes")
