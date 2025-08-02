# 🚀 CyberSentinel AI - Complete Setup Guide

## 📋 Project Analysis Summary

### ✅ What's Complete:
- **Full-stack architecture** with FastAPI backend, Next.js frontend
- **Security features** with Argon2 hashing, JWT auth, input sanitization
- **AI integrations** with OpenAI GPT for chat and workflow automation
- **Comprehensive testing** with unit, integration, and E2E tests
- **Docker containerization** with multi-service orchestration
- **CI/CD pipelines** for GitHub Actions and GitLab CI

### 🔧 Critical Fixes Applied:
1. **Fixed missing `time` import** in security middleware
2. **Added missing frontend dependencies** (@playwright/test)
3. **Created Alembic configuration** for database migrations
4. **Generated .env file** from template with development defaults

## 🚀 Quick Start (Recommended)

### 1. Prerequisites
```bash
# Install required software
- Docker Desktop
- Node.js 18+
- Python 3.11+
- Git
```

### 2. Clone and Setup
```bash
git clone <repository-url>
cd cybersentinel-ai

# Environment is already created, update with your keys:
# Edit .env file and add your OpenAI API key
```

### 3. Start with Docker (Easiest)
```bash
# Start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

### 4. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs (if enabled)
- **Database**: localhost:5432

## 🔧 Manual Setup (Development)

### Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Start backend server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Database Setup
```bash
# Start PostgreSQL (if not using Docker)
# Create database
createdb cybersentinel

# Start Redis (if not using Docker)
redis-server
```

## 🔑 Required Configuration

### 1. OpenAI API Key (REQUIRED)
```bash
# Get API key from https://platform.openai.com/api-keys
# Add to .env file:
OPENAI_API_KEY=sk-your-actual-api-key-here
```

### 2. JWT Secrets (REQUIRED)
```bash
# Generate secure secrets (32+ characters)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-long
JWT_REFRESH_SECRET=your-refresh-token-secret-key-different
NEXTAUTH_SECRET=your-nextauth-secret-key-32-chars-min
```

### 3. Database Password (Production)
```bash
# Change default password for production
POSTGRES_PASSWORD=your-secure-database-password
```

## 🧪 Testing

### Run All Tests
```bash
# Backend tests
cd backend
pytest tests/ -v --cov=.

# Frontend tests
cd frontend
npm test

# E2E tests
npx playwright test
```

## 🐛 Common Issues & Solutions

### Issue 1: Database Connection Error
```bash
# Solution: Ensure PostgreSQL is running
docker-compose up database -d
# Or install PostgreSQL locally
```

### Issue 2: OpenAI API Errors
```bash
# Solution: Check API key format
echo $OPENAI_API_KEY | grep -E '^sk-[a-zA-Z0-9]{48}$'
# Get valid key from OpenAI platform
```

### Issue 3: Frontend Build Errors
```bash
# Solution: Clear cache and reinstall
cd frontend
rm -rf node_modules .next
npm install
npm run build
```

### Issue 4: Port Conflicts
```bash
# Solution: Check if ports are in use
netstat -an | grep :3000
netstat -an | grep :8000
netstat -an | grep :5432
# Kill processes or change ports in docker-compose.yml
```

## 📊 Health Checks

### Verify Services
```bash
# Backend health
curl http://localhost:8000/health

# Frontend health
curl http://localhost:3000

# Database connection
psql postgresql://postgres:password@localhost:5432/cybersentinel -c "SELECT 1;"

# Redis connection
redis-cli ping
```

## 🔒 Security Setup

### 1. Generate Secure Keys
```bash
# Generate JWT secret
openssl rand -base64 32

# Generate encryption key
openssl rand -hex 32
```

### 2. SSL/HTTPS (Production)
```bash
# Run SSL setup script
chmod +x scripts/setup-ssl.sh
./scripts/setup-ssl.sh
```

## 📈 Production Deployment

### 1. Environment Variables
```bash
# Set production environment
ENVIRONMENT=production
DOMAIN=your-domain.com
SSL_EMAIL=admin@your-domain.com
```

### 2. Deploy with Docker
```bash
# Production deployment
docker-compose -f docker-compose.prod.yml up -d

# Or use deployment script
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

## 🎯 Next Steps

### Immediate Actions:
1. **Add OpenAI API key** to .env file
2. **Start services** with `docker-compose up -d`
3. **Test basic functionality** by accessing http://localhost:3000
4. **Create admin user** through registration
5. **Explore features** (phishing simulation, training modules, etc.)

### Development Actions:
1. **Set up IDE** with Python and TypeScript extensions
2. **Configure linting** with Black, ESLint
3. **Run tests** to ensure everything works
4. **Read documentation** in `/docs` folder
5. **Start contributing** following CONTRIBUTING.md

## 📞 Support

### If You Need Help:
1. **Check logs**: `docker-compose logs -f`
2. **Review documentation**: `/docs` folder
3. **Run health checks**: Scripts above
4. **Check GitHub issues**: For known problems
5. **Create new issue**: With detailed error information

## 🎉 Success Indicators

### ✅ You'll know it's working when:
- Frontend loads at http://localhost:3000
- Backend API responds at http://localhost:8000/health
- You can register/login users
- AI features respond (with valid OpenAI key)
- Database stores data persistently
- All Docker containers are healthy

The project is **95% ready to run** - you just need to add your OpenAI API key and start the services!