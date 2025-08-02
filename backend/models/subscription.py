from sqlalchemy import Column, Integer, String, DateTime, Boolean, Float
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Subscription(Base):
    __tablename__ = "subscriptions"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, nullable=False)
    stripe_customer_id = Column(String, nullable=False)
    stripe_subscription_id = Column(String, nullable=False)
    plan = Column(String, nullable=False)  # basic, pro, enterprise
    status = Column(String, nullable=False)  # active, canceled, past_due
    current_period_start = Column(DateTime, nullable=False)
    current_period_end = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Usage(Base):
    __tablename__ = "usage"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, nullable=False)
    metric = Column(String, nullable=False)  # api_calls, storage_gb, users
    quantity = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)