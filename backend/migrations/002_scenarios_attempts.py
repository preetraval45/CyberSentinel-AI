"""Add scenarios and attempts tables

Revision ID: 002
Revises: 001
Create Date: 2024-01-01 01:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = '002'
down_revision = '001'
branch_labels = None
depends_on = None

def upgrade():
    # Create scenarios table
    op.create_table('scenarios',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('description', sa.Text()),
        sa.Column('difficulty_level', sa.String(20)),
        sa.Column('scenario_type', sa.String(50), nullable=False),
        sa.Column('content', postgresql.JSONB(), nullable=False),
        sa.Column('is_active', sa.Boolean(), default=True),
        sa.Column('created_by', postgresql.UUID(as_uuid=True)),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), onupdate=sa.func.now()),
        sa.ForeignKeyConstraint(['created_by'], ['users.id']),
        sa.CheckConstraint("difficulty_level IN ('beginner', 'intermediate', 'advanced')")
    )
    
    # Create attempts table
    op.create_table('attempts',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('scenario_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('status', sa.String(20)),
        sa.Column('score', sa.Integer()),
        sa.Column('time_taken', sa.Integer()),
        sa.Column('responses', postgresql.JSONB()),
        sa.Column('feedback', sa.Text()),
        sa.Column('started_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('completed_at', sa.DateTime(timezone=True)),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['scenario_id'], ['scenarios.id'], ondelete='CASCADE'),
        sa.CheckConstraint("status IN ('in_progress', 'completed', 'failed', 'abandoned')"),
        sa.CheckConstraint("score >= 0 AND score <= 100")
    )

def downgrade():
    op.drop_table('attempts')
    op.drop_table('scenarios')