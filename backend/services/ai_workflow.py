import json
import os
from datetime import datetime
from typing import Dict, Any, List, Optional
from pathlib import Path
from enum import Enum
import openai

class TaskStatus(Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"

class AIWorkflowService:
    def __init__(self, memory_dir: str = "./data/ai_memory"):
        self.memory_dir = Path(memory_dir)
        self.memory_dir.mkdir(parents=True, exist_ok=True)
        self.memory_file = self.memory_dir / "workflow_memory.json"
        self.state = self._load_memory()
        openai.api_key = os.getenv("OPENAI_API_KEY")

    def _load_memory(self) -> Dict[str, Any]:
        """Load AI workflow state from memory file"""
        if self.memory_file.exists():
            try:
                with open(self.memory_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except (json.JSONDecodeError, IOError):
                pass
        return self._get_default_state()

    def _get_default_state(self) -> Dict[str, Any]:
        """Return default AI workflow state"""
        return {
            "session_id": None,
            "current_context": "security_analysis",
            "active_tasks": [],
            "completed_tasks": [],
            "user_preferences": {},
            "threat_knowledge": {},
            "next_steps": [],
            "last_updated": datetime.now().isoformat(),
            "version": "1.0"
        }

    def _save_memory(self):
        """Save current state to memory file"""
        self.state["last_updated"] = datetime.now().isoformat()
        try:
            with open(self.memory_file, 'w', encoding='utf-8') as f:
                json.dump(self.state, f, indent=2, ensure_ascii=False)
        except IOError as e:
            print(f"Failed to save memory: {e}")

    def start_session(self, user_id: str, context: str = "security_analysis") -> Dict[str, Any]:
        """Initialize new AI workflow session"""
        self.state["session_id"] = user_id
        self.state["current_context"] = context
        self.state["next_steps"] = self._generate_initial_steps(context)
        self._save_memory()
        
        return {
            "session_id": user_id,
            "context": context,
            "next_steps": self.state["next_steps"],
            "status": "initialized"
        }

    def _generate_initial_steps(self, context: str) -> List[Dict[str, Any]]:
        """Generate initial actionable steps based on context"""
        steps_map = {
            "security_analysis": [
                {"id": "scan_threats", "title": "Scan for Active Threats", "priority": "high"},
                {"id": "check_vulnerabilities", "title": "Check System Vulnerabilities", "priority": "medium"},
                {"id": "review_logs", "title": "Review Security Logs", "priority": "low"}
            ],
            "incident_response": [
                {"id": "assess_impact", "title": "Assess Incident Impact", "priority": "critical"},
                {"id": "contain_threat", "title": "Contain Security Threat", "priority": "critical"},
                {"id": "collect_evidence", "title": "Collect Forensic Evidence", "priority": "high"}
            ],
            "training_analysis": [
                {"id": "analyze_performance", "title": "Analyze User Performance", "priority": "medium"},
                {"id": "identify_gaps", "title": "Identify Knowledge Gaps", "priority": "medium"},
                {"id": "recommend_training", "title": "Recommend Training Modules", "priority": "low"}
            ]
        }
        return steps_map.get(context, steps_map["security_analysis"])

    def get_next_steps(self) -> List[Dict[str, Any]]:
        """Get actionable next steps for current session"""
        if not self.state["next_steps"]:
            self.state["next_steps"] = self._generate_contextual_steps()
            self._save_memory()
        return self.state["next_steps"]

    def _generate_contextual_steps(self) -> List[Dict[str, Any]]:
        """Generate contextual next steps using AI"""
        try:
            prompt = f"""
            Based on the current security context: {self.state['current_context']}
            Completed tasks: {len(self.state['completed_tasks'])}
            Active tasks: {len(self.state['active_tasks'])}
            
            Generate 3 actionable next steps for cybersecurity analysis.
            Return as JSON array with id, title, and priority fields.
            """
            
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=200
            )
            
            steps_text = response.choices[0].message.content
            return json.loads(steps_text)
        except:
            return self._generate_initial_steps(self.state["current_context"])

    def execute_task(self, task_id: str, user_input: Dict[str, Any] = None) -> Dict[str, Any]:
        """Execute a specific task and update memory"""
        task = self._find_task(task_id)
        if not task:
            return {"error": "Task not found"}

        # Move to active tasks
        self._move_task_to_active(task_id)
        
        # Execute task logic
        result = self._execute_task_logic(task_id, user_input or {})
        
        # Update task status
        if result.get("success"):
            self._complete_task(task_id, result)
        else:
            self._fail_task(task_id, result.get("error", "Unknown error"))
        
        # Generate new next steps
        self.state["next_steps"] = self._generate_contextual_steps()
        self._save_memory()
        
        return result

    def _find_task(self, task_id: str) -> Optional[Dict[str, Any]]:
        """Find task by ID in next_steps or active_tasks"""
        for task in self.state["next_steps"] + self.state["active_tasks"]:
            if task.get("id") == task_id:
                return task
        return None

    def _move_task_to_active(self, task_id: str):
        """Move task from next_steps to active_tasks"""
        task = None
        self.state["next_steps"] = [t for t in self.state["next_steps"] if t.get("id") != task_id or (task := t)]
        if task:
            task["status"] = TaskStatus.IN_PROGRESS.value
            task["started_at"] = datetime.now().isoformat()
            self.state["active_tasks"].append(task)

    def _execute_task_logic(self, task_id: str, user_input: Dict[str, Any]) -> Dict[str, Any]:
        """Execute specific task logic"""
        task_handlers = {
            "scan_threats": self._scan_threats,
            "check_vulnerabilities": self._check_vulnerabilities,
            "review_logs": self._review_logs,
            "assess_impact": self._assess_impact,
            "analyze_performance": self._analyze_performance
        }
        
        handler = task_handlers.get(task_id, self._default_task_handler)
        return handler(user_input)

    def _scan_threats(self, user_input: Dict[str, Any]) -> Dict[str, Any]:
        """Simulate threat scanning"""
        return {
            "success": True,
            "result": "Threat scan completed",
            "threats_found": 2,
            "recommendations": ["Update firewall rules", "Patch vulnerable services"]
        }

    def _check_vulnerabilities(self, user_input: Dict[str, Any]) -> Dict[str, Any]:
        """Simulate vulnerability check"""
        return {
            "success": True,
            "result": "Vulnerability assessment completed",
            "vulnerabilities": 3,
            "critical": 1,
            "recommendations": ["Apply security patches", "Review access controls"]
        }

    def _review_logs(self, user_input: Dict[str, Any]) -> Dict[str, Any]:
        """Simulate log review"""
        return {
            "success": True,
            "result": "Security logs reviewed",
            "anomalies": 1,
            "recommendations": ["Investigate suspicious login attempts"]
        }

    def _assess_impact(self, user_input: Dict[str, Any]) -> Dict[str, Any]:
        """Simulate impact assessment"""
        return {
            "success": True,
            "result": "Impact assessment completed",
            "severity": "medium",
            "affected_systems": 2,
            "recommendations": ["Isolate affected systems", "Begin containment procedures"]
        }

    def _analyze_performance(self, user_input: Dict[str, Any]) -> Dict[str, Any]:
        """Simulate performance analysis"""
        return {
            "success": True,
            "result": "Performance analysis completed",
            "average_score": 78,
            "improvement_areas": ["Phishing recognition", "Password security"]
        }

    def _default_task_handler(self, user_input: Dict[str, Any]) -> Dict[str, Any]:
        """Default task handler"""
        return {
            "success": True,
            "result": "Task completed successfully",
            "message": "Generic task execution completed"
        }

    def _complete_task(self, task_id: str, result: Dict[str, Any]):
        """Mark task as completed and move to completed_tasks"""
        task = None
        self.state["active_tasks"] = [t for t in self.state["active_tasks"] if t.get("id") != task_id or (task := t)]
        if task:
            task["status"] = TaskStatus.COMPLETED.value
            task["completed_at"] = datetime.now().isoformat()
            task["result"] = result
            self.state["completed_tasks"].append(task)

    def _fail_task(self, task_id: str, error: str):
        """Mark task as failed"""
        for task in self.state["active_tasks"]:
            if task.get("id") == task_id:
                task["status"] = TaskStatus.FAILED.value
                task["failed_at"] = datetime.now().isoformat()
                task["error"] = error
                break

    def get_session_state(self) -> Dict[str, Any]:
        """Get current session state"""
        return {
            "session_id": self.state["session_id"],
            "context": self.state["current_context"],
            "active_tasks": len(self.state["active_tasks"]),
            "completed_tasks": len(self.state["completed_tasks"]),
            "next_steps": self.state["next_steps"],
            "last_updated": self.state["last_updated"]
        }

    def resume_session(self) -> Dict[str, Any]:
        """Resume existing session seamlessly"""
        if not self.state["session_id"]:
            return {"error": "No active session to resume"}
        
        # Clean up any stale in-progress tasks
        for task in self.state["active_tasks"]:
            if task.get("status") == TaskStatus.IN_PROGRESS.value:
                # Reset to pending if no recent activity
                task["status"] = TaskStatus.PENDING.value
        
        return {
            "session_id": self.state["session_id"],
            "context": self.state["current_context"],
            "next_steps": self.get_next_steps(),
            "status": "resumed"
        }