from sqlalchemy.orm import Session
from models.simulation import PasswordCheck
import httpx
import hashlib
import re

class PasswordService:
    def __init__(self, db: Session):
        self.db = db

    async def check_password_hibp(self, user_id: str, password: str):
        # Hash password with SHA-1 for HIBP API
        sha1_hash = hashlib.sha1(password.encode()).hexdigest().upper()
        hash_prefix = sha1_hash[:5]
        hash_suffix = sha1_hash[5:]
        
        # Check with HaveIBeenPwned API
        is_pwned = False
        breach_count = 0
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"https://api.pwnedpasswords.com/range/{hash_prefix}",
                    headers={"User-Agent": "CyberSentinel-AI"}
                )
                
                if response.status_code == 200:
                    for line in response.text.split('\n'):
                        if line.startswith(hash_suffix):
                            is_pwned = True
                            breach_count = int(line.split(':')[1])
                            break
        except:
            # If API fails, continue with local analysis
            pass
        
        # Analyze password strength
        strength_score = self._calculate_strength(password)
        feedback = self._generate_feedback(password, is_pwned, breach_count)
        
        # Store check result
        password_check = PasswordCheck(
            user_id=user_id,
            password_hash=sha1_hash,
            is_pwned=is_pwned,
            breach_count=breach_count,
            strength_score=strength_score,
            feedback=feedback
        )
        
        self.db.add(password_check)
        self.db.commit()
        self.db.refresh(password_check)
        return password_check

    def _calculate_strength(self, password: str):
        score = 0
        
        # Length scoring
        if len(password) >= 8:
            score += 20
        if len(password) >= 12:
            score += 10
        if len(password) >= 16:
            score += 10
        
        # Character variety
        if re.search(r'[a-z]', password):
            score += 10
        if re.search(r'[A-Z]', password):
            score += 10
        if re.search(r'\d', password):
            score += 10
        if re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            score += 15
        
        # Patterns (negative scoring)
        if re.search(r'(.)\1{2,}', password):  # Repeated characters
            score -= 10
        if re.search(r'(012|123|234|345|456|567|678|789|890)', password):
            score -= 10
        if re.search(r'(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)', password.lower()):
            score -= 10
        
        return max(0, min(100, score))

    def _generate_feedback(self, password: str, is_pwned: bool, breach_count: int):
        feedback = {
            "suggestions": [],
            "warnings": [],
            "score_breakdown": {}
        }
        
        if is_pwned:
            feedback["warnings"].append(f"This password has been found in {breach_count} data breaches!")
        
        if len(password) < 8:
            feedback["suggestions"].append("Use at least 8 characters")
        
        if not re.search(r'[A-Z]', password):
            feedback["suggestions"].append("Add uppercase letters")
        
        if not re.search(r'[a-z]', password):
            feedback["suggestions"].append("Add lowercase letters")
        
        if not re.search(r'\d', password):
            feedback["suggestions"].append("Add numbers")
        
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            feedback["suggestions"].append("Add special characters")
        
        if re.search(r'(.)\1{2,}', password):
            feedback["warnings"].append("Avoid repeated characters")
        
        return feedback