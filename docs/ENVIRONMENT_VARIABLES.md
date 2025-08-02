# Environment Variables Reference

## 📋 Overview

This document provides a comprehensive reference for all environment variables used in CyberSentinel AI. Variables are organized by category and include descriptions, default values, and usage examples.

## 🔧 Configuration Files

### Development
- `.env` - Local development environment
- `.env.example` - Template with all variables

### Production
- Environment variables set via Docker Compose
- Kubernetes ConfigMaps/Secrets
- Cloud provider environment configuration

## 🗄️ Database Configuration

### PostgreSQL Settings
```bash
# Database connection URL
DATABASE_URL=postgresql://username:password@host:port/database
# Example: postgresql://postgres:password@localhost:5432/cybersentinel

# Individual components (alternative to DATABASE_URL)
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=cybersentinel
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-secure-password

# Connection pool settings
DB_POOL_SIZE=20
DB_MAX_OVERFLOW=30
DB_POOL_TIMEOUT=30
DB_POOL_RECYCLE=3600
```

### Redis Configuration
```bash
# Redis connection URL
REDIS_URL=redis://host:port/db
# Example: redis://localhost:6379/0

# Individual components
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0
REDIS_PASSWORD=optional-password

# Redis settings
REDIS_MAX_CONNECTIONS=50
REDIS_SOCKET_TIMEOUT=5
REDIS_SOCKET_CONNECT_TIMEOUT=5
```

## 🔐 Security Configuration

### JWT Authentication
```bash
# JWT secret keys (REQUIRED)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-token-secret-key

# Token expiration times
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=15
JWT_REFRESH_TOKEN_EXPIRE_DAYS=7

# Algorithm
JWT_ALGORITHM=HS256
```

### Password Security
```bash
# Argon2 configuration
ARGON2_TIME_COST=3
ARGON2_MEMORY_COST=65536
ARGON2_PARALLELISM=4
ARGON2_HASH_LENGTH=32
ARGON2_SALT_LENGTH=16
```

### Encryption
```bash
# General encryption key
ENCRYPTION_KEY=your-32-byte-encryption-key-here

# API keys encryption
API_KEYS_ENCRYPTION_KEY=separate-key-for-api-keys
```

## 🤖 AI Configuration

### OpenAI Integration
```bash
# OpenAI API key (REQUIRED for AI features)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Model configuration
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_MAX_TOKENS=150
OPENAI_TEMPERATURE=0.7

# Rate limiting
OPENAI_REQUESTS_PER_MINUTE=60
OPENAI_TOKENS_PER_MINUTE=40000
```

### AI Memory Storage
```bash
# AI agent memory configuration
AI_MEMORY_PATH=./data/ai_memory
AI_MEMORY_MAX_SIZE_MB=100
AI_MEMORY_BACKUP_INTERVAL_HOURS=24
```

## 🌐 Application Configuration

### Backend (FastAPI)
```bash
# Application environment
ENVIRONMENT=development  # development, staging, production

# Server configuration
API_HOST=0.0.0.0
API_PORT=8000
API_WORKERS=4

# Debug settings
DEBUG=false
LOG_LEVEL=INFO  # DEBUG, INFO, WARNING, ERROR, CRITICAL

# CORS settings
CORS_ORIGINS=https://cybersentinel.local,https://cybersentinel.ai
CORS_ALLOW_CREDENTIALS=true
```

### Frontend (Next.js)
```bash
# Next.js configuration
NODE_ENV=production  # development, production
NEXT_PUBLIC_API_URL=https://cybersentinel.ai

# Authentication
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=https://cybersentinel.ai

# Feature flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_DEBUG=false
```

## 🔒 SSL/TLS Configuration

### Certificate Settings
```bash
# Domain configuration
DOMAIN=cybersentinel.ai
SSL_EMAIL=admin@cybersentinel.ai

# Let's Encrypt settings
LETSENCRYPT_STAGING=false
LETSENCRYPT_RSA_KEY_SIZE=4096

# SSL paths (for custom certificates)
SSL_CERT_PATH=/etc/ssl/certs/cert.pem
SSL_KEY_PATH=/etc/ssl/private/key.pem
```

## 📧 Email Configuration

### SMTP Settings
```bash
# Email server configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_TLS=true

# Email settings
FROM_EMAIL=noreply@cybersentinel.ai
FROM_NAME=CyberSentinel AI
```

## 📊 Monitoring & Logging

### Application Monitoring
```bash
# Logging configuration
LOG_FORMAT=json  # json, text
LOG_FILE_PATH=./logs/app.log
LOG_MAX_SIZE_MB=100
LOG_BACKUP_COUNT=5

# Metrics
ENABLE_METRICS=true
METRICS_PORT=9090
```

### External Services
```bash
# Sentry error tracking
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
SENTRY_ENVIRONMENT=production

# Analytics
GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
```

## 🐳 Docker Configuration

### Container Settings
```bash
# Docker Compose environment
COMPOSE_PROJECT_NAME=cybersentinel-ai
COMPOSE_FILE=docker-compose.yml

# Image registry
REGISTRY=ghcr.io
IMAGE_NAME=cybersentinel-ai
IMAGE_TAG=latest

# Resource limits
BACKEND_MEMORY_LIMIT=1g
FRONTEND_MEMORY_LIMIT=512m
DATABASE_MEMORY_LIMIT=2g
```

## 🔧 Development Settings

### Development Only
```bash
# Development tools
ENABLE_DEBUG_TOOLBAR=true
ENABLE_PROFILER=true
RELOAD_ON_CHANGE=true

# Testing
TEST_DATABASE_URL=sqlite:///./test.db
PYTEST_WORKERS=auto

# Frontend development
NEXT_TELEMETRY_DISABLED=1
FAST_REFRESH=true
```

## 🚀 Production Settings

### Performance
```bash
# Production optimizations
ENABLE_GZIP=true
ENABLE_CACHING=true
CACHE_TTL_SECONDS=3600

# Security
SECURE_COOKIES=true
SECURE_HEADERS=true
RATE_LIMIT_ENABLED=true
```

### Scaling
```bash
# Horizontal scaling
REPLICA_COUNT=3
LOAD_BALANCER_ENABLED=true

# Database scaling
DB_READ_REPLICAS=2
DB_CONNECTION_POOL_SIZE=50
```

## 📋 Environment Templates

### Development (.env.development)
```bash
ENVIRONMENT=development
DEBUG=true
DATABASE_URL=postgresql://postgres:password@localhost:5432/cybersentinel_dev
REDIS_URL=redis://localhost:6379/0
JWT_SECRET=dev-secret-key-not-for-production
OPENAI_API_KEY=your-dev-openai-key
NEXT_PUBLIC_API_URL=http://localhost:8000
LOG_LEVEL=DEBUG
```

### Production (.env.production)
```bash
ENVIRONMENT=production
DEBUG=false
DATABASE_URL=postgresql://user:pass@db-host:5432/cybersentinel
REDIS_URL=redis://redis-host:6379/0
JWT_SECRET=super-secure-production-jwt-secret
OPENAI_API_KEY=your-production-openai-key
NEXT_PUBLIC_API_URL=https://api.cybersentinel.ai
LOG_LEVEL=INFO
DOMAIN=cybersentinel.ai
SSL_EMAIL=admin@cybersentinel.ai
```

## ✅ Validation & Best Practices

### Required Variables
These variables MUST be set for the application to function:
- `DATABASE_URL` or individual `POSTGRES_*` variables
- `JWT_SECRET`
- `OPENAI_API_KEY` (for AI features)
- `NEXTAUTH_SECRET`

### Security Best Practices
1. **Never commit secrets to version control**
2. **Use strong, unique secrets for each environment**
3. **Rotate secrets regularly**
4. **Use environment-specific configurations**
5. **Validate all environment variables on startup**

### Variable Naming Conventions
- Use `SCREAMING_SNAKE_CASE`
- Prefix with service name when ambiguous
- Use descriptive names
- Include units in names (e.g., `TIMEOUT_SECONDS`)

## 🔍 Troubleshooting

### Common Issues

#### Database Connection Errors
```bash
# Check DATABASE_URL format
DATABASE_URL=postgresql://username:password@host:port/database

# Verify credentials and network access
psql $DATABASE_URL
```

#### JWT Token Issues
```bash
# Ensure JWT_SECRET is at least 32 characters
echo $JWT_SECRET | wc -c

# Check token expiration settings
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=15
```

#### OpenAI API Errors
```bash
# Verify API key format
echo $OPENAI_API_KEY | grep -E '^sk-[a-zA-Z0-9]{48}$'

# Test API connectivity
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
     https://api.openai.com/v1/models
```

### Environment Validation Script
```bash
#!/bin/bash
# scripts/validate-env.sh

required_vars=(
    "DATABASE_URL"
    "JWT_SECRET"
    "OPENAI_API_KEY"
    "NEXTAUTH_SECRET"
)

for var in "${required_vars[@]}"; do
    if [[ -z "${!var}" ]]; then
        echo "ERROR: $var is not set"
        exit 1
    fi
done

echo "All required environment variables are set"
```

## 📞 Support

For environment configuration issues:
1. Check this documentation
2. Validate variable format and values
3. Review application logs
4. Create GitHub issue with environment details (without secrets)