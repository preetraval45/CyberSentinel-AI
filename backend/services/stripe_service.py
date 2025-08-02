import stripe
import os
from typing import Dict, Any

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

class StripeService:
    def __init__(self):
        self.webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")
        
    def create_customer(self, email: str, name: str) -> Dict[str, Any]:
        return stripe.Customer.create(
            email=email,
            name=name,
            metadata={"source": "cybersentinel"}
        )
    
    def create_subscription(self, customer_id: str, price_id: str) -> Dict[str, Any]:
        return stripe.Subscription.create(
            customer=customer_id,
            items=[{"price": price_id}],
            payment_behavior="default_incomplete",
            payment_settings={"save_default_payment_method": "on_subscription"},
            expand=["latest_invoice.payment_intent"]
        )
    
    def create_checkout_session(self, customer_id: str, price_id: str, success_url: str, cancel_url: str) -> Dict[str, Any]:
        return stripe.checkout.Session.create(
            customer=customer_id,
            payment_method_types=["card"],
            line_items=[{"price": price_id, "quantity": 1}],
            mode="subscription",
            success_url=success_url,
            cancel_url=cancel_url
        )
    
    def cancel_subscription(self, subscription_id: str) -> Dict[str, Any]:
        return stripe.Subscription.delete(subscription_id)
    
    def construct_webhook_event(self, payload: bytes, sig_header: str):
        return stripe.Webhook.construct_event(payload, sig_header, self.webhook_secret)

stripe_service = StripeService()