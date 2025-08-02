#!/usr/bin/env python3
"""
Database migration runner script
"""
import os
import sys
import subprocess

def run_command(command):
    """Run a shell command and return the result"""
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✓ {command}")
        if result.stdout:
            print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"✗ {command}")
        print(f"Error: {e.stderr}")
        return False

def main():
    """Main migration runner"""
    os.chdir(os.path.join(os.path.dirname(__file__), '..', 'backend'))
    
    print("🚀 Running database migrations...")
    
    # Initialize Alembic if not already done
    if not os.path.exists('alembic'):
        print("Initializing Alembic...")
        if not run_command("alembic init alembic"):
            sys.exit(1)
    
    # Run migrations
    commands = [
        "alembic upgrade head",
        "python -c \"from config.database import engine, Base; Base.metadata.create_all(bind=engine); print('✓ Database tables created')\""
    ]
    
    for command in commands:
        if not run_command(command):
            sys.exit(1)
    
    print("✅ All migrations completed successfully!")

if __name__ == "__main__":
    main()