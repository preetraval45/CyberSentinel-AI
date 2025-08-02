from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from config.database import get_db
from services.training_service import TrainingService
from services.scenario_generator import ScenarioGenerator
from middleware.auth_middleware import get_current_user
from models.user import User
from typing import Dict

router = APIRouter()

class StartScenarioRequest(BaseModel):
    scenario_id: str

class MakeDecisionRequest(BaseModel):
    progress_id: str
    step_id: str
    decision: str

class ComplianceQuizRequest(BaseModel):
    quiz_type: str
    answers: Dict[str, int]

@router.get("/scenarios/{category}")
def get_scenarios_by_category(
    category: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = TrainingService(db)
    scenarios = service.get_scenarios_by_category(category)
    return [{
        'id': str(s.id),
        'title': s.title,
        'category': s.category,
        'difficulty': s.difficulty,
        'ai_adaptive': s.ai_adaptive,
        'description': s.scenario_data.get('description', '')
    } for s in scenarios]

@router.post("/scenario/start")
def start_scenario(
    request: StartScenarioRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = TrainingService(db)
    progress = service.start_scenario(str(current_user.id), request.scenario_id)
    
    # Get first step content
    from models.training import TrainingScenario
    scenario = db.query(TrainingScenario).filter(TrainingScenario.id == request.scenario_id).first()
    first_step = scenario.scenario_data.get('steps', {}).get('start', {})
    
    return {
        'progress_id': str(progress.id),
        'current_step': progress.current_step,
        'content': first_step.get('content', ''),
        'decisions': list(first_step.get('decisions', {}).keys()),
        'score': progress.score
    }

@router.post("/scenario/decision")
def make_decision(
    request: MakeDecisionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = TrainingService(db)
    result = service.make_decision(request.progress_id, request.step_id, request.decision)
    
    if not result:
        raise HTTPException(status_code=404, detail="Progress not found")
    
    # Get next step content if not ended
    next_content = ""
    next_decisions = []
    
    if result['next_step'] != 'end':
        from models.training import UserProgress, TrainingScenario
        progress = db.query(UserProgress).filter(UserProgress.id == request.progress_id).first()
        scenario = db.query(TrainingScenario).filter(TrainingScenario.id == progress.scenario_id).first()
        next_step_data = scenario.scenario_data.get('steps', {}).get(result['next_step'], {})
        next_content = next_step_data.get('content', '')
        next_decisions = list(next_step_data.get('decisions', {}).keys())
    
    return {
        **result,
        'next_content': next_content,
        'next_decisions': next_decisions
    }

@router.post("/compliance/quiz")
def take_compliance_quiz(
    request: ComplianceQuizRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = TrainingService(db)
    quiz = service.create_compliance_quiz(str(current_user.id), request.quiz_type, request.answers)
    
    return {
        'quiz_id': str(quiz.id),
        'score': quiz.score,
        'passed': quiz.passed,
        'quiz_type': quiz.quiz_type,
        'completed_at': quiz.completed_at
    }

@router.get("/compliance/questions/{quiz_type}")
def get_quiz_questions(
    quiz_type: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = TrainingService(db)
    questions = service._get_quiz_questions(quiz_type)
    
    # Remove correct answers from response
    safe_questions = []
    for q in questions:
        safe_q = {k: v for k, v in q.items() if k != 'correct'}
        safe_questions.append(safe_q)
    
    return {'questions': safe_questions}

@router.post("/scenarios/initialize")
def initialize_default_scenarios(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    generator = ScenarioGenerator(db)
    generator.create_default_scenarios()
    return {'message': 'Default scenarios created successfully'}

@router.get("/progress/{user_id}")
def get_user_progress(
    user_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if str(current_user.id) != user_id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Access denied")
    
    from models.training import UserProgress
    progress_records = db.query(UserProgress).filter(UserProgress.user_id == user_id).all()
    
    return [{
        'id': str(p.id),
        'scenario_id': str(p.scenario_id),
        'current_step': p.current_step,
        'score': p.score,
        'completion_rate': p.completion_rate,
        'status': p.status,
        'started_at': p.started_at,
        'completed_at': p.completed_at
    } for p in progress_records]