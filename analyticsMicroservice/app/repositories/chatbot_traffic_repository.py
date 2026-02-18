from sqlalchemy.orm import Session
from sqlalchemy import and_, func
from typing import Optional, List
from datetime import datetime
from app import models
from app.schemas import chatbot_traffic_schema as schema


class ChatbotTrafficRepository:
    """Handles all chatbot traffic database operations."""

    def __init__(self, db: Session):
        self.db = db

    def get_total(
        self,
        start: Optional[datetime] = None,
        end: Optional[datetime] = None,
        bot_name: Optional[str] = None,
        bot_author: Optional[str] = None,
    ) -> int:
        q = self.db.query(models.ChatbotTraffic)

        # Time filters
        if start and end:
            q = q.filter(
                and_(
                    models.ChatbotTraffic.timestamp >= start,
                    models.ChatbotTraffic.timestamp <= end,
                )
            )
        elif start:
            q = q.filter(models.ChatbotTraffic.timestamp >= start)
        elif end:
            q = q.filter(models.ChatbotTraffic.timestamp <= end)

        return q.count()

    def list_all(
        self,
        start: Optional[datetime] = None,
        end: Optional[datetime] = None,
        bot_name: Optional[str] = None,
        bot_author: Optional[str] = None,
    ) -> List[dict]:
        q = self.db.query(models.ChatbotTraffic)

        if start and end:
            q = q.filter(
                and_(
                    models.ChatbotTraffic.timestamp >= start,
                    models.ChatbotTraffic.timestamp <= end,
                )
            )
        elif start:
            q = q.filter(models.ChatbotTraffic.timestamp >= start)
        elif end:
            q = q.filter(models.ChatbotTraffic.timestamp <= end)

        all_chatbots = q.all()
        active_count = 0
        events = []
        for bot in all_chatbots:
            active_count += 1
            events.append({
                "bot_id": bot.bot_id,
                "v_id": bot.v_id,
                "s_id": bot.s_id,
                "location": bot.location,
                "timestamp": bot.timestamp,
                "count": active_count,
            })
        return events

    def get_grouped_by_bot(
        self,
        start: Optional[datetime] = None,
        end: Optional[datetime] = None,
        bot_name: Optional[str] = None,
        bot_author: Optional[str] = None,
    ) -> List[dict]:
        q = self.db.query(
            models.ChatbotTraffic.bot_id,
            func.count(models.ChatbotTraffic.id).label("count"),
            func.max(models.ChatbotTraffic.timestamp).label("timestamp"),
        )

        if start and end:
            q = q.filter(
                and_(
                    models.ChatbotTraffic.timestamp >= start,
                    models.ChatbotTraffic.timestamp <= end,
                )
            )
        elif start:
            q = q.filter(models.ChatbotTraffic.timestamp >= start)
        elif end:
            q = q.filter(models.ChatbotTraffic.timestamp <= end)

        q = q.group_by(models.ChatbotTraffic.bot_id)
        q = q.order_by(func.max(models.ChatbotTraffic.timestamp).desc())

        return [
            {"bot_id": row.bot_id, "count": row.count, "timestamp": row.timestamp}
            for row in q.all()
        ]

    def get_by_region(
        self,
        start: Optional[datetime] = None,
        end: Optional[datetime] = None,
    ) -> List[dict]:
        country = func.json_extract(
            models.ChatbotTraffic.location, "$.country").label("country")
        country_code = func.json_extract(
            models.ChatbotTraffic.location, "$.country_code").label("country_code")
        postcode = func.json_extract(
            models.ChatbotTraffic.location, "$.postcode").label("postcode")
        city = func.json_extract(
            models.ChatbotTraffic.location, "$.city").label("city")

        q = self.db.query(
            country, country_code, postcode, city,
            func.count(models.ChatbotTraffic.id).label("count")
        )

        if start and end:
            q = q.filter(
                and_(
                    models.ChatbotTraffic.timestamp >= start,
                    models.ChatbotTraffic.timestamp <= end,
                )
            )
        elif start:
            q = q.filter(models.ChatbotTraffic.timestamp >= start)
        elif end:
            q = q.filter(models.ChatbotTraffic.timestamp <= end)

        q = q.group_by(country, country_code, postcode, city)
        q = q.order_by(func.count(models.ChatbotTraffic.id).desc())

        results = []
        for row in q.all():
            if row.country or row.country_code or row.postcode or row.city:
                results.append({
                    "country": row.country,
                    "country_code": row.country_code,
                    "postcode": row.postcode,
                    "city": row.city,
                    "count": row.count,
                })
        return results

    def create(self, traffic_data: schema.ChatbotTrafficCreate):
        traffic = models.ChatbotTraffic(
            bot_id=traffic_data.bot_id,
            v_id=traffic_data.v_id,
            s_id=traffic_data.s_id,
            location=traffic_data.location,
            timestamp=traffic_data.timestamp,
        )
        self.db.add(traffic)
        self.db.commit()
        self.db.refresh(traffic)
        return traffic

    def get_unique_visitors(self) -> int:
        q = self.db.query(func.count(
            func.distinct(models.ChatbotTraffic.v_id)))
        return q.scalar() or 0
