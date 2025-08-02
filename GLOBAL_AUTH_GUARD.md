# Global Authentication Guard

Implemented global authentication and role-based access control using Next.js middleware.

## Implementation

### Middleware (`middleware.ts`)
- Runs on every request before page rendering
- Checks authentication status via JWT cookie
- Validates user role against route requirements
- Redirects unauthenticated users to `/login`
- Redirects unauthorized users to `/unauthorized`

### Route Protection Rules

**Public Routes** (no auth required):
- `/login`
- `/register`

**Role-Based Routes**:
- `/admin` → SuperAdmin only
- `/user-panel` → User and above
- `/limited-access` → All authenticated users
- All other routes → Authenticated users only

### Role Hierarchy
```
SuperAdmin (level 3) → Full access
User (level 2) → User + LimitedUser routes
LimitedUser (level 1) → LimitedUser routes only
```

## Key Features

**Automatic Redirects**:
- Unauthenticated → `/login`
- Insufficient role → `/unauthorized`
- Authenticated on public routes → `/dashboard`

**JWT Validation**:
- Decodes JWT payload to extract role
- Validates token structure and expiration
- Handles malformed tokens gracefully

**Seamless UX**:
- No flash of protected content
- Loading states during auth checks
- Proper error handling

## Files Modified

- `middleware.ts` - Global auth guard
- `app/unauthorized/page.tsx` - Access denied page
- `app/page.tsx` - Root redirect logic
- `app/login/page.tsx` - Redirect if authenticated
- `app/register/page.tsx` - Redirect if authenticated
- Removed `ProtectedRoute` wrappers (handled by middleware)

## Usage

The middleware automatically protects all routes. No additional setup required for new pages - just add route patterns to `roleRoutes` object in middleware for role-specific access.

## Testing

1. Visit any protected route without login → redirects to `/login`
2. Login with different roles and test access to role-specific routes
3. Try accessing higher-privilege routes with lower-role users → redirects to `/unauthorized`
4. Verify authenticated users can't access `/login` or `/register`