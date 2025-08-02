"""Add chat tables for phishing scenarios

Revision ID: 005
Revises: 004
Create Date: 2024-01-01 03:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = '005'
down_revision = '004'
branch_labels = None
depends_on = None

def upgrade():
    # Create phishing_emails table
    op.create_table('phishing_emails',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('subject', sa.String(255), nullable=False),
        sa.Column('sender', sa.String(255), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('phishing_type', sa.String(50), nullable=False),
        sa.Column('difficulty_level', sa.String(20), nullable=False),
        sa.Column('is_clicked', sa.Boolean(), default=False),
        sa.Column('is_reported', sa.Boolean(), default=False),
        sa.Column('clicked_at', sa.DateTime(timezone=True)),
        sa.Column('reported_at', sa.DateTime(timezone=True)),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE')
    )
    
    # Create chat_sessions table
    op.create_table('chat_sessions',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('scenario_type', sa.String(50), nullable=False),
        sa.Column('status', sa.String(20), default='active'),
        sa.Column('ai_persona', sa.String(100), nullable=False),
        sa.Column('context', postgresql.JSONB()),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('ended_at', sa.DateTime(timezone=True)),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE')
    )
    
    # Create chat_messages table
    op.create_table('chat_messages',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('session_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('sender_type', sa.String(10), nullable=False),  # 'user' or 'ai'
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('message_metadata', postgresql.JSONB()),  # Changed from 'metadata' to avoid reserved keyword
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['session_id'], ['chat_sessions.id'], ondelete='CASCADE')
    )

def downgrade():
    op.drop_table('chat_messages')
    op.drop_table('chat_sessions')
    op.drop_table('phishing_emails')
