import pytest
import tempfile
import os
from ai_controller import AIController

def test_ai_controller_init():
    with tempfile.TemporaryDirectory() as temp_dir:
        ai = AIController(memory_dir=temp_dir)
        assert ai.state is not None
        assert "session_id" in ai.state

def test_update_context():
    with tempfile.TemporaryDirectory() as temp_dir:
        ai = AIController(memory_dir=temp_dir)
        ai.update_context("test_key", "test_value")
        assert ai.state["context"]["test_key"] == "test_value"

def test_resume_session():
    with tempfile.TemporaryDirectory() as temp_dir:
        ai = AIController(memory_dir=temp_dir)
        result = ai.resume_session("test_session")
        assert result["session_id"] == "test_session"