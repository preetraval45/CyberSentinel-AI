from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from services.stripe_service import StripeService
import stripe

router = APIRouter(prefix="/api/billing", tags=["billing"])

class SubscriptionRequest(BaseModel):
    plan: str
    customer_email: str
    customer_name: str

@router.post("/subscribe")
async def create_subscription(request: SubscriptionRequest):
    try:
        customer_id = StripeService.create_customer(request.customer_email, request.customer_name)
        result = StripeService.create_subscription(customer_id, request.plan)
        return {"success": True, **result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/portal")
async def create_portal_session(customer_id: str, return_url: str):
    try:
        portal_url = StripeService.create_billing_portal_session(customer_id, return_url)
        return {"portal_url": portal_url}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    
    try:
        event = stripe.Webhook.construct_event(payload, sig_header, "whsec_your_webhook_secret")
        
        if event["type"] == "invoice.payment_succeeded":
            # Handle successful payment
            pass
        elif event["type"] == "customer.subscription.deleted":
            # Handle subscription cancellation
            pass
            
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/plans")
async def get_plans():
    return {
        "basic": {"name": "Basic", "price": 29, "features": ["5 Users", "Basic Support"]},
        "pro": {"name": "Pro", "price": 99, "features": ["25 Users", "Priority Support", "Advanced Analytics"]},
        "enterprise": {"name": "Enterprise", "price": 299, "features": ["Unlimited Users", "24/7 Support", "Custom Integration"]}
    }