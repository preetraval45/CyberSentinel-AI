# CyberSentinel AI Authentication System

A secure authentication system built with FastAPI backend and Next.js frontend, featuring Argon2 password hashing and HTTP-only JWT cookies.

## Features

- **Secure Password Hashing**: Uses Argon2 algorithm for password hashing
- **HTTP-only JWT Cookies**: Tokens stored in secure, HTTP-only cookies
- **Protected Routes**: Automatic redirection for unauthenticated users
- **Real-time Auth Status**: Checks authentication status on page load
- **Form Validation**: Client-side and server-side validation

## Security Features

- Argon2 password hashing (more secure than bcrypt)
- HTTP-only cookies prevent XSS attacks
- Secure cookie settings (SameSite=strict, Secure=true)
- Password strength validation
- Input sanitization
- CORS protection

## Quick Start

1. **Run Setup Script**:
   ```bash
   setup-auth.bat
   ```

2. **Start Backend**:
   ```bash
   cd backend
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

3. **Start Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

4. **Access Application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/status` - Check authentication status
- `GET /api/auth/me` - Get current user info

## Frontend Components

### AuthContext
- Manages global authentication state
- Provides login, register, logout functions
- Handles authentication status checks

### ProtectedRoute
- Wraps protected pages/components
- Redirects unauthenticated users to login
- Shows loading spinner during auth check

## Usage Examples

### Login
```typescript
const { login } = useAuth()
const success = await login(email, password)
if (success) {
  router.push('/dashboard')
}
```

### Register
```typescript
const { register } = useAuth()
const success = await register(email, password)
if (success) {
  router.push('/dashboard')
}
```

### Protect Routes
```typescript
import ProtectedRoute from '@/components/auth/ProtectedRoute'

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div>Protected content</div>
    </ProtectedRoute>
  )
}
```

## Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

## Environment Variables

Create `.env` file in backend directory:
```env
JWT_SECRET=your-secret-key-here
DATABASE_URL=postgresql://username:password@localhost:5432/cybersentinel
```

## Security Considerations

- JWT tokens expire after 15 minutes
- Cookies are HTTP-only and secure
- CORS is configured for specific origins
- Input sanitization prevents injection attacks
- Rate limiting prevents brute force attacks

## Testing

Test the authentication system:

1. **Register**: Go to `/register` and create an account
2. **Login**: Go to `/login` and sign in
3. **Protected Route**: Try accessing `/dashboard` without login
4. **Logout**: Use logout functionality
5. **Status Check**: Refresh page to verify persistent login

The system automatically handles token validation and redirects unauthenticated users to the login page.