from pydantic import BaseModel
from typing import List, Dict


class BookingAnalytics(BaseModel):
    total_bookings: int
    unique_users: int
    booking_success_rate: float
    drop_off_rate: float
    peak_hours: Dict[int, int]
    common_locations: List[Dict[str, any]]
    vehicle_preferences: Dict[str, int]
    average_distance: float


class PlatformAnalytics(BaseModel):
    total_organizations: int
    total_users: int
    total_bookings: int
    new_clients: int
    platform_success_rate: float
    global_drop_off_rate: float
    top_performers: List[Dict[str, any]]
    underperformers: List[Dict[str, any]]
    churn_rate: float
    top_regions: List[Dict[str, any]]
    peak_usage_times: Dict[str, int]
    global_vehicle_preferences: Dict[str, int]
