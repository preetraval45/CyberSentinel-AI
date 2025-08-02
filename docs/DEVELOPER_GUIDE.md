# CyberSentinel AI - Developer Guide

## 🏗️ Architecture Overview

### System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js       │    │   FastAPI       │    │   PostgreSQL    │
│   Frontend      │◄──►│   Backend       │◄──►│   Database      │
│   (Port 3000)   │    │   (Port 8000)   │    │   (Port 5432)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         │              │     Redis       │              │
         └──────────────►│     Cache       │◄─────────────┘
                        │   (Port 6379)   │
                        └─────────────────┘
                                 │
                        ┌─────────────────┐
                        │     Nginx       │
                        │  Reverse Proxy  │
                        │  (Ports 80/443) │
                        └─────────────────┘
```

### Technology Stack

#### Frontend (Next.js 14)
- **Framework**: Next.js with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **State Management**: React hooks + Context API
- **Testing**: Jest + React Testing Library

#### Backend (FastAPI)
- **Framework**: FastAPI (Python 3.11+)
- **Database ORM**: SQLAlchemy 2.0
- **Authentication**: JWT with Argon2 password hashing
- **Caching**: Redis
- **AI Integration**: OpenAI GPT-3.5/4
- **Testing**: Pytest + TestClient

#### Database & Infrastructure
- **Primary DB**: PostgreSQL 15
- **Cache**: Redis 7
- **Reverse Proxy**: Nginx with SSL/TLS
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions / GitLab CI

## 🚀 Getting Started

### Prerequisites
- **Docker** & **Docker Compose**
- **Node.js** 18+ (for local development)
- **Python** 3.11+ (for local development)
- **Git**

### Environment Setup

1. **Clone Repository**
```bash
git clone https://github.com/your-org/cybersentinel-ai.git
cd cybersentinel-ai
```

2. **Environment Variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Docker Development**
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

4. **Local Development**
```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

## 📁 Project Structure

```
cybersentinel-ai/
├── backend/                 # FastAPI backend
│   ├── config/             # Database & app configuration
│   ├── middleware/         # Security & auth middleware
│   ├── models/            # SQLAlchemy models
│   ├── routes/            # API route handlers
│   ├── services/          # Business logic services
│   ├── utils/             # Utility functions
│   ├── tests/             # Backend tests
│   └── main.py            # FastAPI app entry point
├── frontend/               # Next.js frontend
│   ├── src/app/           # App router pages
│   ├── src/components/    # React components
│   ├── utils/             # Frontend utilities
│   ├── __tests__/         # Frontend tests
│   └── package.json       # Node.js dependencies
├── database/              # Database initialization
│   ├── init/              # SQL initialization scripts
│   └── Dockerfile         # Database container
├── docker/                # Docker configurations
│   └── nginx/             # Nginx reverse proxy
├── docs/                  # Documentation
├── e2e/                   # End-to-end tests
├── scripts/               # Deployment & utility scripts
├── .github/workflows/     # GitHub Actions CI/CD
├── docker-compose.yml     # Development environment
└── docker-compose.prod.yml # Production environment
```

## 🔧 Development Workflow

### Code Standards

#### Python (Backend)
```python
# Use Black for formatting
black .

# Use isort for imports
isort .

# Use flake8 for linting
flake8 .

# Type hints required
def process_data(data: Dict[str, Any]) -> List[str]:
    return []
```

#### TypeScript (Frontend)
```typescript
// Use ESLint + Prettier
npm run lint
npm run format

// Strict typing required
interface UserData {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

const processUser = (user: UserData): string => {
  return user.email;
};
```

### Git Workflow
```bash
# Feature development
git checkout -b feature/new-feature
git commit -m "feat: add new security feature"
git push origin feature/new-feature

# Create pull request
# After review and approval, merge to main
```

### Testing Requirements
- **Unit Tests**: 70% minimum coverage
- **Integration Tests**: All API endpoints
- **E2E Tests**: Critical user flows
- **Security Tests**: Input validation, auth flows

```bash
# Backend testing
cd backend
pytest tests/ -v --cov=.

# Frontend testing
cd frontend
npm test -- --coverage

# E2E testing
npx playwright test
```

## 🔐 Security Guidelines

### Authentication & Authorization
```python
# Always use dependency injection for auth
@router.get("/protected")
def protected_route(current_user: User = Depends(get_current_user)):
    return {"user": current_user.email}

# Admin-only routes
@router.get("/admin-only")
def admin_route(admin_user: User = Depends(require_admin)):
    return {"message": "Admin access granted"}
```

### Input Validation
```python
# Backend validation
from utils.auth import sanitize_input

@router.post("/data")
def process_data(data: str):
    clean_data = sanitize_input(data)
    # Process clean_data
```

```typescript
// Frontend validation
import { sanitizeInput, validateEmail } from '@/utils/security';

const handleSubmit = (email: string) => {
  const cleanEmail = sanitizeInput(email);
  if (!validateEmail(cleanEmail)) {
    throw new Error('Invalid email');
  }
};
```

### Database Security
```python
# Always use ORM, never raw SQL
users = db.query(User).filter(User.email == email).first()

# Never do this:
# db.execute(f"SELECT * FROM users WHERE email = '{email}'")
```

## 🐛 Debugging Tips

### Backend Debugging
```python
# Enable debug logging
import logging
logging.basicConfig(level=logging.DEBUG)

# Use debugger
import pdb; pdb.set_trace()

# FastAPI debug mode
uvicorn main:app --reload --log-level debug
```

### Frontend Debugging
```typescript
// React DevTools
console.log('Debug data:', data);

// Network debugging
fetch('/api/endpoint')
  .then(response => {
    console.log('Response:', response);
    return response.json();
  })
  .catch(error => console.error('Error:', error));
```

### Docker Debugging
```bash
# View container logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Execute commands in container
docker-compose exec backend bash
docker-compose exec frontend sh

# Debug database
docker-compose exec database psql -U postgres -d cybersentinel
```

## 📊 Performance Guidelines

### Backend Optimization
```python
# Use async/await for I/O operations
@router.get("/async-endpoint")
async def async_endpoint():
    result = await some_async_operation()
    return result

# Database query optimization
users = db.query(User).options(
    selectinload(User.roles)
).filter(User.is_active == True).all()

# Caching with Redis
@lru_cache(maxsize=100)
def expensive_computation(data: str) -> str:
    # Expensive operation
    return result
```

### Frontend Optimization
```typescript
// Use React.memo for expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{data}</div>;
});

// Lazy loading
const LazyComponent = lazy(() => import('./LazyComponent'));

// Optimize images
import Image from 'next/image';
<Image src="/image.jpg" alt="Description" width={500} height={300} />
```

## 🚀 Deployment

### Environment Variables
```bash
# Required for all environments
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_URL=redis://host:6379
JWT_SECRET=your-secret-key
OPENAI_API_KEY=your-openai-key

# Production only
ENVIRONMENT=production
DOMAIN=cybersentinel.ai
SSL_EMAIL=admin@cybersentinel.ai
```

### Production Deployment
```bash
# Build and deploy
docker-compose -f docker-compose.prod.yml up -d

# Health checks
curl -f https://cybersentinel.ai/health
curl -f https://cybersentinel.ai/api/health

# Monitor logs
docker-compose -f docker-compose.prod.yml logs -f
```

## 🤝 Contributing

### Pull Request Process
1. Fork the repository
2. Create feature branch
3. Write tests for new functionality
4. Ensure all tests pass
5. Update documentation
6. Submit pull request

### Code Review Checklist
- [ ] Tests written and passing
- [ ] Security considerations addressed
- [ ] Performance impact assessed
- [ ] Documentation updated
- [ ] Breaking changes documented

## 📞 Support

### Getting Help
- **Documentation**: Check `/docs` directory
- **Issues**: GitHub Issues for bugs
- **Discussions**: GitHub Discussions for questions
- **Security**: security@cybersentinel.ai

### Common Issues
- **Port conflicts**: Check if ports 3000, 8000, 5432, 6379 are available
- **Permission errors**: Ensure Docker has proper permissions
- **Database connection**: Verify DATABASE_URL format
- **API key errors**: Check OPENAI_API_KEY is set correctly