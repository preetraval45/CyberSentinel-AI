"""Update user roles to enum

Revision ID: 014
Revises: 013
Create Date: 2024-01-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers
revision = '014'
down_revision = '013'
branch_labels = None
depends_on = None

def upgrade():
    # Create enum type
    user_role_enum = postgresql.ENUM('SuperAdmin', 'User', 'LimitedUser', name='userrole')
    user_role_enum.create(op.get_bind())
    
    # Update existing role column
    op.execute("UPDATE users SET role = 'User' WHERE role = 'user'")
    op.execute("UPDATE users SET role = 'SuperAdmin' WHERE role = 'admin'")
    
    # Alter column to use enum
    op.alter_column('users', 'role',
                    existing_type=sa.VARCHAR(length=50),
                    type_=user_role_enum,
                    existing_nullable=True,
                    postgresql_using='role::userrole')

def downgrade():
    # Revert to string column
    op.alter_column('users', 'role',
                    existing_type=postgresql.ENUM('SuperAdmin', 'User', 'LimitedUser', name='userrole'),
                    type_=sa.VARCHAR(length=50),
                    existing_nullable=True)
    
    # Drop enum type
    user_role_enum = postgresql.ENUM('SuperAdmin', 'User', 'LimitedUser', name='userrole')
    user_role_enum.drop(op.get_bind())