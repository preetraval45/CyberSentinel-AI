check# AI Controller - Persistent Memory Storage

```python
import json
import os
from datetime import datetime
from typing import Dict, Any, Optional, List
from pathlib import Path

class AIController:
    """AI Agent Controller with persistent memory storage using JSON."""
    
    def __init__(self, memory_file: str = "ai_memory.json", memory_dir: str = "./data"):
        self.memory_dir = Path(memory_dir)
        self.memory_file = self.memory_dir / memory_file
        self.memory_dir.mkdir(exist_ok=True)
        self.state = self._load_memory()
    
    def _load_memory(self) -> Dict[str, Any]:
        """Load AI agent state from JSON file."""
        if self.memory_file.exists():
            try:
                with open(self.memory_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except (json.JSONDecodeError, IOError):
                pass
        return self._get_default_state()
    
    def _get_default_state(self) -> Dict[str, Any]:
        """Return default AI agent state."""
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
        """Save current state to JSON file."""
        try:
            self.state["last_updated"] = datetime.now().isoformat()
            with open(self.memory_file, 'w', encoding='utf-8') as f:
                json.dump(self.state, f, indent=2, ensure_ascii=False)
            return True
        except IOError:
            return False
    
    def update_context(self, key: str, value: Any) -> None:
        """Update context information."""
        self.state["context"][key] = value
        self.save_memory()
    
    def add_conversation(self, user_input: str, ai_response: str) -> None:
        """Add conversation to history."""
        conversation = {
            "timestamp": datetime.now().isoformat(),
            "user": user_input,
            "ai": ai_response
        }
        self.state["conversation_history"].append(conversation)
        if len(self.state["conversation_history"]) > 100:
            self.state["conversation_history"] = self.state["conversation_history"][-100:]
        self.save_memory()
    
    def learn_pattern(self, pattern_type: str, pattern_data: Dict[str, Any]) -> None:
        """Store learned security patterns."""
        if pattern_type not in self.state["learned_patterns"]:
            self.state["learned_patterns"][pattern_type] = []
        self.state["learned_patterns"][pattern_type].append({
            "data": pattern_data,
            "learned_at": datetime.now().isoformat()
        })
        self.save_memory()
    
    def update_threat_knowledge(self, threat_id: str, threat_info: Dict[str, Any]) -> None:
        """Update threat intelligence database."""
        self.state["threat_knowledge"][threat_id] = {
            **threat_info,
            "updated_at": datetime.now().isoformat()
        }
        self.save_memory()
    
    def set_user_preference(self, key: str, value: Any) -> None:
        """Set user preference."""
        self.state["user_preferences"][key] = value
        self.save_memory()
    
    def get_context(self, key: str = None) -> Any:
        """Get context information."""
        if key:
            return self.state["context"].get(key)
        return self.state["context"]
    
    def get_conversation_history(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Get recent conversation history."""
        return self.state["conversation_history"][-limit:]
    
    def get_learned_patterns(self, pattern_type: str = None) -> Any:
        """Get learned patterns."""
        if pattern_type:
            return self.state["learned_patterns"].get(pattern_type, [])
        return self.state["learned_patterns"]
    
    def get_threat_knowledge(self, threat_id: str = None) -> Any:
        """Get threat knowledge."""
        if threat_id:
            return self.state["threat_knowledge"].get(threat_id)
        return self.state["threat_knowledge"]
    
    def resume_session(self, session_id: str) -> Dict[str, Any]:
        """Resume AI agent session."""
        self.state["session_id"] = session_id
        self.save_memory()
        return {
            "session_id": session_id,
            "context": self.state["context"],
            "recent_conversations": self.get_conversation_history(5),
            "active_patterns": len(self.state["learned_patterns"]),
            "threat_count": len(self.state["threat_knowledge"])
        }
    
    def reset_memory(self, keep_learned_data: bool = True) -> None:
        """Reset AI memory with option to keep learned data."""
        if keep_learned_data:
            learned_patterns = self.state["learned_patterns"]
            threat_knowledge = self.state["threat_knowledge"]
            self.state = self._get_default_state()
            self.state["learned_patterns"] = learned_patterns
            self.state["threat_knowledge"] = threat_knowledge
        else:
            self.state = self._get_default_state()
        self.save_memory()
    
    def export_memory(self, export_path: str) -> bool:
        """Export memory to specified path."""
        try:
            export_file = Path(export_path)
            export_file.parent.mkdir(parents=True, exist_ok=True)
            with open(export_file, 'w', encoding='utf-8') as f:
                json.dump(self.state, f, indent=2, ensure_ascii=False)
            return True
        except IOError:
            return False
    
    def get_memory_stats(self) -> Dict[str, Any]:
        """Get memory usage statistics."""
        return {
            "total_conversations": len(self.state["conversation_history"]),
            "learned_pattern_types": len(self.state["learned_patterns"]),
            "total_patterns": sum(len(patterns) for patterns in self.state["learned_patterns"].values()),
            "threat_entries": len(self.state["threat_knowledge"]),
            "context_keys": len(self.state["context"]),
            "last_updated": self.state["last_updated"],
            "memory_file_size": self.memory_file.stat().st_size if self.memory_file.exists() else 0
        }

# Usage Example
if __name__ == "__main__":
    # Initialize AI Controller
    ai = AIController()
    
    # Resume or start session
    session_info = ai.resume_session("session_001")
    print(f"Session resumed: {session_info}")
    
    # Update context
    ai.update_context("current_task", "threat_analysis")
    ai.update_context("security_level", "high")
    
    # Add conversation
    ai.add_conversation("Analyze network traffic", "Detected 3 anomalies in traffic patterns")
    
    # Learn security pattern
    ai.learn_pattern("network_anomaly", {
        "pattern": "unusual_port_scanning",
        "severity": "medium",
        "indicators": ["rapid_port_access", "sequential_scanning"]
    })
    
    # Update threat knowledge
    ai.update_threat_knowledge("threat_001", {
        "type": "malware",
        "name": "TrojanX",
        "severity": "high",
        "mitigation": "isolate_and_scan"
    })
    
    # Get memory statistics
    stats = ai.get_memory_stats()
    print(f"Memory stats: {stats}")
```

## Key Features

### Persistent Storage

- JSON-based memory storage for cross-session persistence
- Automatic file creation and directory management
- Error handling for corrupted or missing files

### Memory Management

- **Context Storage**: Current task and environment state
- **Conversation History**: Recent user interactions (limited to 100 entries)
- **Pattern Learning**: Security patterns and threat indicators
- **Threat Knowledge**: Comprehensive threat intelligence database
- **User Preferences**: Personalized settings and configurations

### Core Functions

#### Memory Operations

- `_load_memory()`: Load state from JSON file
- `save_memory()`: Persist current state to disk
- `reset_memory()`: Clear memory with optional data retention
- `export_memory()`: Backup memory to specified location

#### State Management

- `update_context()`: Update current context information
- `add_conversation()`: Store user-AI interactions
- `learn_pattern()`: Record new security patterns
- `update_threat_knowledge()`: Update threat intelligence
- `set_user_preference()`: Store user preferences

#### Data Retrieval

- `get_context()`: Retrieve context information
- `get_conversation_history()`: Get recent conversations
- `get_learned_patterns()`: Access learned security patterns
- `get_threat_knowledge()`: Retrieve threat intelligence
- `resume_session()`: Restore previous session state

#### Analytics

- `get_memory_stats()`: Memory usage and statistics
- Automatic timestamp tracking for all updates
- Version control for memory format compatibility

### Usage Patterns

```python
# Initialize with custom path
ai = AIController(memory_file="agent_memory.json", memory_dir="./ai_data")

# Context management
ai.update_context("analysis_mode", "real_time")
current_context = ai.get_context()

# Learning from security events
ai.learn_pattern("intrusion_attempt", {
    "source_ip": "192.168.1.100",
    "attack_type": "brute_force",
    "target_service": "ssh"
})

# Session continuity
session_data = ai.resume_session("user_123_session")
```

## Dependencies

The AI Controller requires the following Python packages to be installed:

### Core Dependencies

- **fastapi==0.104.1**: Web framework for API endpoints
- **uvicorn[standard]==0.24.0**: ASGI server for running FastAPI applications
- **sqlalchemy==2.0.23**: Database ORM for data persistence
- **psycopg2-binary==2.9.10**: PostgreSQL database adapter (newer version installed)
- **alembic==1.12.1**: Database migration tool
- **pydantic==2.11.7**: Data validation and serialization (newer version installed)
- **python-jose[cryptography]==3.3.0**: JWT token handling for authentication
- **passlib[bcrypt]==1.7.4**: Password hashing for user authentication
- **python-multipart==0.0.6**: Handling multipart form data
- **redis==5.0.1**: In-memory data structure store for caching
- **openai==0.28.1**: OpenAI API client for AI capabilities
- **qrcode[pil]==7.4.2**: QR code generation
- **httpx==0.25.2**: HTTP client for making requests

### Development Dependencies

- **pytest==7.4.3**: Testing framework
- **pytest-asyncio==0.21.1**: Async support for pytest

This implementation provides a lightweight, efficient persistent memory system for AI agents in cybersecurity applications, ensuring continuity across sessions while maintaining performance and data integrity.
