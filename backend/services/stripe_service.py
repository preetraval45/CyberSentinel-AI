import stripe
import os
from typing import Dict, Optional

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

PLANS = {
    "basic": {"price_id": "price_basic", "name": "Basic", "price": 29},
    "pro": {"price_id": "price_pro", "name": "Pro", "price": 99},
    "enterprise": {"price_id": "price_enterprise", "name": "Enterprise", "price": 299}
}

class StripeService:
    @staticmethod
    def create_customer(email: str, name: str) -> str:
        customer = stripe.Customer.create(email=email, name=name)
        return customer.id
    
    @staticmethod
    def create_subscription(customer_id: str, plan: str) -> Dict:
        subscription = stripe.Subscription.create(
            customer=customer_id,
            items=[{"price": PLANS[plan]["price_id"]}],
            payment_behavior="default_incomplete",
            expand=["latest_invoice.payment_intent"]
        )
        return {
            "subscription_id": subscription.id,
            "client_secret": subscription.latest_invoice.payment_intent.client_secret
        }
    
    @staticmethod
    def create_billing_portal_session(customer_id: str, return_url: str) -> str:
        session = stripe.billing_portal.Session.create(
            customer=customer_id,
            return_url=return_url
        )
        return session.url
    
    @staticmethod
    def record_usage(subscription_item_id: str, quantity: int):
        stripe.SubscriptionItem.create_usage_record(
            subscription_item_id,
            quantity=quantity,
            timestamp="now"
        )