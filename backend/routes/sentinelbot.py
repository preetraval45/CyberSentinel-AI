from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.sentinelbot import SentinelBot

router = APIRouter(prefix="/api/sentinelbot", tags=["SentinelBot"])
bot = SentinelBot()

class FeedbackRequest(BaseModel):
    correct: bool
    topic: str

@router.get("/welcome")
async def get_welcome():
    return {"message": bot.get_welcome_message()}

@router.get("/hint/{topic}")
async def get_hint(topic: str):
    return {"hint": bot.get_hint(topic)}

@router.post("/feedback")
async def provide_feedback(request: FeedbackRequest):
    return bot.provide_feedback(request.correct, request.topic)