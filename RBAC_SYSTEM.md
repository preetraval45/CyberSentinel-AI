# Role-Based Access Control (RBAC) System

Enhanced authentication system with three user roles: SuperAdmin, User, and LimitedUser.

## User Roles

### SuperAdmin
- Full system access
- Can manage all users and assign roles
- Access to admin dashboard and system settings

### User  
- Standard user access
- Can access user panel and advanced features
- Cannot manage other users

### LimitedUser
- Basic access only
- Limited functionality
- Read-only access to basic features

## Backend Implementation

### Role Decorators
```python
from middleware.rbac import superadmin_required, user_required, limited_user_required

@router.get("/admin-only")
def admin_endpoint(current_user: User = Depends(superadmin_required)):
    return {"message": "SuperAdmin access"}

@router.get("/user-access") 
def user_endpoint(current_user: User = Depends(user_required)):
    return {"message": "User access"}

@router.get("/basic-access")
def limited_endpoint(current_user: User = Depends(limited_user_required)):
    return {"message": "Limited access"}
```

### Role Assignment
```python
# POST /api/auth/assign-role (SuperAdmin only)
{
  "user_id": "uuid",
  "role": "User"
}
```

## Frontend Implementation

### Role Guard Component
```typescript
<RoleGuard requiredRole="SuperAdmin">
  <AdminPanel />
</RoleGuard>
```

### Role Checking
```typescript
const { hasRole, isRole } = useAuth()

// Check if user has minimum role level
if (hasRole('User')) {
  // User or SuperAdmin can access
}

// Check exact role
if (isRole('SuperAdmin')) {
  // Only SuperAdmin can access
}
```

## Protected Pages

- `/admin` - SuperAdmin only
- `/user-panel` - User and above
- `/limited-access` - All authenticated users
- `/dashboard` - Role-based content sections

## Role Hierarchy

SuperAdmin > User > LimitedUser

Higher roles inherit permissions from lower roles.

## API Endpoints

### Authentication
- `POST /api/auth/assign-role` - Assign role (SuperAdmin only)

### Protected Examples
- `GET /api/protected/superadmin-only` - SuperAdmin access
- `GET /api/protected/user-access` - User+ access  
- `GET /api/protected/limited-access` - All users

## Database Migration

Run migration to update existing users:
```bash
cd backend
alembic upgrade head
```

## Testing Roles

1. Register users with different roles
2. Test access to protected endpoints
3. Verify role-based UI components
4. Test role assignment functionality