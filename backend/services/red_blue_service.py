from sqlalchemy.orm import Session
from models.red_blue_team import Competition, TeamMember, RoundAction
from datetime import datetime, timedelta
import random

class RedBlueService:
    def __init__(self, db: Session):
        self.db = db

    def create_competition(self, name: str, rounds: int = 3, duration: int = 300):
        competition = Competition(
            name=name,
            total_rounds=rounds,
            round_duration=duration
        )
        self.db.add(competition)
        self.db.commit()
        self.db.refresh(competition)
        return competition

    def join_team(self, competition_id: str, user_id: str, team: str):
        # Check if user already joined
        existing = self.db.query(TeamMember).filter(
            TeamMember.competition_id == competition_id,
            TeamMember.user_id == user_id
        ).first()
        
        if existing:
            return existing

        role = 'attacker' if team == 'red' else 'defender'
        member = TeamMember(
            competition_id=competition_id,
            user_id=user_id,
            team=team,
            role=role
        )
        self.db.add(member)
        self.db.commit()
        self.db.refresh(member)
        return member

    def start_competition(self, competition_id: str):
        competition = self.db.query(Competition).filter(Competition.id == competition_id).first()
        if not competition:
            return None

        competition.status = 'active'
        competition.round_end_time = datetime.utcnow() + timedelta(seconds=competition.round_duration)
        self.db.commit()
        return competition

    def submit_action(self, competition_id: str, user_id: str, action_type: str, target: str, description: str):
        competition = self.db.query(Competition).filter(Competition.id == competition_id).first()
        member = self.db.query(TeamMember).filter(
            TeamMember.competition_id == competition_id,
            TeamMember.user_id == user_id
        ).first()

        if not competition or not member or competition.status != 'active':
            return None

        # Calculate points based on action type and team
        points = self.calculate_points(action_type, member.team)
        is_successful = random.choice([True, False])  # Simplified success logic

        action = RoundAction(
            competition_id=competition_id,
            user_id=user_id,
            round_number=competition.current_round,
            action_type=action_type,
            target=target,
            description=description,
            points_awarded=points if is_successful else 0,
            is_successful=is_successful
        )

        self.db.add(action)
        
        # Update scores
        if is_successful:
            member.score += points
            if member.team == 'red':
                competition.red_team_score += points
            else:
                competition.blue_team_score += points

        self.db.commit()
        return action

    def calculate_points(self, action_type: str, team: str):
        points_map = {
            'red': {
                'phishing_attack': 15,
                'malware_deployment': 20,
                'privilege_escalation': 25,
                'data_exfiltration': 30,
                'lateral_movement': 20
            },
            'blue': {
                'threat_detection': 15,
                'incident_response': 20,
                'malware_analysis': 25,
                'network_monitoring': 15,
                'forensic_analysis': 30
            }
        }
        return points_map.get(team, {}).get(action_type, 10)

    def advance_round(self, competition_id: str):
        competition = self.db.query(Competition).filter(Competition.id == competition_id).first()
        if not competition:
            return None

        if competition.current_round >= competition.total_rounds:
            competition.status = 'completed'
            competition.completed_at = datetime.utcnow()
        else:
            competition.current_round += 1
            competition.round_end_time = datetime.utcnow() + timedelta(seconds=competition.round_duration)

        self.db.commit()
        return competition

    def get_competition_state(self, competition_id: str):
        competition = self.db.query(Competition).filter(Competition.id == competition_id).first()
        if not competition:
            return None

        members = self.db.query(TeamMember).filter(TeamMember.competition_id == competition_id).all()
        actions = self.db.query(RoundAction).filter(
            RoundAction.competition_id == competition_id,
            RoundAction.round_number == competition.current_round
        ).order_by(RoundAction.timestamp.desc()).all()

        red_team = [m for m in members if m.team == 'red']
        blue_team = [m for m in members if m.team == 'blue']

        return {
            'competition': competition,
            'red_team': red_team,
            'blue_team': blue_team,
            'current_actions': actions,
            'time_remaining': max(0, (competition.round_end_time - datetime.utcnow()).total_seconds()) if competition.round_end_time else 0
        }

    def get_available_actions(self, team: str):
        actions = {
            'red': [
                {'id': 'phishing_attack', 'name': 'Phishing Attack', 'points': 15},
                {'id': 'malware_deployment', 'name': 'Malware Deployment', 'points': 20},
                {'id': 'privilege_escalation', 'name': 'Privilege Escalation', 'points': 25},
                {'id': 'data_exfiltration', 'name': 'Data Exfiltration', 'points': 30},
                {'id': 'lateral_movement', 'name': 'Lateral Movement', 'points': 20}
            ],
            'blue': [
                {'id': 'threat_detection', 'name': 'Threat Detection', 'points': 15},
                {'id': 'incident_response', 'name': 'Incident Response', 'points': 20},
                {'id': 'malware_analysis', 'name': 'Malware Analysis', 'points': 25},
                {'id': 'network_monitoring', 'name': 'Network Monitoring', 'points': 15},
                {'id': 'forensic_analysis', 'name': 'Forensic Analysis', 'points': 30}
            ]
        }
        return actions.get(team, [])