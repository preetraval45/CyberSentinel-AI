"""Seed data for chat tables

Revision ID: 006
Revises: 005
Create Date: 2024-01-01 04:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import table, column
from sqlalchemy.dialects import postgresql
import uuid

revision = '006'
down_revision = '005'
branch_labels = None
depends_on = None

def upgrade():
    # Create indexes for chat tables
    op.create_index('idx_chat_messages_session', 'chat_messages', ['session_id'])
    op.create_index('idx_chat_messages_created', 'chat_messages', ['created_at'])
    op.create_index('idx_chat_sessions_user', 'chat_sessions', ['user_id'])
    op.create_index('idx_chat_sessions_status', 'chat_sessions', ['status'])
    op.create_index('idx_phishing_emails_user', 'phishing_emails', ['user_id'])
    op.create_index('idx_phishing_emails_type', 'phishing_emails', ['phishing_type'])

def downgrade():
    # Drop indexes
    op.drop_index('idx_phishing_emails_type', table_name='phishing_emails')
    op.drop_index('idx_phishing_emails_user', tablename='phishing_emails')
    op.drop_index('idx_chat_sessions_status', table_name='chat_sessions')
    op.drop_index('idx_chat_sessions_user', table_name='chat_sessions')
    op.drop_index('idx_chat_messages_created', table_name='chat_messages')
    op.drop_index('idx_chat_messages_session', table_name='chat_messages')
