"""Add roles and enhanced audit system

Revision ID: 003
Revises: 002
Create Date: 2024-01-01 02:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = '003'
down_revision = '002'
branch_labels = None
depends_on = None

def upgrade():
    # Create audit schema
    op.execute("CREATE SCHEMA IF NOT EXISTS audit")
    
    # Create roles table
    op.create_table('roles',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('name', sa.String(50), nullable=False, unique=True),
        sa.Column('description', sa.Text()),
        sa.Column('permissions', postgresql.JSONB()),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now())
    )
    
    # Create user_roles table
    op.create_table('user_roles',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('role_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('assigned_by', postgresql.UUID(as_uuid=True)),
        sa.Column('assigned_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['role_id'], ['roles.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['assigned_by'], ['users.id']),
        sa.UniqueConstraint('user_id', 'role_id')
    )
    
    # Create enhanced audit logs
    op.create_table('logs',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True)),
        sa.Column('action', sa.String(100), nullable=False),
        sa.Column('resource', sa.String(100)),
        sa.Column('resource_id', postgresql.UUID(as_uuid=True)),
        sa.Column('old_values', postgresql.JSONB()),
        sa.Column('new_values', postgresql.JSONB()),
        sa.Column('ip_address', postgresql.INET()),
        sa.Column('user_agent', sa.Text()),
        sa.Column('session_id', sa.String(255)),
        sa.Column('severity', sa.String(20)),
        sa.Column('status', sa.String(20)),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.CheckConstraint("severity IN ('low', 'medium', 'high', 'critical')"),
        sa.CheckConstraint("status IN ('success', 'failure', 'warning')"),
        schema='audit'
    )
    
    # Create user sessions table
    op.create_table('user_sessions',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('session_token', sa.String(255), nullable=False, unique=True),
        sa.Column('ip_address', postgresql.INET()),
        sa.Column('user_agent', sa.Text()),
        sa.Column('is_active', sa.Boolean(), default=True),
        sa.Column('expires_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('last_activity', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE')
    )

def downgrade():
    op.drop_table('user_sessions')
    op.drop_table('logs', schema='audit')
    op.drop_table('user_roles')
    op.drop_table('roles')
    op.execute("DROP SCHEMA IF EXISTS audit CASCADE")