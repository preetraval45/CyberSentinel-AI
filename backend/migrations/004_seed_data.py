"""Seed initial data

Revision ID: 004
Revises: 003
Create Date: 2024-01-01 03:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import table, column
from sqlalchemy.dialects import postgresql
import uuid

revision = '004'
down_revision = '003'
branch_labels = None
depends_on = None

def upgrade():
    # Define table structure for data insertion
    roles_table = table('roles',
        column('id', postgresql.UUID),
        column('name', sa.String),
        column('description', sa.String),
        column('permissions', postgresql.JSONB)
    )
    
    # Insert default roles
    op.bulk_insert(roles_table, [
        {
            'id': uuid.uuid4(),
            'name': 'admin',
            'description': 'System Administrator',
            'permissions': {
                "users": ["create", "read", "update", "delete"],
                "scenarios": ["create", "read", "update", "delete"],
                "audit": ["read"],
                "system": ["manage"]
            }
        },
        {
            'id': uuid.uuid4(),
            'name': 'instructor',
            'description': 'Training Instructor',
            'permissions': {
                "scenarios": ["create", "read", "update"],
                "attempts": ["read"],
                "users": ["read"]
            }
        },
        {
            'id': uuid.uuid4(),
            'name': 'user',
            'description': 'Regular User',
            'permissions': {
                "scenarios": ["read"],
                "attempts": ["create", "read"],
                "profile": ["update"]
            }
        }
    ])
    
    # Create indexes
    op.create_index('idx_users_email_active', 'users', ['email'], postgresql_where=sa.text('is_active = TRUE'))
    op.create_index('idx_users_admin', 'users', ['is_admin'], postgresql_where=sa.text('is_admin = TRUE'))
    op.create_index('idx_scenarios_type', 'scenarios', ['scenario_type'])
    op.create_index('idx_scenarios_difficulty', 'scenarios', ['difficulty_level'])
    op.create_index('idx_scenarios_active', 'scenarios', ['is_active'], postgresql_where=sa.text('is_active = TRUE'))
    op.create_index('idx_attempts_user_scenario', 'attempts', ['user_id', 'scenario_id'])
    op.create_index('idx_attempts_status', 'attempts', ['status'])
    op.create_index('idx_attempts_completed', 'attempts', ['completed_at'])
    op.create_index('idx_audit_user_action', 'logs', ['user_id', 'action'], schema='audit')
    op.create_index('idx_audit_resource', 'logs', ['resource', 'resource_id'], schema='audit')
    op.create_index('idx_audit_severity', 'logs', ['severity'], schema='audit')
    op.create_index('idx_audit_created', 'logs', ['created_at'], schema='audit')
    op.create_index('idx_user_roles_user', 'user_roles', ['user_id'])
    op.create_index('idx_user_sessions_user', 'user_sessions', ['user_id'])
    op.create_index('idx_user_sessions_active', 'user_sessions', ['is_active'], postgresql_where=sa.text('is_active = TRUE'))

def downgrade():
    # Drop indexes
    op.drop_index('idx_user_sessions_active')
    op.drop_index('idx_user_sessions_user')
    op.drop_index('idx_user_roles_user')
    op.drop_index('idx_audit_created', schema='audit')
    op.drop_index('idx_audit_severity', schema='audit')
    op.drop_index('idx_audit_resource', schema='audit')
    op.drop_index('idx_audit_user_action', schema='audit')
    op.drop_index('idx_attempts_completed')
    op.drop_index('idx_attempts_status')
    op.drop_index('idx_attempts_user_scenario')
    op.drop_index('idx_scenarios_active')
    op.drop_index('idx_scenarios_difficulty')
    op.drop_index('idx_scenarios_type')
    op.drop_index('idx_users_admin')
    op.drop_index('idx_users_email_active')
    
    # Clear roles data
    op.execute("DELETE FROM roles")