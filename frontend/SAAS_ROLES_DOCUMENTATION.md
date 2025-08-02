# CyberSentinel AI - SaaS Role System

## 🎭 Role Hierarchy & Permissions

### 👑 **SuperAdmin** (Platform Owner)
- **Access Level**: Global platform access
- **Permissions**: All resources (`*`) with all actions (`*`)
- **Dashboard Tabs**: Overview, Companies, Analytics, System, Billing
- **Key Features**:
  - Manage all tenant companies
  - View global analytics across all tenants
  - System configuration and billing management
  - Full cyber map access
  - Create/manage platform-wide content

### 🛡️ **Admin** (Company-Level Administrator)
- **Access Level**: Company-wide management
- **Permissions**: 
  - Users: create, read, update, delete
  - Scenarios: read, assign
  - Reports: read, export
  - Settings: read, update
- **Dashboard Tabs**: Overview, Users, Reports, Settings
- **Key Features**:
  - Manage company users and roles
  - Assign training scenarios to employees
  - View company-wide security reports
  - Access cyber map for company threats
  - Configure company settings

### 🎓 **SecurityTrainer** (Module Author & Instructor)
- **Access Level**: Training content management
- **Permissions**:
  - Scenarios: create, read, update, delete
  - Training: create, read, update
  - Students: read, assign
  - Progress: read
- **Dashboard Tabs**: Modules, Students, Progress, Content
- **Key Features**:
  - Create and publish training modules
  - Monitor student progress
  - Assign training to specific groups
  - Content authoring tools
  - No cyber map access (focused on training)

### 📊 **Analyst** (View-Only Security Data)
- **Access Level**: Read-only security analysis
- **Permissions**:
  - Threats: read
  - Reports: read
  - Analytics: read
  - Incidents: read
- **Dashboard Tabs**: Threats, Analytics, Reports
- **Key Features**:
  - View threat intelligence data
  - Access cyber map for threat analysis
  - Generate security reports
  - Monitor security metrics
  - No user management capabilities

### 👤 **Employee** (Trainee)
- **Access Level**: Personal training access
- **Permissions**:
  - Training: read, participate
  - Progress: read
  - Certificates: read
  - Profile: read, update
- **Dashboard Tabs**: Training, Progress, Certificates
- **Key Features**:
  - Complete assigned training modules
  - Track personal progress
  - View earned certificates
  - Update personal profile
  - No administrative access

## 🏢 Multi-Tenant Architecture

### Tenant Isolation
- Each company operates as a separate tenant
- Data isolation between companies
- Role permissions scoped to tenant level
- SuperAdmin can access all tenants

### Company Hierarchy
```
Platform (SuperAdmin)
├── Company A (Admin, SecurityTrainer, Analyst, Employee)
├── Company B (Admin, SecurityTrainer, Analyst, Employee)
└── Company C (Admin, SecurityTrainer, Analyst, Employee)
```

## 🔐 Permission System

### Resource-Action Model
```typescript
interface Permission {
  resource: string  // 'users', 'scenarios', 'reports', etc.
  actions: string[] // 'create', 'read', 'update', 'delete'
}
```

### Permission Checking
```typescript
hasPermission(userRole, 'users', 'create') // Returns boolean
```

### Role-Based UI Rendering
- Dashboard tabs filtered by role permissions
- Features hidden/shown based on role capabilities
- Navigation items filtered by access level

## 🎨 Visual Role Indicators

### Role Colors & Icons
- **SuperAdmin**: Red (`#ff0066`) - Crown 👑
- **Admin**: Yellow (`#ffff00`) - Shield 🛡️
- **SecurityTrainer**: Magenta (`#ff00ff`) - Graduation Cap 🎓
- **Analyst**: Blue (`#0066ff`) - Bar Chart 📊
- **Employee**: Green (`#00ff66`) - User 👤

### Dashboard Customization
- Role-specific color schemes
- Contextual content based on permissions
- Personalized navigation menus

## 🚀 Implementation Features

### Role Selector Component
- Interactive role switching for testing
- Visual role cards with descriptions
- Real-time dashboard updates

### Permission Guards
- Route-level access control
- Component-level feature flags
- API endpoint protection

### Audit Trail
- Role-based action logging
- Permission change tracking
- Security event monitoring

## 📱 Mobile Responsiveness

### Adaptive UI
- Role-appropriate mobile layouts
- Touch-friendly role selection
- Responsive dashboard grids

### Progressive Disclosure
- Essential features prioritized on mobile
- Role-based feature hiding on small screens
- Collapsible navigation for complex roles

## 🔄 Role Transition Workflows

### Employee → Analyst
- Additional read permissions granted
- Cyber map access enabled
- Analytics dashboard unlocked

### Analyst → Admin
- User management capabilities added
- Company-wide report access
- Settings configuration rights

### Admin → SuperAdmin
- Multi-tenant access granted
- Platform-wide analytics enabled
- Billing and system management

## 🛡️ Security Considerations

### Role Elevation
- Secure role assignment process
- Audit trail for role changes
- Time-limited elevated permissions

### Data Access Control
- Row-level security by tenant
- Column-level permissions by role
- API rate limiting by role

### Session Management
- Role-based session timeouts
- Multi-factor authentication for admins
- Secure role switching mechanisms

---

**Implementation Status**: ✅ Complete
**Testing**: Role selector available in dashboard
**Documentation**: Comprehensive role definitions and permissions