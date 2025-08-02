# LimitedUser Dashboard Implementation

Minimal dashboard for LimitedUser role with restricted functionality and read-only access.

## Backend API Endpoints

### Limited User API (`/routes/limited_user_api.py`)
- **GET /api/limited/profile** - Basic profile information (read-only)
- **GET /api/limited/completed-simulations** - Completed training only (no active/pending)

### Security Features
- **LimitedUser Role Required** - Endpoints protected by `limited_user_required` middleware
- **Read-Only Access** - No POST/PUT/DELETE operations allowed
- **Minimal Data** - Only essential information provided
- **No Edit Capabilities** - Profile and simulation data cannot be modified

## Frontend Components

### LimitedProfile (`/components/limited/LimitedProfile.tsx`)
- **Basic Information** - Email, role, member since date
- **Risk Score Display** - Personal risk score with color-coded progress bar
- **Read-Only Fields** - No edit buttons or form inputs
- **Minimal Design** - Simple, clean interface

### CompletedSimulations (`/components/limited/CompletedSimulations.tsx`)
- **Completed Only** - Shows only finished training simulations
- **Basic Metrics** - Completion date and score only
- **No Actions** - No replay, start, or edit functionality
- **Empty State** - Helpful message when no completed training exists

## Dashboard Features

### Personal Profile
- **Email Address** - User's registered email (read-only)
- **Role Display** - Shows "LimitedUser" role
- **Member Since** - Account creation date
- **Risk Score** - Personal security risk assessment with visual indicator

### Training History
- **Completed Simulations** - List of finished training only
- **Completion Dates** - When each training was completed
- **Scores** - Performance scores with color coding
- **No Interaction** - Cannot replay or modify simulations

### Restrictions Implemented
- **No Profile Editing** - Cannot modify personal information
- **No Simulation Control** - Cannot start, replay, or modify training
- **No Other Users' Data** - Cannot view any other user information
- **No Admin Access** - Completely blocked from admin functionality

## Access Control

### Role-Based Restrictions
```python
# Backend protection - most restrictive
@router.get("/profile")
def get_limited_profile(current_user: User = Depends(limited_user_required)):
    # Only basic profile data, no edit capabilities
```

### Data Limitations
```python
# Only completed simulations, no active/pending
def get_completed_simulations(current_user: User):
    return db.query(Simulation).filter(
        Simulation.user_id == current_user.id,
        Simulation.status == "completed"
    ).all()
```

### Frontend Guards
```typescript
// Strictest role guard
<RoleGuard requiredRole="LimitedUser">
  <LimitedDashboard />
</RoleGuard>
```

## API Integration

### Fetch Limited Data
```typescript
const [profileRes, simulationsRes] = await Promise.all([
  fetch('/api/limited/profile', { credentials: 'include' }),
  fetch('/api/limited/completed-simulations', { credentials: 'include' })
])
```

### No Modification APIs
- No POST/PUT/DELETE endpoints available
- No form submissions or data updates
- Purely read-only interface

## Security Implementation

### Minimal Data Exposure
- Only essential profile information shown
- No sensitive system data or other users' information
- Limited to personal completed training history

### No Edit Capabilities
- All data displayed as read-only text
- No form inputs or edit buttons
- No modification or interaction options

### Strict Access Control
- Cannot access User or SuperAdmin routes
- Cannot view pending or active simulations
- Cannot modify any data or settings

## UI/UX Features

### Simplified Interface
- **Clean Design** - Minimal, uncluttered layout
- **Read-Only Display** - Clear information presentation
- **Limited Navigation** - Only essential menu items
- **Restricted Actions** - No interactive buttons or forms

### Visual Indicators
- **Risk Score Bar** - Color-coded progress indicator
- **Completion Status** - Clear completed training markers
- **Role Badge** - Visible role identification
- **Access Level** - Clear indication of limited access

### Responsive Design
- **Mobile Optimized** - Works on all device sizes
- **Touch Friendly** - Large, clear text and spacing
- **Accessible** - Screen reader compatible

## Performance Features

### Minimal Data Loading
- **Essential Data Only** - Reduces API calls and data transfer
- **Simple Queries** - Fast database operations
- **Lightweight Components** - Minimal JavaScript and CSS
- **Efficient Rendering** - No complex interactions or animations

### Optimized Experience
- **Fast Loading** - Minimal data requirements
- **Simple Navigation** - Straightforward user flow
- **Clear Messaging** - Obvious limitations and capabilities
- **Stable Interface** - No dynamic content or frequent updates

## Limitations Summary

### What LimitedUsers CANNOT Do:
- Edit profile information
- Start new simulations
- Replay completed simulations
- View other users' data
- Access admin functionality
- Modify any system settings
- View pending or active training
- Export data or reports

### What LimitedUsers CAN Do:
- View basic profile information
- See personal risk score
- View completed training history
- See completion dates and scores
- Navigate basic interface
- Logout from system

The LimitedUser dashboard provides the absolute minimum functionality while maintaining security and preventing any unauthorized access or modifications.