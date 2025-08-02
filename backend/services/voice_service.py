import os
import tempfile
import whisper
from elevenlabs import generate, set_api_key
from sqlalchemy.orm import Session
from models.voice_call import VoiceCall, VoiceCallFeedback
from datetime import datetime
import random

class VoiceService:
    def __init__(self, db: Session):
        self.db = db
        self.whisper_model = whisper.load_model("base")
        set_api_key(os.getenv("ELEVENLABS_API_KEY"))

    def generate_social_engineering_prompt(self, scenario_type: str, difficulty_level: int) -> str:
        scenarios = {
            "tech_support": {
                1: "Hi, this is Microsoft technical support. We've detected suspicious activity on your computer. Can you please turn on your computer so we can help you fix this security issue?",
                2: "Hello, I'm calling from your IT department. We need to update your system remotely. Please provide your login credentials so we can secure your account immediately.",
                3: "This is an urgent call from cybersecurity. Your company's network has been compromised. I need you to install our security software right now. What's your employee ID?"
            },
            "bank_fraud": {
                1: "This is your bank's fraud department. We've noticed unusual activity on your account. Can you confirm your account number to verify your identity?",
                2: "Hello, we're calling about suspicious transactions on your credit card. To stop these charges, I need you to verify the security code on the back of your card.",
                3: "This is an emergency call from your bank. Someone is trying to access your account right now. I need your online banking password to secure your account immediately."
            },
            "prize_scam": {
                1: "Congratulations! You've won $10,000 in our sweepstakes! To claim your prize, I just need to verify some information. What's your full name and address?",
                2: "You've been selected for a special government grant of $25,000! There's just a small processing fee. Can you provide your bank account details for the transfer?",
                3: "This is your final notice about winning the lottery! You have 24 hours to claim $100,000. I need your social security number to process the payment immediately."
            }
        }
        return scenarios.get(scenario_type, {}).get(difficulty_level, scenarios["tech_support"][1])

    async def create_voice_call(self, user_id: str, scenario_type: str, difficulty_level: int = 1):
        prompt_text = self.generate_social_engineering_prompt(scenario_type, difficulty_level)
        
        # Generate audio using ElevenLabs
        audio = generate(
            text=prompt_text,
            voice="Rachel",  # Professional female voice
            model="eleven_monolingual_v1"
        )
        
        # Save audio to temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as temp_file:
            temp_file.write(audio)
            audio_url = temp_file.name

        call = VoiceCall(
            user_id=user_id,
            scenario_type=scenario_type,
            difficulty_level=difficulty_level,
            audio_prompt_url=audio_url,
            transcript=prompt_text
        )
        
        self.db.add(call)
        self.db.commit()
        self.db.refresh(call)
        return call

    async def transcribe_user_response(self, call_id: str, audio_file_path: str):
        call = self.db.query(VoiceCall).filter(VoiceCall.id == call_id).first()
        if not call:
            return None

        # Transcribe using Whisper
        result = self.whisper_model.transcribe(audio_file_path)
        transcript = result["text"]
        
        call.user_response_audio_url = audio_file_path
        call.user_response_transcript = transcript
        call.is_completed = True
        call.completed_at = datetime.utcnow()
        
        # Score the response
        vulnerability_score = self.analyze_response_vulnerability(transcript, call.scenario_type)
        call.vulnerability_score = vulnerability_score
        call.ai_score = self.calculate_ai_score(transcript, call.scenario_type, call.difficulty_level)
        
        self.db.commit()
        
        # Generate feedback
        await self.generate_feedback(call)
        
        return call

    def analyze_response_vulnerability(self, transcript: str, scenario_type: str) -> float:
        """Analyze user response for social engineering vulnerabilities"""
        vulnerability_indicators = {
            "tech_support": ["password", "login", "username", "install", "remote access", "teamviewer"],
            "bank_fraud": ["account number", "ssn", "social security", "pin", "security code", "routing"],
            "prize_scam": ["social security", "bank account", "credit card", "personal information"]
        }
        
        indicators = vulnerability_indicators.get(scenario_type, [])
        transcript_lower = transcript.lower()
        
        vulnerability_count = sum(1 for indicator in indicators if indicator in transcript_lower)
        max_vulnerabilities = len(indicators)
        
        return min(1.0, vulnerability_count / max_vulnerabilities) if max_vulnerabilities > 0 else 0.0

    def calculate_ai_score(self, transcript: str, scenario_type: str, difficulty_level: int) -> float:
        """Calculate AI-based security awareness score"""
        base_score = 100.0
        
        # Deduct points for vulnerability indicators
        vulnerability_score = self.analyze_response_vulnerability(transcript, scenario_type)
        vulnerability_penalty = vulnerability_score * 50  # Up to 50 points penalty
        
        # Deduct points for compliance indicators
        compliance_words = ["yes", "sure", "okay", "will do", "right away"]
        compliance_count = sum(1 for word in compliance_words if word in transcript.lower())
        compliance_penalty = min(30, compliance_count * 10)  # Up to 30 points penalty
        
        # Add points for skeptical responses
        skeptical_words = ["suspicious", "verify", "call back", "not sure", "seems fake"]
        skeptical_count = sum(1 for word in skeptical_words if word in transcript.lower())
        skeptical_bonus = min(20, skeptical_count * 10)  # Up to 20 points bonus
        
        final_score = base_score - vulnerability_penalty - compliance_penalty + skeptical_bonus
        return max(0.0, min(100.0, final_score))

    async def generate_feedback(self, call: VoiceCall):
        """Generate personalized feedback based on user response"""
        feedback_messages = []
        
        if call.vulnerability_score > 0.7:
            feedback_messages.append(VoiceCallFeedback(
                call_id=call.id,
                feedback_type="vulnerability",
                message="⚠️ High vulnerability detected! You shared sensitive information that could be used against you.",
                score_impact=-20
            ))
        elif call.vulnerability_score > 0.3:
            feedback_messages.append(VoiceCallFeedback(
                call_id=call.id,
                feedback_type="vulnerability",
                message="⚠️ Moderate risk: You provided some information that could be concerning.",
                score_impact=-10
            ))
        
        if call.ai_score > 80:
            feedback_messages.append(VoiceCallFeedback(
                call_id=call.id,
                feedback_type="strength",
                message="🛡️ Excellent security awareness! You handled this social engineering attempt very well.",
                score_impact=10
            ))
        elif call.ai_score > 60:
            feedback_messages.append(VoiceCallFeedback(
                call_id=call.id,
                feedback_type="improvement",
                message="👍 Good response, but there's room for improvement in recognizing social engineering tactics.",
                score_impact=5
            ))
        else:
            feedback_messages.append(VoiceCallFeedback(
                call_id=call.id,
                feedback_type="improvement",
                message="📚 Consider additional training on social engineering awareness and verification procedures.",
                score_impact=0
            ))
        
        for feedback in feedback_messages:
            self.db.add(feedback)
        
        self.db.commit()
        return feedback_messages

    def get_user_calls(self, user_id: str):
        return self.db.query(VoiceCall).filter(VoiceCall.user_id == user_id).order_by(VoiceCall.created_at.desc()).all()

    def get_call_feedback(self, call_id: str):
        return self.db.query(VoiceCallFeedback).filter(VoiceCallFeedback.call_id == call_id).all()