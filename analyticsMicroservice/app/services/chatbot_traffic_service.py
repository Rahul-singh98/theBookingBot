from typing import Optional
from datetime import datetime
from sqlalchemy.orm import Session
from app.repositories.chatbot_traffic_repository import ChatbotTrafficRepository
from app.integrations.chatbot_api_client import get_chatbots_info


class ChatbotTrafficService:
    def __init__(self, db: Session):
        self.repo = ChatbotTrafficRepository(db)

    async def get_total(self, start: Optional[datetime], end: Optional[datetime], bot_name: Optional[str], bot_author: Optional[str]):
        return self.repo.get_total(start, end, bot_name, bot_author)

    async def get_grouped(self, start: Optional[datetime], end: Optional[datetime], bot_name: Optional[str], bot_author: Optional[str]):
        grouped_data = self.repo.get_grouped_by_bot(
            start, end, bot_name, bot_author)
        bot_ids = [row["bot_id"] for row in grouped_data]
        if not bot_ids:
            return []
        bot_metadata = await get_chatbots_info(bot_ids)

        results = []
        for idx, record in enumerate(grouped_data):
            bot_config = bot_metadata[idx] if idx < len(bot_metadata) else None
            results.append({
                "bot_id": record["bot_id"],
                "name": getattr(bot_config, "name", None),
                "author": getattr(bot_config, "created_by", None),
                "count": record["count"],
                "timestamp": record["timestamp"],
            })
        return results

    async def list_metrics(self, start: Optional[datetime], end: Optional[datetime], bot_name: Optional[str], bot_author: Optional[str]):
        total = self.repo.get_total(start, end, bot_name, bot_author)
        all_chatbots = self.repo.list_all(start, end, bot_name, bot_author)

        bot_ids = [c.get("bot_id") for c in all_chatbots]
        if not bot_ids:
            return {"total": total, "items": []}

        bot_metadata = await get_chatbots_info(bot_ids)
        items = []
        for idx, bot in enumerate(all_chatbots):
            bot_config = bot_metadata[idx] if idx < len(bot_metadata) else None
            items.append({
                "bot_id": bot.get("bot_id"),
                "name": getattr(bot_config, "name", None),
                "author": getattr(bot_config, "created_by", None),
                "v_id": bot.get("v_id"),
                "s_id": bot.get("s_id"),
                "location": bot.get("location"),
                "timestamp": bot.get("timestamp"),
                "count": bot.get("count"),
            })
        return {"total": total, "items": items}

    def get_by_region(self, start: Optional[datetime], end: Optional[datetime]):
        return self.repo.get_by_region(start, end)

    def create_traffic(self, traffic_data):
        return self.repo.create(traffic_data)

    def get_unique_visitors(self):
        return self.repo.get_unique_visitors()
