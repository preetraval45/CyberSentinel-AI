from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from models.user import User
from models.training import UserProgress, DecisionOutcome, ComplianceQuiz
from models.phishing import PhishingEmail, ChatSession
from models.simulation import MaliciousURL, PasswordCheck
from datetime import datetime, timedelta
import json

class AnalyticsService:
    def __init__(self, db: Session):
        self.db = db

    def get_user_performance_stats(self):
        total_users = self.db.query(User).count()
        active_users = self.db.query(User).filter(User.is_active == True).count()
        
        # Training completion rates
        completed_scenarios = self.db.query(UserProgress).filter(UserProgress.status == 'completed').count()
        total_scenarios = self.db.query(UserProgress).count()
        completion_rate = (completed_scenarios / total_scenarios * 100) if total_scenarios > 0 else 0
        
        # Average scores
        avg_score = self.db.query(func.avg(UserProgress.score)).scalar() or 0
        
        return {
            'total_users': total_users,
            'active_users': active_users,
            'completion_rate': round(completion_rate, 2),
            'average_score': round(avg_score, 2)
        }

    def get_attack_success_rates(self):
        # Phishing success rate
        total_phishing = self.db.query(PhishingEmail).count()
        clicked_phishing = self.db.query(PhishingEmail).filter(PhishingEmail.is_clicked == True).count()
        phishing_success = (clicked_phishing / total_phishing * 100) if total_phishing > 0 else 0
        
        # URL click rates
        total_urls = self.db.query(MaliciousURL).count()
        clicked_urls = self.db.query(MaliciousURL).filter(MaliciousURL.is_clicked == True).count()
        url_success = (clicked_urls / total_urls * 100) if total_urls > 0 else 0
        
        # Password compromise rates
        total_passwords = self.db.query(PasswordCheck).count()
        pwned_passwords = self.db.query(PasswordCheck).filter(PasswordCheck.is_pwned == True).count()
        password_compromise = (pwned_passwords / total_passwords * 100) if total_passwords > 0 else 0
        
        return {
            'phishing_success_rate': round(phishing_success, 2),
            'malicious_url_success_rate': round(url_success, 2),
            'password_compromise_rate': round(password_compromise, 2)
        }

    def get_risk_scoring(self):
        # Calculate risk scores based on user behavior
        high_risk_users = self.db.query(User).join(PhishingEmail).filter(
            PhishingEmail.is_clicked == True
        ).distinct().count()
        
        medium_risk_users = self.db.query(User).join(UserProgress).filter(
            UserProgress.score < 50
        ).distinct().count()
        
        total_users = self.db.query(User).filter(User.is_active == True).count()
        low_risk_users = total_users - high_risk_users - medium_risk_users
        
        return {
            'high_risk': high_risk_users,
            'medium_risk': medium_risk_users,
            'low_risk': max(0, low_risk_users),
            'total_assessed': total_users
        }

    def get_compliance_stats(self):
        # GDPR compliance
        gdpr_passed = self.db.query(ComplianceQuiz).filter(
            ComplianceQuiz.quiz_type == 'gdpr',
            ComplianceQuiz.passed == True
        ).count()
        gdpr_total = self.db.query(ComplianceQuiz).filter(ComplianceQuiz.quiz_type == 'gdpr').count()
        
        # HIPAA compliance
        hipaa_passed = self.db.query(ComplianceQuiz).filter(
            ComplianceQuiz.quiz_type == 'hipaa',
            ComplianceQuiz.passed == True
        ).count()
        hipaa_total = self.db.query(ComplianceQuiz).filter(ComplianceQuiz.quiz_type == 'hipaa').count()
        
        return {
            'gdpr': {
                'passed': gdpr_passed,
                'total': gdpr_total,
                'rate': round((gdpr_passed / gdpr_total * 100) if gdpr_total > 0 else 0, 2)
            },
            'hipaa': {
                'passed': hipaa_passed,
                'total': hipaa_total,
                'rate': round((hipaa_passed / hipaa_total * 100) if hipaa_total > 0 else 0, 2)
            }
        }

    def get_recent_activities(self, limit=10):
        activities = []
        
        # Recent phishing clicks
        recent_phishing = self.db.query(PhishingEmail).filter(
            PhishingEmail.is_clicked == True
        ).order_by(desc(PhishingEmail.clicked_at)).limit(limit).all()
        
        for email in recent_phishing:
            activities.append({
                'type': 'phishing_click',
                'user_id': str(email.user_id),
                'description': f'User clicked phishing email: {email.subject}',
                'timestamp': email.clicked_at,
                'severity': 'high'
            })
        
        # Recent training completions
        recent_training = self.db.query(UserProgress).filter(
            UserProgress.status == 'completed'
        ).order_by(desc(UserProgress.completed_at)).limit(limit).all()
        
        for progress in recent_training:
            activities.append({
                'type': 'training_completed',
                'user_id': str(progress.user_id),
                'description': f'Training scenario completed with score: {progress.score}',
                'timestamp': progress.completed_at,
                'severity': 'low'
            })
        
        # Sort by timestamp and return latest
        activities.sort(key=lambda x: x['timestamp'] or datetime.min, reverse=True)
        return activities[:limit]

    def generate_compliance_report(self, report_type='all'):
        report_data = {
            'generated_at': datetime.utcnow(),
            'report_type': report_type,
            'summary': self.get_compliance_stats(),
            'user_performance': self.get_user_performance_stats(),
            'risk_assessment': self.get_risk_scoring(),
            'attack_simulation_results': self.get_attack_success_rates()
        }
        
        # Add detailed user data
        users_data = []
        users = self.db.query(User).filter(User.is_active == True).all()
        
        for user in users:
            user_stats = {
                'user_id': str(user.id),
                'email': user.email,
                'role': user.role,
                'training_completed': self.db.query(UserProgress).filter(
                    UserProgress.user_id == user.id,
                    UserProgress.status == 'completed'
                ).count(),
                'phishing_clicked': self.db.query(PhishingEmail).filter(
                    PhishingEmail.user_id == user.id,
                    PhishingEmail.is_clicked == True
                ).count(),
                'compliance_certifications': self.db.query(ComplianceQuiz).filter(
                    ComplianceQuiz.user_id == user.id,
                    ComplianceQuiz.passed == True
                ).count()
            }
            users_data.append(user_stats)
        
        report_data['detailed_users'] = users_data
        return report_data