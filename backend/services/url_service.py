from sqlalchemy.orm import Session
from models.simulation import MaliciousURL
from datetime import datetime
import qrcode
import io
import base64
import random
import string

class URLService:
    def __init__(self, db: Session):
        self.db = db

    def generate_malicious_url(self, user_id: str, url_type: str, target_url: str = None):
        if not target_url:
            target_url = self._get_default_target(url_type)
        
        # Generate shortened URL
        short_code = ''.join(random.choices(string.ascii_letters + string.digits, k=8))
        shortened_url = f"http://bit.ly/{short_code}"
        
        # Generate QR code
        qr_code_data = self._generate_qr_code(shortened_url)
        
        malicious_url = MaliciousURL(
            user_id=user_id,
            original_url=target_url,
            shortened_url=shortened_url,
            qr_code_path=qr_code_data,
            url_type=url_type
        )
        
        self.db.add(malicious_url)
        self.db.commit()
        self.db.refresh(malicious_url)
        return malicious_url

    def _get_default_target(self, url_type: str):
        targets = {
            "phishing": "http://fake-bank-login.com/secure",
            "malware": "http://download-virus.net/install.exe",
            "scam": "http://win-prize-now.biz/claim"
        }
        return targets.get(url_type, "http://suspicious-site.com")

    def _generate_qr_code(self, url: str):
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(url)
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="black", back_color="white")
        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        buffer.seek(0)
        
        # Convert to base64 for storage
        img_base64 = base64.b64encode(buffer.getvalue()).decode()
        return f"data:image/png;base64,{img_base64}"

    def track_click(self, url_id: str, ip_address: str, user_agent: str, user_input: dict = None):
        url_record = self.db.query(MaliciousURL).filter(MaliciousURL.id == url_id).first()
        if url_record:
            url_record.is_clicked = True
            url_record.click_count += 1
            url_record.ip_address = ip_address
            url_record.user_agent = user_agent
            url_record.user_input = user_input or {}
            url_record.clicked_at = datetime.utcnow()
            self.db.commit()
        return url_record

    def get_user_urls(self, user_id: str):
        return self.db.query(MaliciousURL).filter(MaliciousURL.user_id == user_id).all()