import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from fastapi import BackgroundTasks
import os
from typing import List

class EmailService:
    def __init__(self):
        self.smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_username = os.getenv("SMTP_USERNAME")
        self.smtp_password = os.getenv("SMTP_PASSWORD")
        self.from_email = os.getenv("FROM_EMAIL", self.smtp_username)

    def send_verification_email(self, to_email: str, verification_token: str):
        subject = "Verify Your CyberSentinel Account"
        verification_url = f"{os.getenv('FRONTEND_URL')}/verify-email?token={verification_token}"
        
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; background: #0a0a0a; color: #00ffff;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1 style="color: #00ffff; text-align: center;">CyberSentinel AI</h1>
                    <div style="background: rgba(0,255,255,0.1); padding: 20px; border-radius: 10px; border: 1px solid rgba(0,255,255,0.3);">
                        <h2>Verify Your Email Address</h2>
                        <p>Click the button below to verify your email address:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="{verification_url}" style="background: linear-gradient(45deg, #00ffff, #0080ff); color: #000; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                                VERIFY EMAIL
                            </a>
                        </div>
                        <p style="color: #888;">If the button doesn't work, copy this link: {verification_url}</p>
                    </div>
                </div>
            </body>
        </html>
        """
        
        self._send_email(to_email, subject, html_content)

    def _send_email(self, to_email: str, subject: str, html_content: str):
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = self.from_email
        msg['To'] = to_email
        
        html_part = MIMEText(html_content, 'html')
        msg.attach(html_part)
        
        with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
            server.starttls()
            server.login(self.smtp_username, self.smtp_password)
            server.send_message(msg)

email_service = EmailService()