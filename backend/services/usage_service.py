from models.subscription import Usage
from services.stripe_service import StripeService
from datetime import datetime

class UsageService:
    @staticmethod
    def record_api_call(user_id: int):
        usage = Usage(user_id=user_id, metric="api_calls", quantity=1)
        # Save to database and report to Stripe
        StripeService.record_usage("si_subscription_item_id", 1)
    
    @staticmethod
    def record_storage_usage(user_id: int, gb_used: float):
        usage = Usage(user_id=user_id, metric="storage_gb", quantity=gb_used)
        # Save to database
    
    @staticmethod
    def get_usage_summary(user_id: int, start_date: datetime, end_date: datetime):
        # Query usage from database
        return {
            "api_calls": 1250,
            "storage_gb": 5.2,
            "users": 8
        }