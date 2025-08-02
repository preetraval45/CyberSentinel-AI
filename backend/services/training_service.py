from sqlalchemy.orm import Session
from models.training import TrainingScenario, UserProgress, DecisionOutcome, ComplianceQuiz
from datetime import datetime
import openai
import os
import json

class TrainingService:
    def __init__(self, db: Session):
        self.db = db
        openai.api_key = os.getenv("OPENAI_API_KEY")

    def get_scenarios_by_category(self, category: str):
        return self.db.query(TrainingScenario).filter(TrainingScenario.category == category).all()

    def start_scenario(self, user_id: str, scenario_id: str):
        progress = UserProgress(
            user_id=user_id,
            scenario_id=scenario_id,
            current_step='start'
        )
        self.db.add(progress)
        self.db.commit()
        self.db.refresh(progress)
        return progress

    def make_decision(self, progress_id: str, step_id: str, decision: str):
        progress = self.db.query(UserProgress).filter(UserProgress.id == progress_id).first()
        if not progress:
            return None

        scenario = self.db.query(TrainingScenario).filter(TrainingScenario.id == progress.scenario_id).first()
        scenario_data = scenario.scenario_data

        # Process decision based on scenario logic
        current_step_data = scenario_data.get('steps', {}).get(step_id, {})
        decision_data = current_step_data.get('decisions', {}).get(decision, {})
        
        is_correct = decision_data.get('correct', False)
        points = decision_data.get('points', 0)
        outcome_text = decision_data.get('outcome', 'Decision processed')
        next_step = decision_data.get('next_step', 'end')

        # Generate AI feedback if adaptive
        ai_feedback = None
        if scenario.ai_adaptive:
            ai_feedback = self._generate_ai_feedback(scenario.category, step_id, decision, is_correct)

        # Record decision outcome
        outcome = DecisionOutcome(
            progress_id=progress_id,
            step_id=step_id,
            decision=decision,
            outcome=outcome_text,
            points_awarded=points,
            is_correct=is_correct,
            ai_feedback=ai_feedback
        )
        self.db.add(outcome)

        # Update progress
        progress.current_step = next_step
        progress.score += points
        
        # Update decisions made
        decisions = progress.decisions_made or {}
        decisions[step_id] = decision
        progress.decisions_made = decisions

        # Check completion
        if next_step == 'end':
            progress.status = 'completed'
            progress.completed_at = datetime.utcnow()
            total_steps = len(scenario_data.get('steps', {}))
            progress.completion_rate = 100.0

        self.db.commit()
        return {
            'outcome': outcome_text,
            'points': points,
            'is_correct': is_correct,
            'ai_feedback': ai_feedback,
            'next_step': next_step,
            'total_score': progress.score
        }

    def _generate_ai_feedback(self, category: str, step_id: str, decision: str, is_correct: bool):
        prompts = {
            'physical': f"Provide security feedback for a physical security decision: {decision}. Was it correct: {is_correct}",
            'insider': f"Analyze this insider threat response: {decision}. Correctness: {is_correct}",
            'malware': f"Evaluate this malware handling decision: {decision}. Was it right: {is_correct}",
            'ransomware': f"Review this ransomware response: {decision}. Correct approach: {is_correct}",
            'wifi': f"Assess this WiFi security decision: {decision}. Was it secure: {is_correct}"
        }

        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a cybersecurity instructor providing brief, educational feedback."},
                    {"role": "user", "content": prompts.get(category, f"Provide feedback on: {decision}")}
                ],
                max_tokens=100
            )
            return response.choices[0].message.content
        except:
            return "Good decision-making process. Continue learning!"

    def create_compliance_quiz(self, user_id: str, quiz_type: str, answers: dict):
        questions = self._get_quiz_questions(quiz_type)
        score = self._calculate_quiz_score(questions, answers)
        passed = score >= 80  # 80% passing grade

        quiz = ComplianceQuiz(
            user_id=user_id,
            quiz_type=quiz_type,
            questions=questions,
            answers=answers,
            score=score,
            passed=passed
        )
        self.db.add(quiz)
        self.db.commit()
        return quiz

    def _get_quiz_questions(self, quiz_type: str):
        questions = {
            'gdpr': [
                {'id': 1, 'question': 'What is the maximum fine for GDPR violations?', 'options': ['2% of revenue', '4% of revenue', '10% of revenue'], 'correct': 1},
                {'id': 2, 'question': 'How long do you have to report a data breach?', 'options': ['24 hours', '72 hours', '1 week'], 'correct': 1}
            ],
            'hipaa': [
                {'id': 1, 'question': 'What does PHI stand for?', 'options': ['Personal Health Info', 'Protected Health Information', 'Private Health Identity'], 'correct': 1},
                {'id': 2, 'question': 'Who can access PHI?', 'options': ['Anyone', 'Authorized personnel only', 'All employees'], 'correct': 1}
            ]
        }
        return questions.get(quiz_type, [])

    def _calculate_quiz_score(self, questions: list, answers: dict):
        correct = 0
        for q in questions:
            if str(q['id']) in answers and answers[str(q['id'])] == q['correct']:
                correct += 1
        return int((correct / len(questions)) * 100) if questions else 0