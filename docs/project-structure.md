# Project Structure

```
CyberSentinel-AI/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   └── app/             # App router pages
│   ├── components/          # React components
│   ├── public/             # Static assets
│   ├── styles/             # CSS styles
│   └── Dockerfile
├── backend/                 # FastAPI backend application
│   ├── app/                # Main application
│   ├── routes/             # API routes
│   ├── models/             # Database models
│   ├── services/           # Business logic
│   └── Dockerfile
├── database/               # PostgreSQL configuration
│   ├── init/               # Database initialization
│   └── Dockerfile
├── ai_controller/          # AI agent controller
│   └── controller.py       # Memory management
├── docker/                 # Docker configurations
│   └── nginx.conf          # Nginx configuration
├── tests/                  # Test files
├── docs/                   # Documentation
├── data/                   # AI memory storage
└── docker-compose.yml      # Container orchestration
```

## Key Components

- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Backend**: FastAPI with PostgreSQL and Redis
- **Database**: Custom PostgreSQL Docker image
- **AI Controller**: JSON-based persistent memory
- **Infrastructure**: Docker Compose with Nginx reverse proxy