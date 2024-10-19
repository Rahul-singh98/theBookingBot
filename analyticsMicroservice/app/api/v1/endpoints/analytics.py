from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from app.services.analytics import AnalyticsService
from app.core.deps import get_db
from app.schemas.analytics import BookingAnalytics, PlatformAnalytics

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get(
    "/organization/{org_id}",
    response_model=BookingAnalytics,
    summary="Get organization-specific analytics"
)
async def get_organization_analytics(
    org_id: str,
    time_range: Optional[int] = 30,
    db: Session = Depends(get_db)
):
    """
    Get analytics for a specific organization.
    
    Parameters:
    - org_id: Organization identifier
    - time_range: Number of days to analyze (default: 30)
    """
    analytics_service = AnalyticsService(db)
    return await analytics_service.get_organization_analytics(org_id, time_range)

@router.get(
    "/platform",
    response_model=PlatformAnalytics,
    summary="Get platform-wide analytics"
)
async def get_platform_analytics(
    db: Session = Depends(get_db)
):
    """
    Get platform-wide analytics across all organizations.
    """
    analytics_service = AnalyticsService(db)
    return await analytics_service.get_platform_analytics()