from sqlalchemy.orm import Session
from models.ransomware import RansomwareSimulation, RansomwareStep
from datetime import datetime
import random

class RansomwareService:
    def __init__(self, db: Session):
        self.db = db

    def get_scenario_steps(self, scenario_type: str) -> list:
        scenarios = {
            "crypto_locker": [
                {"id": 1, "title": "Disconnect Network", "action": "disconnect_network", "description": "Immediately disconnect from network to prevent spread"},
                {"id": 2, "title": "Document Evidence", "action": "take_screenshot", "description": "Take screenshots of ransom message for investigation"},
                {"id": 3, "title": "Identify Processes", "action": "open_task_manager", "description": "Open Task Manager to identify malicious processes"},
                {"id": 4, "title": "Kill Malicious Process", "action": "end_process", "description": "Terminate suspicious encryption processes"},
                {"id": 5, "title": "Boot Safe Mode", "action": "safe_mode", "description": "Restart in Safe Mode to prevent further encryption"},
                {"id": 6, "title": "Run Antivirus", "action": "run_antivirus", "description": "Perform full system scan with updated antivirus"},
                {"id": 7, "title": "Restore from Backup", "action": "restore_backup", "description": "Restore encrypted files from clean backup"},
                {"id": 8, "title": "Report Incident", "action": "report_incident", "description": "Report to IT security team and authorities"}
            ],
            "file_encrypt": [
                {"id": 1, "title": "Isolate System", "action": "disconnect_network", "description": "Disconnect network cable/WiFi immediately"},
                {"id": 2, "title": "Stop Encryption", "action": "shutdown_system", "description": "Force shutdown to stop ongoing encryption"},
                {"id": 3, "title": "Boot from USB", "action": "boot_usb", "description": "Boot from antivirus rescue USB/CD"},
                {"id": 4, "title": "Scan for Malware", "action": "offline_scan", "description": "Run offline antivirus scan"},
                {"id": 5, "title": "Remove Ransomware", "action": "remove_malware", "description": "Delete identified ransomware files"},
                {"id": 6, "title": "Check File Integrity", "action": "check_files", "description": "Verify which files are encrypted"},
                {"id": 7, "title": "Restore Data", "action": "restore_backup", "description": "Restore from offline backup"},
                {"id": 8, "title": "Update Security", "action": "update_security", "description": "Update OS and security software"}
            ]
        }
        return scenarios.get(scenario_type, scenarios["crypto_locker"])

    def create_simulation_from_ai(self, user_id: str, scenario_type: str, difficulty_level: int, ai_data: dict):
        simulation = RansomwareSimulation(
            user_id=user_id,
            scenario_type=scenario_type,
            difficulty_level=difficulty_level,
            total_steps=len(ai_data["response_steps"]),
            steps_completed=[]
        )
        
        self.db.add(simulation)
        self.db.commit()
        self.db.refresh(simulation)
        return simulation

    def create_simulation(self, user_id: str, scenario_type: str, difficulty_level: int = 1):
        steps = self.get_scenario_steps(scenario_type)
        
        simulation = RansomwareSimulation(
            user_id=user_id,
            scenario_type=scenario_type,
            difficulty_level=difficulty_level,
            total_steps=len(steps),
            steps_completed=[]
        )
        
        self.db.add(simulation)
        self.db.commit()
        self.db.refresh(simulation)
        return simulation

    def execute_action(self, simulation_id: str, action: str, time_taken: float = 0.0):
        simulation = self.db.query(RansomwareSimulation).filter(RansomwareSimulation.id == simulation_id).first()
        if not simulation:
            return None

        steps = self.get_scenario_steps(simulation.scenario_type)
        current_step_info = steps[simulation.current_step] if simulation.current_step < len(steps) else None
        
        if not current_step_info:
            return {"error": "Simulation completed"}

        is_correct = action == current_step_info["action"]
        
        # Record step
        step_record = RansomwareStep(
            simulation_id=simulation_id,
            step_number=simulation.current_step + 1,
            action_taken=action,
            is_correct=is_correct,
            time_taken=time_taken
        )
        self.db.add(step_record)

        if is_correct:
            simulation.current_step += 1
            simulation.steps_completed = simulation.steps_completed + [current_step_info["id"]]
            simulation.time_taken += time_taken
            
            if simulation.current_step >= simulation.total_steps:
                simulation.is_completed = True
                simulation.completed_at = datetime.utcnow()
                simulation.final_score = self.calculate_score(simulation)
        else:
            simulation.incorrect_actions += 1

        self.db.commit()
        
        return {
            "correct": is_correct,
            "current_step": simulation.current_step,
            "completed": simulation.is_completed,
            "score": simulation.final_score if simulation.is_completed else 0,
            "next_step": steps[simulation.current_step] if simulation.current_step < len(steps) else None
        }

    def calculate_score(self, simulation: RansomwareSimulation) -> float:
        base_score = 100.0
        time_penalty = min(30, simulation.time_taken / 60)  # Max 30 points for time
        error_penalty = simulation.incorrect_actions * 10  # 10 points per error
        
        final_score = max(0, base_score - time_penalty - error_penalty)
        return round(final_score, 1)

    def get_simulation_state(self, simulation_id: str):
        simulation = self.db.query(RansomwareSimulation).filter(RansomwareSimulation.id == simulation_id).first()
        if not simulation:
            return None

        steps = self.get_scenario_steps(simulation.scenario_type)
        current_step = steps[simulation.current_step] if simulation.current_step < len(steps) else None

        return {
            "id": str(simulation.id),
            "scenario_type": simulation.scenario_type,
            "current_step": simulation.current_step,
            "total_steps": simulation.total_steps,
            "steps_completed": simulation.steps_completed,
            "incorrect_actions": simulation.incorrect_actions,
            "time_taken": simulation.time_taken,
            "is_completed": simulation.is_completed,
            "final_score": simulation.final_score,
            "current_step_info": current_step,
            "all_steps": steps
        }

    def get_user_simulations(self, user_id: str):
        return self.db.query(RansomwareSimulation).filter(RansomwareSimulation.user_id == user_id).order_by(RansomwareSimulation.created_at.desc()).all()