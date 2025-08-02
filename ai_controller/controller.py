import json
import os
from datetime import datetime
from typing import Dict, Any, Optional, List
from pathlib import Path

class AIController:
    def __init__(self, memory_file: str = "ai_memory.json", memory_dir: str = "./data"):
        self.memory_dir = Path(memory_dir)
        self.memory_file = self.memory_dir / memory_file
        self.memory_dir.mkdir(exist_ok=True)
        self.state = self._load_memory()
    
    def _load_memory(self) -> Dict[str, Any]:
        if self.memory_file.exists():
            try:
                with open(self.memory_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except (json.JSONDecodeError, IOError):
                pass
        return self._get_default_state()
    
    def _get_default_state(self) -> Dict[str, Any]:
        return {
            "session_id": None,
            "context": {},
            "conversation_history": [],
            "learned_patterns": {},
            "user_preferences": {},
            "threat_knowledge": {},
            "last_updated": datetime.now().isoformat(),
            "version": "1.0"
        }
    
    def save_memory(self) -> bool:
        try:
            self.state["last_updated"] = datetime.now().isoformat()
            with open(self.memory_file, 'w', encoding='utf-8') as f:
                json.dump(self.state, f, indent=2, ensure_ascii=False)
            return True
        except IOError:
            return False
    
    def update_context(self, key: str, value: Any) -> None:
        self.state["context"][key] = value
        self.save_memory()
    
    def resume_session(self, session_id: str) -> Dict[str, Any]:
        self.state["session_id"] = session_id
        self.save_memory()
        return {
            "session_id": session_id,
            "context": self.state["context"],
            "recent_conversations": self.state["conversation_history"][-5:],
            "active_patterns": len(self.state["learned_patterns"]),
            "threat_count": len(self.state["threat_knowledge"])
        }