from sqlalchemy.orm import Session
from sqlalchemy import func, distinct, desc
from datetime import datetime, timedelta
from collections import defaultdict
from typing import Optional
from app.schemas.analytics import BookingAnalytics, PlatformAnalytics
from app.models import (
    ChatbotConfiguration, ChatSession,
    ChatHistory, Question, QuestionOption
)


class AnalyticsService:
    def __init__(self, db: Session):
        self.db = db

    async def get_organization_analytics(
        self,
        org_id: str,
        time_range: Optional[int] = 30
    ) -> BookingAnalytics:
        start_date = datetime.now() - timedelta(days=time_range)

        # Get chat sessions for the organization
        sessions = self.db.query(ChatSession)\
            .join(ChatbotConfiguration)\
            .filter(ChatbotConfiguration.created_by == org_id)\
            .filter(ChatSession.created_at >= start_date)\
            .all()

        # Calculate total bookings
        total_sessions = len(sessions)
        completed_sessions = sum(
            1 for session in sessions if len(session.history) > 0)

        # Calculate unique users
        unique_users = self.db.query(func.count(distinct(ChatHistory.session_id)))\
            .join(ChatSession)\
            .join(ChatbotConfiguration)\
            .filter(ChatbotConfiguration.created_by == org_id)\
            .scalar()

        # Success and drop-off rates
        success_rate = (completed_sessions / total_sessions *
                        100) if total_sessions > 0 else 0
        drop_off_rate = ((total_sessions - completed_sessions) /
                         total_sessions * 100) if total_sessions > 0 else 0

        # Peak hours analysis
        hour_distribution = defaultdict(int)
        for session in sessions:
            hour = session.created_at.hour
            hour_distribution[hour] += 1

        # Location and vehicle preferences
        location_preferences = defaultdict(int)
        vehicle_preferences = defaultdict(int)
        total_distance = 0
        total_rides = 0

        for session in sessions:
            for history in session.history:
                if history.response:
                    response_data = history.response
                    if 'pickup_location' in response_data:
                        location_preferences[response_data['pickup_location']] += 1
                    if 'vehicle_type' in response_data:
                        vehicle_preferences[response_data['vehicle_type']] += 1
                    if 'distance' in response_data:
                        total_distance += float(response_data['distance'])
                        total_rides += 1

        return BookingAnalytics(
            total_bookings=completed_sessions,
            unique_users=unique_users,
            booking_success_rate=success_rate,
            drop_off_rate=drop_off_rate,
            peak_hours=dict(sorted(hour_distribution.items())),
            common_locations=[
                {"location": k, "count": v}
                for k, v in sorted(
                    location_preferences.items(),
                    key=lambda x: x[1],
                    reverse=True
                )[:5]
            ],
            vehicle_preferences=dict(vehicle_preferences),
            average_distance=total_distance/total_rides if total_rides > 0 else 0
        )

    async def get_platform_analytics(self) -> PlatformAnalytics:
        # Total organizations
        total_orgs = self.db.query(
            func.count(distinct(ChatbotConfiguration.created_by))
        ).scalar()

        # Total users
        total_users = self.db.query(
            func.count(distinct(ChatSession.id))
        ).scalar()

        # Total bookings
        total_bookings = self.db.query(ChatHistory).count()

        # New clients in last 30 days
        thirty_days_ago = datetime.now() - timedelta(days=30)
        new_clients = self.db.query(
            func.count(distinct(ChatbotConfiguration.created_by))
        ).filter(
            ChatbotConfiguration.created_at >= thirty_days_ago
        ).scalar()

        # Platform-wide success and drop-off rates
        all_sessions = self.db.query(ChatSession).count()
        completed_sessions = self.db.query(ChatSession)\
            .join(ChatHistory)\
            .distinct(ChatSession.id)\
            .count()

        platform_success_rate = (
            completed_sessions / all_sessions * 100) if all_sessions > 0 else 0
        global_drop_off_rate = (
            (all_sessions - completed_sessions) / all_sessions * 100) if all_sessions > 0 else 0

        # Top performing organizations
        org_performance = self.db.query(
            ChatbotConfiguration.created_by,
            func.count(ChatSession.id).label('session_count'),
            func.count(ChatHistory.id).label('completion_count')
        )\
            .join(ChatSession)\
            .outerjoin(ChatHistory)\
            .group_by(ChatbotConfiguration.created_by)\
            .order_by(desc('completion_count'))\
            .limit(5)\
            .all()

        # Churn rate
        active_orgs = self.db.query(
            func.count(distinct(ChatbotConfiguration.created_by))
        )\
            .join(ChatSession)\
            .filter(ChatSession.created_at >= thirty_days_ago)\
            .scalar()

        churn_rate = ((total_orgs - active_orgs) /
                      total_orgs * 100) if total_orgs > 0 else 0

        return PlatformAnalytics(
            total_organizations=total_orgs,
            total_users=total_users,
            total_bookings=total_bookings,
            new_clients=new_clients,
            platform_success_rate=platform_success_rate,
            global_drop_off_rate=global_drop_off_rate,
            top_performers=[{
                "org_id": org,
                "total_sessions": sessions,
                "completed_sessions": completions,
                "success_rate": (completions/sessions * 100) if sessions > 0 else 0
            } for org, sessions, completions in org_performance],
            underperformers=[],
            churn_rate=churn_rate,
            top_regions=[],
            peak_usage_times={},
            global_vehicle_preferences={}
        )
