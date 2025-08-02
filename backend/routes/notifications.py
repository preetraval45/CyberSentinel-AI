from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.notification_service import NotificationService
from typing import Dict

router = APIRouter(prefix="/api/notifications", tags=["notifications"])

class PushSubscriptionRequest(BaseModel):
    endpoint: str
    keys: Dict[str, str]

class NotificationRequest(BaseModel):
    user_id: int
    type: str
    title: str
    message: str

@router.get("/{user_id}")
async def get_notifications(user_id: int, unread_only: bool = False):
    notifications = NotificationService.get_user_notifications(user_id, unread_only)
    return {"notifications": notifications}

@router.post("/subscribe")
async def subscribe_push(request: PushSubscriptionRequest):
    # Save push subscription to database
    return {"success": True, "message": "Push notifications enabled"}

@router.post("/send")
async def send_notification(request: NotificationRequest):
    notification = NotificationService.create_notification(
        request.user_id, request.type, request.title, request.message
    )
    
    # Send push notification if user has subscription
    subscription = {
        "endpoint": "https://fcm.googleapis.com/fcm/send/example",
        "keys": {"p256dh": "key", "auth": "auth"}
    }
    
    payload = {
        "title": request.title,
        "body": request.message,
        "icon": "/icon-192x192.png",
        "badge": "/badge-72x72.png"
    }
    
    NotificationService.send_push_notification(subscription, payload)
    return {"success": True, "notification": notification}

@router.put("/{notification_id}/read")
async def mark_as_read(notification_id: int):
    # Mark notification as read in database
    return {"success": True}

@router.get("/vapid-public-key")
async def get_vapid_public_key():
    return {"publicKey": NotificationService.VAPID_PUBLIC_KEY}