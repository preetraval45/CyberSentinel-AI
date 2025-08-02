from typing import Dict, List
import random

class SentinelBot:
    def __init__(self):
        self.responses = {
            "welcome": [
                "👋 Hi there! I'm SentinelBot, your cybersecurity training companion!",
                "🛡️ Welcome to CyberSentinel training! I'm here to help you learn.",
                "🤖 Hello! Ready to boost your cybersecurity skills? Let's go!"
            ],
            "encouragement": [
                "🎉 Great job! You're getting the hang of this!",
                "💪 Excellent work! Keep up the momentum!",
                "⭐ Nice progress! You're becoming a cyber defender!"
            ],
            "hints": {
                "phishing": "🎣 Look for suspicious sender addresses, urgent language, and unexpected attachments!",
                "malware": "🦠 Check file extensions, scan downloads, and avoid suspicious links!",
                "passwords": "🔐 Use strong, unique passwords with 2FA whenever possible!",
                "social_engineering": "🕵️ Be skeptical of unsolicited requests for sensitive information!"
            }
        }
    
    def get_welcome_message(self) -> str:
        return random.choice(self.responses["welcome"])
    
    def get_encouragement(self) -> str:
        return random.choice(self.responses["encouragement"])
    
    def get_hint(self, topic: str) -> str:
        return self.responses["hints"].get(topic, "💡 Remember to stay vigilant and think critically!")
    
    def provide_feedback(self, correct: bool, topic: str) -> Dict:
        if correct:
            return {
                "message": self.get_encouragement(),
                "tip": f"📚 Pro tip: {self.get_hint(topic)}"
            }
        else:
            return {
                "message": "🤔 Not quite right, but that's how we learn!",
                "hint": self.get_hint(topic),
                "encouragement": "💪 Try again - you've got this!"
            }