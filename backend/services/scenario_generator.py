from models.training import TrainingScenario
from sqlalchemy.orm import Session

class ScenarioGenerator:
    def __init__(self, db: Session):
        self.db = db

    def create_default_scenarios(self):
        scenarios = [
            self._create_physical_security_scenario(),
            self._create_insider_threat_scenario(),
            self._create_malware_scenario(),
            self._create_ransomware_scenario(),
            self._create_wifi_scenario()
        ]
        
        for scenario_data in scenarios:
            scenario = TrainingScenario(**scenario_data)
            self.db.add(scenario)
        
        self.db.commit()

    def _create_physical_security_scenario(self):
        return {
            'title': 'Office Building Security Breach',
            'category': 'physical',
            'difficulty': 'intermediate',
            'ai_adaptive': True,
            'scenario_data': {
                'description': 'You notice an unfamiliar person in your secure office area without a visible badge.',
                'steps': {
                    'start': {
                        'content': 'An unknown person is walking through your secure office area. They appear confident but have no visible ID badge. What do you do?',
                        'decisions': {
                            'approach_directly': {
                                'outcome': 'You approach the person directly. They claim to be a new employee but cannot provide ID.',
                                'points': 5,
                                'correct': False,
                                'next_step': 'escalation_needed'
                            },
                            'call_security': {
                                'outcome': 'You immediately call security. They respond quickly and verify the person is unauthorized.',
                                'points': 10,
                                'correct': True,
                                'next_step': 'security_response'
                            },
                            'ignore_situation': {
                                'outcome': 'You ignore the situation. Later, you discover sensitive documents are missing.',
                                'points': -5,
                                'correct': False,
                                'next_step': 'incident_occurred'
                            }
                        }
                    },
                    'escalation_needed': {
                        'content': 'The person cannot provide proper identification. How do you proceed?',
                        'decisions': {
                            'escort_out': {
                                'outcome': 'You politely escort them to the exit and notify security.',
                                'points': 8,
                                'correct': True,
                                'next_step': 'end'
                            },
                            'let_them_stay': {
                                'outcome': 'You allow them to remain. This was a security test - you failed.',
                                'points': -10,
                                'correct': False,
                                'next_step': 'end'
                            }
                        }
                    }
                }
            }
        }

    def _create_insider_threat_scenario(self):
        return {
            'title': 'Suspicious Employee Behavior',
            'category': 'insider',
            'difficulty': 'advanced',
            'ai_adaptive': True,
            'scenario_data': {
                'description': 'You notice a colleague accessing files outside their normal responsibilities.',
                'steps': {
                    'start': {
                        'content': 'Your colleague Sarah is accessing financial records despite working in HR. She seems nervous when you approach. What do you do?',
                        'decisions': {
                            'confront_directly': {
                                'outcome': 'Sarah becomes defensive and claims she was asked to help. You sense deception.',
                                'points': 3,
                                'correct': False,
                                'next_step': 'investigation_needed'
                            },
                            'report_to_manager': {
                                'outcome': 'You report to your manager who initiates a proper investigation.',
                                'points': 10,
                                'correct': True,
                                'next_step': 'proper_channels'
                            },
                            'monitor_secretly': {
                                'outcome': 'You decide to watch her activities. This could compromise the investigation.',
                                'points': 2,
                                'correct': False,
                                'next_step': 'compromised_investigation'
                            }
                        }
                    }
                }
            }
        }

    def _create_malware_scenario(self):
        return {
            'title': 'Suspicious Email Attachment',
            'category': 'malware',
            'difficulty': 'beginner',
            'ai_adaptive': True,
            'scenario_data': {
                'description': 'You receive an email with an unexpected attachment from a known contact.',
                'steps': {
                    'start': {
                        'content': 'You receive an email from your colleague with a .exe attachment titled "Urgent_Report.exe". The email seems rushed. What do you do?',
                        'decisions': {
                            'open_attachment': {
                                'outcome': 'You open the attachment and your computer becomes infected with malware.',
                                'points': -10,
                                'correct': False,
                                'next_step': 'infection_occurred'
                            },
                            'verify_sender': {
                                'outcome': 'You call your colleague who confirms they never sent this email.',
                                'points': 10,
                                'correct': True,
                                'next_step': 'threat_identified'
                            },
                            'scan_attachment': {
                                'outcome': 'You scan the attachment with antivirus - it detects malware.',
                                'points': 8,
                                'correct': True,
                                'next_step': 'threat_blocked'
                            }
                        }
                    }
                }
            }
        }

    def _create_ransomware_scenario(self):
        return {
            'title': 'Ransomware Attack Response',
            'category': 'ransomware',
            'difficulty': 'advanced',
            'ai_adaptive': True,
            'scenario_data': {
                'description': 'Your computer screen shows a ransomware message demanding payment.',
                'steps': {
                    'start': {
                        'content': 'Your screen displays: "Your files are encrypted! Pay $500 in Bitcoin to decrypt." What is your immediate response?',
                        'decisions': {
                            'pay_ransom': {
                                'outcome': 'You pay the ransom but there\'s no guarantee of file recovery.',
                                'points': -15,
                                'correct': False,
                                'next_step': 'poor_outcome'
                            },
                            'disconnect_network': {
                                'outcome': 'You immediately disconnect from the network to prevent spread.',
                                'points': 10,
                                'correct': True,
                                'next_step': 'containment_success'
                            },
                            'restart_computer': {
                                'outcome': 'Restarting doesn\'t help and may cause more damage.',
                                'points': -5,
                                'correct': False,
                                'next_step': 'situation_worsened'
                            }
                        }
                    }
                }
            }
        }

    def _create_wifi_scenario(self):
        return {
            'title': 'Public WiFi Security',
            'category': 'wifi',
            'difficulty': 'intermediate',
            'ai_adaptive': True,
            'scenario_data': {
                'description': 'You need to work from a coffee shop with public WiFi.',
                'steps': {
                    'start': {
                        'content': 'You\'re at a coffee shop and need to access company files. You see networks: "CoffeeShop_WiFi", "FREE_INTERNET", and "CoffeeShop_Guest". What do you do?',
                        'decisions': {
                            'use_free_internet': {
                                'outcome': 'You connect to "FREE_INTERNET" - this could be a malicious hotspot.',
                                'points': -8,
                                'correct': False,
                                'next_step': 'security_risk'
                            },
                            'ask_staff_for_wifi': {
                                'outcome': 'Staff confirms "CoffeeShop_Guest" is legitimate and provides password.',
                                'points': 8,
                                'correct': True,
                                'next_step': 'safe_connection'
                            },
                            'use_mobile_hotspot': {
                                'outcome': 'You use your phone\'s hotspot - the most secure option.',
                                'points': 10,
                                'correct': True,
                                'next_step': 'optimal_security'
                            }
                        }
                    }
                }
            }
        }