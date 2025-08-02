from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    slug = Column(String, nullable=False, unique=True)
    content = Column(Text, nullable=False)  # Markdown content
    category = Column(String, nullable=False)
    tags = Column(String)  # Comma-separated
    published = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ChatSession(Base):
    __tablename__ = "chat_sessions"
    
    id = Column(Integer, primary_key=True)
    session_id = Column(String, nullable=False)
    user_id = Column(Integer)
    messages = Column(Text)  # JSON string
    created_at = Column(DateTime, default=datetime.utcnow)