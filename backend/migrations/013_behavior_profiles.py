"""Add behavior profiles tables

Revision ID: 013_behavior_profiles
Revises: 012_user_profiles
Create Date: 2024-01-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = '013_behavior_profiles'
down_revision = '012_user_profiles'
branch_labels = None
depends_on = None

def upgrade():
    op.create_table('security_behavior_profiles',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('urgency_susceptibility', sa.Float(), nullable=True, default=0.5),
        sa.Column('authority_susceptibility', sa.Float(), nullable=True, default=0.5),
        sa.Column('curiosity_susceptibility', sa.Float(), nullable=True, default=0.5),
        sa.Column('fear_susceptibility', sa.Float(), nullable=True, default=0.5),
        sa.Column('trust_susceptibility', sa.Float(), nullable=True, default=0.5),
        sa.Column('avg_response_time', sa.Float(), nullable=True, default=30.0),
        sa.Column('click_rate', sa.Float(), nullable=True, default=0.3),
        sa.Column('report_rate', sa.Float(), nullable=True, default=0.7),
        sa.Column('improvement_rate', sa.Float(), nullable=True, default=0.0),
        sa.Column('plateau_threshold', sa.Float(), nullable=True, default=0.1),
        sa.Column('challenge_preference', sa.String(length=20), nullable=True, default='adaptive'),
        sa.Column('time_of_day_patterns', postgresql.JSONB(astext_type=sa.Text()), nullable=True, default=dict),
        sa.Column('device_patterns', postgresql.JSONB(astext_type=sa.Text()), nullable=True, default=dict),
        sa.Column('stress_indicators', postgresql.JSONB(astext_type=sa.Text()), nullable=True, default=dict),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id')
    )
    
    op.create_table('behavior_events',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('event_type', sa.String(length=50), nullable=False),
        sa.Column('simulation_type', sa.String(length=50), nullable=False),
        sa.Column('triggers_present', postgresql.JSONB(astext_type=sa.Text()), nullable=True, default=list),
        sa.Column('response_time', sa.Float(), nullable=True),
        sa.Column('context_data', postgresql.JSONB(astext_type=sa.Text()), nullable=True, default=dict),
        sa.Column('success_score', sa.Float(), nullable=True),
        sa.Column('timestamp', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

def downgrade():
    op.drop_table('behavior_events')
    op.drop_table('security_behavior_profiles')