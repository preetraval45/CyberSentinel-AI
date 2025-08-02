"""Add ransomware simulation tables

Revision ID: 009_ransomware_simulation
Revises: 008_voice_calls
Create Date: 2024-01-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = '009_ransomware_simulation'
down_revision = '008_voice_calls'
branch_labels = None
depends_on = None

def upgrade():
    op.create_table('ransomware_simulations',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('scenario_type', sa.String(length=50), nullable=False),
        sa.Column('difficulty_level', sa.Integer(), nullable=True, default=1),
        sa.Column('current_step', sa.Integer(), nullable=True, default=0),
        sa.Column('total_steps', sa.Integer(), nullable=True, default=8),
        sa.Column('steps_completed', postgresql.JSONB(astext_type=sa.Text()), nullable=True, default=list),
        sa.Column('incorrect_actions', sa.Integer(), nullable=True, default=0),
        sa.Column('time_taken', sa.Float(), nullable=True, default=0.0),
        sa.Column('is_completed', sa.Boolean(), nullable=True, default=False),
        sa.Column('final_score', sa.Float(), nullable=True, default=0.0),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('completed_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    
    op.create_table('ransomware_steps',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('simulation_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('step_number', sa.Integer(), nullable=False),
        sa.Column('action_taken', sa.String(length=100), nullable=False),
        sa.Column('is_correct', sa.Boolean(), nullable=False),
        sa.Column('time_taken', sa.Float(), nullable=True, default=0.0),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['simulation_id'], ['ransomware_simulations.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

def downgrade():
    op.drop_table('ransomware_steps')
    op.drop_table('ransomware_simulations')