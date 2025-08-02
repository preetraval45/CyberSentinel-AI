from sqlalchemy.orm import Session
from models.behavior_profile import SecurityBehaviorProfile, BehaviorEvent
from models.phishing import PhishingEmail
from datetime import datetime, timedelta
import numpy as np
from typing import Dict, List, Any

class BehaviorAnalysisService:
    def __init__(self, db: Session):
        self.db = db

    def get_or_create_profile(self, user_id: str) -> SecurityBehaviorProfile:
        profile = self.db.query(SecurityBehaviorProfile).filter(
            SecurityBehaviorProfile.user_id == user_id
        ).first()
        
        if not profile:
            profile = SecurityBehaviorProfile(user_id=user_id)
            self.db.add(profile)
            self.db.commit()
            self.db.refresh(profile)
        
        return profile

    def record_behavior_event(self, user_id: str, event_type: str, simulation_type: str, 
                            triggers: List[str], response_time: float, context: Dict[str, Any]):
        event = BehaviorEvent(
            user_id=user_id,
            event_type=event_type,
            simulation_type=simulation_type,
            triggers_present=triggers,
            response_time=response_time,
            context_data=context,
            success_score=self.calculate_success_score(event_type, triggers)
        )
        
        self.db.add(event)
        self.db.commit()
        
        # Update behavior profile
        self.update_behavior_profile(user_id)
        
        return event

    def calculate_success_score(self, event_type: str, triggers: List[str]) -> float:
        base_scores = {
            'click': 0.0,      # Clicked malicious link
            'report': 1.0,     # Reported as phishing
            'ignore': 0.7,     # Ignored suspicious email
            'hesitate': 0.5    # Showed hesitation before action
        }
        
        base = base_scores.get(event_type, 0.5)
        trigger_penalty = len(triggers) * 0.05  # More triggers = harder to resist
        
        return max(0.0, min(1.0, base - trigger_penalty))

    def update_behavior_profile(self, user_id: str):
        profile = self.get_or_create_profile(user_id)
        
        # Get recent events (last 30 days)
        recent_events = self.db.query(BehaviorEvent).filter(
            BehaviorEvent.user_id == user_id,
            BehaviorEvent.timestamp >= datetime.utcnow() - timedelta(days=30)
        ).all()
        
        if not recent_events:
            return profile
        
        # Calculate trigger susceptibilities
        trigger_stats = self.analyze_trigger_susceptibility(recent_events)
        profile.urgency_susceptibility = trigger_stats.get('urgency', 0.5)
        profile.authority_susceptibility = trigger_stats.get('authority', 0.5)
        profile.curiosity_susceptibility = trigger_stats.get('curiosity', 0.5)
        profile.fear_susceptibility = trigger_stats.get('fear', 0.5)
        profile.trust_susceptibility = trigger_stats.get('trust', 0.5)
        
        # Calculate behavioral metrics
        click_events = [e for e in recent_events if e.event_type == 'click']
        report_events = [e for e in recent_events if e.event_type == 'report']
        
        profile.click_rate = len(click_events) / len(recent_events) if recent_events else 0.3
        profile.report_rate = len(report_events) / len(recent_events) if recent_events else 0.7
        profile.avg_response_time = np.mean([e.response_time for e in recent_events if e.response_time])
        
        # Calculate improvement rate
        profile.improvement_rate = self.calculate_improvement_rate(recent_events)
        
        self.db.commit()
        return profile

    def analyze_trigger_susceptibility(self, events: List[BehaviorEvent]) -> Dict[str, float]:
        trigger_stats = {}
        triggers = ['urgency', 'authority', 'curiosity', 'fear', 'trust']
        
        for trigger in triggers:
            trigger_events = [e for e in events if trigger in e.triggers_present]
            if trigger_events:
                # Calculate susceptibility based on click rate when trigger is present
                clicks = len([e for e in trigger_events if e.event_type == 'click'])
                trigger_stats[trigger] = clicks / len(trigger_events)
            else:
                trigger_stats[trigger] = 0.5  # Default neutral
        
        return trigger_stats

    def calculate_improvement_rate(self, events: List[BehaviorEvent]) -> float:
        if len(events) < 10:
            return 0.0
        
        # Sort by timestamp
        events.sort(key=lambda x: x.timestamp)
        
        # Compare first half vs second half success scores
        mid_point = len(events) // 2
        early_scores = [e.success_score for e in events[:mid_point]]
        recent_scores = [e.success_score for e in events[mid_point:]]
        
        early_avg = np.mean(early_scores)
        recent_avg = np.mean(recent_scores)
        
        return recent_avg - early_avg

    def generate_behavior_insights(self, user_id: str) -> Dict[str, Any]:
        profile = self.get_or_create_profile(user_id)
        
        # Identify primary vulnerabilities
        vulnerabilities = {
            'urgency': profile.urgency_susceptibility,
            'authority': profile.authority_susceptibility,
            'curiosity': profile.curiosity_susceptibility,
            'fear': profile.fear_susceptibility,
            'trust': profile.trust_susceptibility
        }
        
        primary_vulnerability = max(vulnerabilities, key=vulnerabilities.get)
        vulnerability_score = vulnerabilities[primary_vulnerability]
        
        # Determine challenge level
        if profile.improvement_rate > 0.2:
            recommended_difficulty = min(5, int(profile.click_rate * 10) + 2)
        elif profile.improvement_rate < -0.1:
            recommended_difficulty = max(1, int(profile.click_rate * 10) - 1)
        else:
            recommended_difficulty = int(profile.click_rate * 10) + 1
        
        return {
            'primary_vulnerability': primary_vulnerability,
            'vulnerability_score': vulnerability_score,
            'recommended_difficulty': recommended_difficulty,
            'improvement_trend': 'improving' if profile.improvement_rate > 0.1 else 
                               'declining' if profile.improvement_rate < -0.1 else 'stable',
            'risk_level': 'high' if profile.click_rate > 0.6 else 
                         'medium' if profile.click_rate > 0.3 else 'low',
            'response_speed': 'fast' if profile.avg_response_time < 15 else 
                            'medium' if profile.avg_response_time < 45 else 'slow'
        }

    def get_adaptive_training_plan(self, user_id: str) -> Dict[str, Any]:
        insights = self.generate_behavior_insights(user_id)
        profile = self.get_or_create_profile(user_id)
        
        # Focus areas based on vulnerabilities
        focus_triggers = []
        if profile.urgency_susceptibility > 0.6:
            focus_triggers.append('urgency')
        if profile.authority_susceptibility > 0.6:
            focus_triggers.append('authority')
        if profile.curiosity_susceptibility > 0.6:
            focus_triggers.append('curiosity')
        
        # Training recommendations
        training_plan = {
            'focus_triggers': focus_triggers,
            'recommended_frequency': 'daily' if insights['risk_level'] == 'high' else 
                                   'weekly' if insights['risk_level'] == 'medium' else 'monthly',
            'difficulty_progression': insights['recommended_difficulty'],
            'scenario_types': self.recommend_scenario_types(profile),
            'estimated_improvement_time': self.estimate_improvement_time(profile)
        }
        
        return training_plan

    def recommend_scenario_types(self, profile: SecurityBehaviorProfile) -> List[str]:
        scenarios = []
        
        if profile.urgency_susceptibility > 0.5:
            scenarios.append('urgent_requests')
        if profile.authority_susceptibility > 0.5:
            scenarios.append('executive_impersonation')
        if profile.curiosity_susceptibility > 0.5:
            scenarios.append('interesting_links')
        if profile.trust_susceptibility > 0.5:
            scenarios.append('trusted_sender_spoofing')
        
        return scenarios or ['general_phishing']

    def estimate_improvement_time(self, profile: SecurityBehaviorProfile) -> str:
        if profile.improvement_rate > 0.2:
            return '2-4 weeks'
        elif profile.improvement_rate > 0.0:
            return '1-2 months'
        else:
            return '2-3 months'