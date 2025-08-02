"""Add user profiles table

Revision ID: 012_user_profiles
Revises: 011_red_blue_team
Create Date: 2024-01-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = '012_user_profiles'
down_revision = '011_red_blue_team'
branch_labels = None
depends_on = None

def upgrade():
    op.create_table('user_profiles',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('job_role', sa.String(length=100), nullable=True),
        sa.Column('department', sa.String(length=100), nullable=True),
        sa.Column('company_size', sa.String(length=20), nullable=True),
        sa.Column('industry', sa.String(length=100), nullable=True),
        sa.Column('location', sa.String(length=100), nullable=True),
        sa.Column('language_preference', sa.String(length=10), nullable=True, default='en'),
        sa.Column('communication_style', sa.String(length=20), nullable=True),
        sa.Column('vulnerability_patterns', postgresql.JSONB(astext_type=sa.Text()), nullable=True, default=list),
        sa.Column('response_history', postgresql.JSONB(astext_type=sa.Text()), nullable=True, default=list),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id')
    )

def downgrade():
    op.drop_table('user_profiles')