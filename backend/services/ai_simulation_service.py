from openai import OpenAI
import json
import os
from typing import Dict, Any

class AISimulationService:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    def generate_phishing_simulation(self, user_profile: Dict[str, Any]) -> Dict[str, Any]:
        functions = [{
            "name": "create_phishing_simulation",
            "description": "Generate a complete phishing simulation with email content and scoring parameters",
            "parameters": {
                "type": "object",
                "properties": {
                    "email": {
                        "type": "object",
                        "properties": {
                            "subject": {"type": "string", "description": "Email subject line"},
                            "sender": {"type": "string", "description": "Sender email address"},
                            "sender_name": {"type": "string", "description": "Display name of sender"},
                            "content": {"type": "string", "description": "Email body content"},
                            "attachments": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "name": {"type": "string"},
                                        "type": {"type": "string"},
                                        "malicious": {"type": "boolean"}
                                    }
                                }
                            }
                        },
                        "required": ["subject", "sender", "sender_name", "content"]
                    },
                    "attack_vector": {
                        "type": "string",
                        "enum": ["credential_harvest", "malware_link", "social_engineering", "business_email_compromise"]
                    },
                    "difficulty_level": {"type": "integer", "minimum": 1, "maximum": 5},
                    "psychological_triggers": {
                        "type": "array",
                        "items": {"type": "string", "enum": ["urgency", "authority", "fear", "curiosity", "greed", "trust"]}
                    },
                    "scoring": {
                        "type": "object",
                        "properties": {
                            "base_click_likelihood": {"type": "number", "minimum": 0, "maximum": 1},
                            "personalization_multiplier": {"type": "number", "minimum": 0.5, "maximum": 2.0},
                            "success_points": {"type": "integer", "minimum": 10, "maximum": 100},
                            "failure_penalty": {"type": "integer", "minimum": -50, "maximum": 0},
                            "time_bonus_threshold": {"type": "integer", "minimum": 10, "maximum": 300}
                        },
                        "required": ["base_click_likelihood", "success_points", "failure_penalty"]
                    },
                    "learning_objectives": {
                        "type": "array",
                        "items": {"type": "string"}
                    }
                },
                "required": ["email", "attack_vector", "difficulty_level", "psychological_triggers", "scoring"]
            }
        }]

        prompt = f"""Create a personalized phishing simulation for a user with the following profile:
        
Job Role: {user_profile.get('job_role', 'Employee')}
Industry: {user_profile.get('industry', 'Technology')}
Location: {user_profile.get('location', 'United States')}
Communication Style: {user_profile.get('communication_style', 'professional')}
Previous Vulnerabilities: {user_profile.get('vulnerability_patterns', [])}

Generate a realistic phishing email that:
1. Targets their specific role and industry
2. Uses appropriate psychological triggers
3. Includes proper scoring parameters
4. Matches their communication style and location"""

        temperature = 0.9 if behavior_insights and behavior_insights.get('risk_level') == 'high' else 0.7
        
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a cybersecurity expert creating realistic phishing simulations for training purposes."},
                {"role": "user", "content": prompt}
            ],
            functions=functions,
            function_call={"name": "create_phishing_simulation"},
            temperature=temperature
        )

        function_call = response.choices[0].message.function_call
        return json.loads(function_call.arguments)

    def generate_ransomware_scenario(self, difficulty: int) -> Dict[str, Any]:
        functions = [{
            "name": "create_ransomware_scenario",
            "description": "Generate a ransomware incident response scenario with steps and scoring",
            "parameters": {
                "type": "object",
                "properties": {
                    "scenario": {
                        "type": "object",
                        "properties": {
                            "name": {"type": "string"},
                            "description": {"type": "string"},
                            "ransomware_type": {"type": "string"},
                            "initial_infection": {"type": "string"},
                            "ransom_note": {"type": "string"}
                        },
                        "required": ["name", "description", "ransomware_type", "ransom_note"]
                    },
                    "response_steps": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "step_number": {"type": "integer"},
                                "title": {"type": "string"},
                                "description": {"type": "string"},
                                "action_required": {"type": "string"},
                                "points": {"type": "integer"},
                                "time_limit": {"type": "integer"}
                            },
                            "required": ["step_number", "title", "description", "action_required", "points"]
                        }
                    },
                    "scoring_criteria": {
                        "type": "object",
                        "properties": {
                            "perfect_score": {"type": "integer"},
                            "time_penalty_per_second": {"type": "number"},
                            "error_penalty": {"type": "integer"},
                            "bonus_conditions": {
                                "type": "array",
                                "items": {"type": "string"}
                            }
                        },
                        "required": ["perfect_score", "time_penalty_per_second", "error_penalty"]
                    }
                },
                "required": ["scenario", "response_steps", "scoring_criteria"]
            }
        }]

        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a cybersecurity incident response expert creating training scenarios."},
                {"role": "user", "content": f"Create a ransomware incident response scenario with difficulty level {difficulty}/5. Include 6-8 response steps with appropriate scoring."}
            ],
            functions=functions,
            function_call={"name": "create_ransomware_scenario"},
            temperature=0.7
        )

        function_call = response.choices[0].message.function_call
        return json.loads(function_call.arguments)

    def generate_red_blue_challenge(self, team: str, round_number: int) -> Dict[str, Any]:
        functions = [{
            "name": "create_red_blue_challenge",
            "description": "Generate a Red Team vs Blue Team challenge with objectives and scoring",
            "parameters": {
                "type": "object",
                "properties": {
                    "challenge": {
                        "type": "object",
                        "properties": {
                            "title": {"type": "string"},
                            "description": {"type": "string"},
                            "team": {"type": "string", "enum": ["red", "blue"]},
                            "round": {"type": "integer"},
                            "scenario": {"type": "string"}
                        },
                        "required": ["title", "description", "team", "scenario"]
                    },
                    "objectives": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "id": {"type": "string"},
                                "description": {"type": "string"},
                                "points": {"type": "integer"},
                                "difficulty": {"type": "string", "enum": ["easy", "medium", "hard"]},
                                "time_limit": {"type": "integer"}
                            },
                            "required": ["id", "description", "points", "difficulty"]
                        }
                    },
                    "scoring": {
                        "type": "object",
                        "properties": {
                            "base_points": {"type": "integer"},
                            "time_multiplier": {"type": "number"},
                            "collaboration_bonus": {"type": "integer"},
                            "innovation_bonus": {"type": "integer"}
                        },
                        "required": ["base_points", "time_multiplier"]
                    },
                    "hints": {
                        "type": "array",
                        "items": {"type": "string"}
                    }
                },
                "required": ["challenge", "objectives", "scoring"]
            }
        }]

        team_context = "attacking" if team == "red" else "defending"
        
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": f"You are creating competitive cybersecurity challenges for {team} team ({team_context})."},
                {"role": "user", "content": f"Create a round {round_number} challenge for {team} team with 3-5 objectives of varying difficulty."}
            ],
            functions=functions,
            function_call={"name": "create_red_blue_challenge"},
            temperature=0.8
        )

        function_call = response.choices[0].message.function_call
        return json.loads(function_call.arguments)