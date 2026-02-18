from typing import Optional, Dict, Any
from datetime import datetime
from sqlalchemy.orm import Session

from app.repositories.chatbot_quote_repository import ChatbotQuoteRepository
from app.schemas import chatbot_quote_schema as schema
from app.integrations.chatbot_api_client import get_chatbots_info


class ChatbotQuoteService:
    """Business logic for Chatbot Quote metrics."""

    def __init__(self, db: Session):
        self.repo = ChatbotQuoteRepository(db)

    async def get_total(
        self,
        start: Optional[str] = None,
        end: Optional[str] = None,
        bot_name: Optional[str] = None,
        bot_author: Optional[str] = None,
    ) -> int:
        start_dt = datetime.fromisoformat(start) if start else None
        end_dt = datetime.fromisoformat(end) if end else None
        return self.repo.get_total(start_dt, end_dt, bot_name, bot_author)

    async def list_quotes(
        self,
        start: Optional[str] = None,
        end: Optional[str] = None,
        bot_name: Optional[str] = None,
        bot_author: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Combine DB data with external chatbot info."""
        start_dt = datetime.fromisoformat(start) if start else None
        end_dt = datetime.fromisoformat(end) if end else None

        total = self.repo.get_total(start_dt, end_dt, bot_name, bot_author)
        all_quotes = self.repo.list_quotes(
            start_dt, end_dt, bot_name, bot_author)
        bot_ids = [q["bot_id"] for q in all_quotes]

        if not bot_ids:
            return {"total": total, "items": []}

        # External metadata fetch
        bot_metadata = await get_chatbots_info(bot_ids)
        items = []

        for idx, quote in enumerate(all_quotes):
            bot_config = bot_metadata[idx] if idx < len(bot_metadata) else None
            items.append({
                "bot_id": quote.get("bot_id"),
                "name": getattr(bot_config, "name", None),
                "author": getattr(bot_config, "created_by", None),
                "s_id": quote.get("s_id"),
                "amount": quote.get("amount"),
                "type": quote.get("type"),
                "timestamp": quote.get("timestamp"),
                "count": quote.get("count"),
            })

        return {"total": total, "items": items}

    async def create_quote(self, chatbot_quote: schema.ChatbotQuoteCreate):
        """Create new quote record."""
        return self.repo.create(chatbot_quote)
