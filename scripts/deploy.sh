#!/bin/bash

# CyberSentinel AI Deployment Script

set -e

echo "🚀 Starting CyberSentinel AI deployment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Set environment variables
export ENVIRONMENT=${ENVIRONMENT:-development}
export POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-password}
export JWT_SECRET=${JWT_SECRET:-$(openssl rand -base64 32)}
export NEXTAUTH_SECRET=${NEXTAUTH_SECRET:-$(openssl rand -base64 32)}

echo "📋 Environment: $ENVIRONMENT"

# Create necessary directories
mkdir -p ./data
mkdir -p ./logs
mkdir -p ./docker/nginx/ssl

# Set up SSL certificates
echo "🔒 Setting up SSL certificates..."
if [ "$ENVIRONMENT" = "production" ]; then
    # Production: Use Let's Encrypt
    echo "Using Let's Encrypt for production SSL"
    # This would typically be handled by a separate SSL setup process
else
    # Development: Generate self-signed certificates
    echo "Generating self-signed certificates for development"
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout ./docker/nginx/ssl/key.pem \
        -out ./docker/nginx/ssl/cert.pem \
        -subj "/C=US/ST=State/L=City/O=CyberSentinel/CN=cybersentinel.local"
    
    # Add to hosts file if not exists
    if ! grep -q "cybersentinel.local" /etc/hosts 2>/dev/null; then
        echo "127.0.0.1 cybersentinel.local www.cybersentinel.local" | sudo tee -a /etc/hosts
        echo "📝 Added cybersentinel.local to /etc/hosts"
    fi
fi

# Build and start services
echo "🏗️ Building and starting services..."
docker-compose down --remove-orphans
docker-compose build --no-cache
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Check service health
echo "🔍 Checking service health..."
if curl -k -f https://cybersentinel.local/health > /dev/null 2>&1; then
    echo "✅ Nginx is healthy"
else
    echo "⚠️ Nginx health check failed"
fi

if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend is healthy"
else
    echo "⚠️ Backend health check failed"
fi

# Run database migrations
echo "🗄️ Running database migrations..."
docker-compose exec backend python -c "
from config.database import engine, Base
Base.metadata.create_all(bind=engine)
print('Database tables created successfully')
"

# Initialize default scenarios (admin only)
echo "📚 Initializing training scenarios..."
docker-compose exec backend python -c "
from services.scenario_generator import ScenarioGenerator
from config.database import SessionLocal
db = SessionLocal()
try:
    generator = ScenarioGenerator(db)
    generator.create_default_scenarios()
    print('Default scenarios created successfully')
except Exception as e:
    print(f'Scenarios may already exist: {e}')
finally:
    db.close()
"

echo "🎉 Deployment complete!"
echo ""
echo "🌐 Access your application:"
echo "   Frontend: https://cybersentinel.local"
echo "   Backend API: https://cybersentinel.local/api"
echo "   Admin Dashboard: https://cybersentinel.local/admin"
echo ""
echo "📊 Monitoring:"
echo "   Nginx Logs: docker-compose logs nginx"
echo "   Backend Logs: docker-compose logs backend"
echo "   Frontend Logs: docker-compose logs frontend"
echo ""
echo "🔧 Management:"
echo "   Stop: docker-compose down"
echo "   Restart: docker-compose restart"
echo "   Update: git pull && ./scripts/deploy.sh"