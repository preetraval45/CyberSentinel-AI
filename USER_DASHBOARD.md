# User Dashboard Implementation

Standard User dashboard with personal data access and restricted permissions.

## Backend API Endpoints

### User API (`/routes/user_api.py`)
- **GET /api/user/dashboard** - Personal stats and metrics
- **GET /api/user/simulations** - Assigned simulations only
- **GET /api/user/reports** - Personal session reports only
- **POST /api/user/simulations/{id}/start** - Start assigned simulation
- **POST /api/user/simulations/{id}/replay** - Replay completed simulation

### Security Features
- **User Role Required** - All endpoints protected by `user_required` middleware
- **Personal Data Only** - Users can only access their own data
- **No Admin Access** - Prevents access to admin routes and sensitive data
- **Session Validation** - Ensures users can only start/replay their assigned simulations

## Frontend Components

### UserStats (`/components/user/UserStats.tsx`)
- **Personal Metrics** - Risk score, completion rate, average score
- **Visual Indicators** - Color-coded risk levels and progress bars
- **Responsive Cards** - Grid layout adapting to screen size
- **Animated Counters** - Smooth number animations on load

### SimulationsList (`/components/user/SimulationsList.tsx`)
- **Assigned Simulations** - Only shows user's assigned training
- **Status Tracking** - Pending, in-progress, completed states
- **Progress Bars** - Visual completion percentage
- **Action Buttons** - Start new or replay completed simulations
- **Due Date Alerts** - Highlights approaching deadlines

### ReportsSection (`/components/user/ReportsSection.tsx`)
- **Session History** - Personal training session reports
- **Performance Metrics** - Score, time taken, attempts
- **Detailed View** - Expandable report details
- **Empty State** - Helpful message when no reports exist

## Dashboard Features

### Personal Statistics
- **Risk Score** - Personal security risk assessment (0-100)
- **Completion Rate** - Percentage of assigned training completed
- **Simulation Progress** - Completed vs total assigned simulations
- **Average Score** - Performance across all completed sessions

### Training Management
- **Assigned Simulations** - View only personally assigned training
- **Start Training** - Begin new or continue in-progress simulations
- **Replay Completed** - Review and practice completed training
- **Progress Tracking** - Visual progress bars and completion status

### Session Reports
- **Personal History** - Only user's own session data
- **Performance Metrics** - Detailed scoring and timing data
- **Attempt Tracking** - Number of attempts per simulation
- **Date Filtering** - Chronological session history

## Access Control

### Role-Based Restrictions
```python
# Backend protection
@router.get("/dashboard")
def get_user_dashboard(current_user: User = Depends(user_required)):
    # User role required, no admin access
```

### Data Isolation
```python
# User-specific queries only
def get_user_simulations(current_user: User):
    return db.query(Simulation).filter(
        Simulation.assigned_user_id == current_user.id
    ).all()
```

### Frontend Guards
```typescript
// Role guard prevents admin access
<RoleGuard requiredRole="User">
  <UserDashboard />
</RoleGuard>
```

## API Integration

### Fetch Personal Data
```typescript
const [statsRes, simulationsRes, reportsRes] = await Promise.all([
  fetch('/api/user/dashboard', { credentials: 'include' }),
  fetch('/api/user/simulations', { credentials: 'include' }),
  fetch('/api/user/reports', { credentials: 'include' })
])
```

### Start Simulation
```typescript
const response = await fetch(`/api/user/simulations/${id}/start`, {
  method: 'POST',
  credentials: 'include'
})
```

### Replay Training
```typescript
const response = await fetch(`/api/user/simulations/${id}/replay`, {
  method: 'POST',
  credentials: 'include'
})
```

## Security Implementation

### Personal Data Only
- Users can only view their own simulations and reports
- No access to other users' data or system-wide information
- API endpoints filter data by current user ID

### Admin Route Prevention
- Middleware blocks access to admin endpoints
- Frontend role guards prevent admin component rendering
- Navigation restrictions hide admin menu items

### Session Security
- All API calls require valid authentication
- User context maintained throughout session
- Automatic logout on role changes

## UI/UX Features

### Responsive Design
- **Mobile Optimized** - Touch-friendly interface
- **Grid Layouts** - Adaptive card arrangements
- **Accessible** - Keyboard navigation and screen reader support

### Visual Feedback
- **Loading States** - Skeleton loading during data fetch
- **Progress Indicators** - Animated progress bars
- **Status Icons** - Clear visual status indicators
- **Color Coding** - Risk levels and performance metrics

### Interactive Elements
- **Hover Effects** - Card and button animations
- **Click Feedback** - Button press animations
- **Smooth Transitions** - Page and component transitions
- **Error Handling** - User-friendly error messages

## Performance Features

### Data Management
- **Efficient Queries** - User-specific database queries
- **Caching** - Client-side data caching
- **Lazy Loading** - Components load on demand
- **Optimistic Updates** - Immediate UI feedback

### Frontend Optimization
- **Code Splitting** - Separate user components
- **Memoization** - Prevent unnecessary re-renders
- **Efficient State** - Minimal state management
- **Bundle Size** - Optimized component imports

The User dashboard provides a focused, secure interface for personal training management with comprehensive progress tracking and restricted access to ensure data privacy and security.