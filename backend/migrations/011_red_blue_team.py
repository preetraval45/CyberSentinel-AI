"""Add red blue team competition tables

Revision ID: 011_red_blue_team
Revises: 010_team_simulation
Create Date: 2024-01-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = '011_red_blue_team'
down_revision = '010_team_simulation'
branch_labels = None
depends_on = None

def upgrade():
    op.create_table('competitions',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('status', sa.String(length=20), nullable=True, default='waiting'),
        sa.Column('current_round', sa.Integer(), nullable=True, default=1),
        sa.Column('total_rounds', sa.Integer(), nullable=True, default=3),
        sa.Column('round_duration', sa.Integer(), nullable=True, default=300),
        sa.Column('red_team_score', sa.Integer(), nullable=True, default=0),
        sa.Column('blue_team_score', sa.Integer(), nullable=True, default=0),
        sa.Column('round_end_time', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('completed_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    
    op.create_table('team_members',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('competition_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('team', sa.String(length=10), nullable=False),
        sa.Column('role', sa.String(length=20), nullable=False),
        sa.Column('score', sa.Integer(), nullable=True, default=0),
        sa.Column('joined_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['competition_id'], ['competitions.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    
    op.create_table('round_actions',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('competition_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('round_number', sa.Integer(), nullable=False),
        sa.Column('action_type', sa.String(length=50), nullable=False),
        sa.Column('target', sa.String(length=100), nullable=True),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('points_awarded', sa.Integer(), nullable=True, default=0),
        sa.Column('is_successful', sa.Boolean(), nullable=True, default=False),
        sa.Column('timestamp', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['competition_id'], ['competitions.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

def downgrade():
    op.drop_table('round_actions')
    op.drop_table('team_members')
    op.drop_table('competitions')