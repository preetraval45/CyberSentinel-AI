"""Add team simulation tables

Revision ID: 010_team_simulation
Revises: 009_ransomware_simulation
Create Date: 2024-01-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = '010_team_simulation'
down_revision = '009_ransomware_simulation'
branch_labels = None
depends_on = None

def upgrade():
    op.create_table('team_environments',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('platform', sa.String(length=20), nullable=False),
        sa.Column('team_name', sa.String(length=100), nullable=False),
        sa.Column('colleagues', postgresql.JSONB(astext_type=sa.Text()), nullable=True, default=list),
        sa.Column('channels', postgresql.JSONB(astext_type=sa.Text()), nullable=True, default=list),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    
    op.create_table('social_attack_messages',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('environment_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('sender_name', sa.String(length=100), nullable=False),
        sa.Column('sender_role', sa.String(length=50), nullable=False),
        sa.Column('channel', sa.String(length=50), nullable=False),
        sa.Column('message_content', sa.Text(), nullable=False),
        sa.Column('attack_type', sa.String(length=50), nullable=False),
        sa.Column('is_clicked', sa.Boolean(), nullable=True, default=False),
        sa.Column('is_reported', sa.Boolean(), nullable=True, default=False),
        sa.Column('user_response', sa.Text(), nullable=True),
        sa.Column('clicked_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('reported_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['environment_id'], ['team_environments.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

def downgrade():
    op.drop_table('social_attack_messages')
    op.drop_table('team_environments')