"""Add phishing gamification tables

Revision ID: 007_phishing_gamification
Revises: 006_chat_seed_data
Create Date: 2024-01-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers
revision = '007_phishing_gamification'
down_revision = '006_chat_seed_data'
branch_labels = None
depends_on = None

def upgrade():
    # Add ai_click_likelihood column to phishing_emails
    op.add_column('phishing_emails', sa.Column('ai_click_likelihood', sa.Float(), nullable=True, default=0.0))
    
    # Create phishing_game_sessions table
    op.create_table('phishing_game_sessions',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('difficulty_level', sa.Integer(), nullable=True, default=1),
        sa.Column('score', sa.Integer(), nullable=True, default=0),
        sa.Column('emails_processed', sa.Integer(), nullable=True, default=0),
        sa.Column('correct_identifications', sa.Integer(), nullable=True, default=0),
        sa.Column('false_positives', sa.Integer(), nullable=True, default=0),
        sa.Column('clicks_on_malicious', sa.Integer(), nullable=True, default=0),
        sa.Column('session_data', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('ended_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create phishing_alerts table
    op.create_table('phishing_alerts',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('email_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('alert_type', sa.String(length=50), nullable=False),
        sa.Column('response_time', sa.Float(), nullable=True),
        sa.Column('feedback_message', sa.Text(), nullable=True),
        sa.Column('xp_awarded', sa.Integer(), nullable=True, default=0),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['email_id'], ['phishing_emails.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

def downgrade():
    op.drop_table('phishing_alerts')
    op.drop_table('phishing_game_sessions')
    op.drop_column('phishing_emails', 'ai_click_likelihood')