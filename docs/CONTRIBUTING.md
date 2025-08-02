# Contributing to CyberSentinel AI

## 🎯 Overview

We welcome contributions to CyberSentinel AI! This guide will help you understand our development process, coding standards, and how to submit contributions effectively.

## 🚀 Quick Start

### 1. Fork & Clone
```bash
# Fork the repository on GitHub
git clone https://github.com/YOUR_USERNAME/cybersentinel-ai.git
cd cybersentinel-ai
```

### 2. Set Up Development Environment
```bash
# Copy environment template
cp .env.example .env

# Start development environment
docker-compose up -d

# Or set up locally (see DEVELOPER_GUIDE.md)
```

### 3. Create Feature Branch
```bash
git checkout -b feature/your-feature-name
```

## 📋 Contribution Types

### 🐛 Bug Fixes
- Fix existing functionality
- Include regression tests
- Reference issue number in commit

### ✨ New Features
- Add new cybersecurity capabilities
- Include comprehensive tests
- Update documentation

### 📚 Documentation
- Improve existing docs
- Add missing documentation
- Fix typos and clarity issues

### 🔧 Performance Improvements
- Optimize existing code
- Reduce resource usage
- Include benchmarks

## 🎨 Coding Standards

### Python (Backend)
```python
# File: backend/services/example_service.py

from typing import Dict, List, Optional
from sqlalchemy.orm import Session
from models.user import User

class ExampleService:
    """Service for handling example operations."""
    
    def __init__(self, db: Session):
        self.db = db
    
    def process_data(self, data: Dict[str, str]) -> List[str]:
        """Process input data and return results.
        
        Args:
            data: Dictionary containing input data
            
        Returns:
            List of processed results
            
        Raises:
            ValueError: If data is invalid
        """
        if not data:
            raise ValueError("Data cannot be empty")
        
        return [item.strip() for item in data.values()]
```

**Python Requirements:**
- Use type hints for all functions
- Follow PEP 8 style guide
- Use docstrings for classes and functions
- Maximum line length: 88 characters
- Use Black for formatting
- Use isort for import sorting

### TypeScript (Frontend)
```typescript
// File: frontend/src/components/ExampleComponent.tsx

import React from 'react';

interface ExampleProps {
  title: string;
  data: string[];
  onSelect?: (item: string) => void;
}

export const ExampleComponent: React.FC<ExampleProps> = ({
  title,
  data,
  onSelect
}) => {
  const handleClick = (item: string) => {
    onSelect?.(item);
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <ul className="space-y-2">
        {data.map((item, index) => (
          <li
            key={index}
            onClick={() => handleClick(item)}
            className="cursor-pointer hover:bg-gray-100 p-2 rounded"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};
```

**TypeScript Requirements:**
- Use strict TypeScript configuration
- Define interfaces for all props and data structures
- Use functional components with hooks
- Follow React best practices
- Use Tailwind CSS for styling

## 🧪 Testing Requirements

### Backend Tests
```python
# File: backend/tests/test_example_service.py

import pytest
from services.example_service import ExampleService

class TestExampleService:
    def test_process_data_success(self, db_session):
        service = ExampleService(db_session)
        data = {"key1": "value1", "key2": "value2"}
        
        result = service.process_data(data)
        
        assert len(result) == 2
        assert "value1" in result
        assert "value2" in result
    
    def test_process_data_empty_raises_error(self, db_session):
        service = ExampleService(db_session)
        
        with pytest.raises(ValueError, match="Data cannot be empty"):
            service.process_data({})
```

### Frontend Tests
```typescript
// File: frontend/__tests__/ExampleComponent.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { ExampleComponent } from '../src/components/ExampleComponent';

describe('ExampleComponent', () => {
  const mockProps = {
    title: 'Test Title',
    data: ['item1', 'item2'],
    onSelect: jest.fn()
  };

  it('renders title and data items', () => {
    render(<ExampleComponent {...mockProps} />);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('item1')).toBeInTheDocument();
    expect(screen.getByText('item2')).toBeInTheDocument();
  });

  it('calls onSelect when item is clicked', () => {
    render(<ExampleComponent {...mockProps} />);
    
    fireEvent.click(screen.getByText('item1'));
    
    expect(mockProps.onSelect).toHaveBeenCalledWith('item1');
  });
});
```

**Testing Requirements:**
- Minimum 70% code coverage
- Unit tests for all new functions/components
- Integration tests for API endpoints
- E2E tests for critical user flows

## 🔒 Security Guidelines

### Input Validation
```python
# Always sanitize user input
from utils.auth import sanitize_input

def process_user_input(raw_input: str) -> str:
    return sanitize_input(raw_input)
```

### Authentication
```python
# Use dependency injection for protected routes
@router.get("/protected")
def protected_endpoint(current_user: User = Depends(get_current_user)):
    return {"message": f"Hello {current_user.email}"}
```

### SQL Injection Prevention
```python
# Use ORM queries, never raw SQL
users = db.query(User).filter(User.email == email).all()

# Never do this:
# db.execute(f"SELECT * FROM users WHERE email = '{email}'")
```

## 📝 Commit Guidelines

### Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples
```bash
feat(auth): add Argon2 password hashing

Replace bcrypt with Argon2 for improved security.
Includes migration script for existing passwords.

Closes #123

fix(api): handle empty request body in POST /api/users

Add validation to prevent 500 errors when request body is empty.

test(frontend): add tests for login component

Increase test coverage for authentication flows.
```

## 🔄 Pull Request Process

### 1. Pre-submission Checklist
- [ ] Code follows style guidelines
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] Security considerations addressed
- [ ] Performance impact assessed

### 2. Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed

## Security
- [ ] Input validation added
- [ ] Authentication/authorization checked
- [ ] No sensitive data exposed

## Documentation
- [ ] Code comments added
- [ ] API documentation updated
- [ ] User documentation updated
```

### 3. Review Process
1. **Automated Checks**: CI/CD pipeline runs tests
2. **Code Review**: Maintainer reviews code quality
3. **Security Review**: Security implications assessed
4. **Testing**: Functionality verified
5. **Approval**: Changes approved and merged

## 🏗️ Architecture Guidelines

### Backend Structure
```
backend/
├── config/          # Configuration files
├── middleware/      # Custom middleware
├── models/          # Database models
├── routes/          # API route handlers
├── services/        # Business logic
├── utils/           # Utility functions
└── tests/           # Test files
```

### Frontend Structure
```
frontend/src/
├── app/             # Next.js app router pages
├── components/      # Reusable React components
├── hooks/           # Custom React hooks
├── utils/           # Utility functions
└── types/           # TypeScript type definitions
```

### Database Guidelines
- Use SQLAlchemy ORM for all database operations
- Create migrations for schema changes
- Use proper indexing for performance
- Follow normalization principles

### API Design
- Follow RESTful conventions
- Use proper HTTP status codes
- Include comprehensive error handling
- Document all endpoints with OpenAPI

## 🐛 Bug Reports

### Bug Report Template
```markdown
**Bug Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- OS: [e.g., Windows 10]
- Browser: [e.g., Chrome 91]
- Version: [e.g., 1.0.0]

**Additional Context**
Screenshots, logs, etc.
```

## 💡 Feature Requests

### Feature Request Template
```markdown
**Feature Description**
Clear description of the proposed feature

**Use Case**
Why is this feature needed?

**Proposed Solution**
How should this feature work?

**Alternatives Considered**
Other approaches considered

**Additional Context**
Mockups, examples, etc.
```

## 🎯 Development Priorities

### High Priority
- Security vulnerabilities
- Critical bug fixes
- Performance issues
- User experience improvements

### Medium Priority
- New cybersecurity features
- API enhancements
- Documentation improvements
- Code refactoring

### Low Priority
- Nice-to-have features
- Code style improvements
- Minor optimizations

## 📞 Getting Help

### Communication Channels
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Questions and general discussion
- **Email**: security@cybersentinel.ai (security issues only)

### Response Times
- **Security Issues**: 24 hours
- **Bug Reports**: 3-5 business days
- **Feature Requests**: 1-2 weeks
- **Questions**: 1-3 business days

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- Annual contributor appreciation

Thank you for contributing to CyberSentinel AI! 🚀