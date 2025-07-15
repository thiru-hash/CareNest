# 🏡 CareNest Architecture Guide

## 📋 Table of Contents

1. [Design Style Guide](#design-style-guide)
2. [Licensing System](#licensing-system)
3. [Modular Architecture](#modular-architecture)
4. [Folder Structure](#folder-structure)
5. [Best Practices](#best-practices)

---

## 🎨 Design Style Guide

### Color System

CareNest uses a **professional healthcare-focused color palette** designed for trust, clarity, and accessibility.

#### Primary Colors
- **Primary Blue**: `#3B82F6` (HSL: 221 83% 53%) - Trust & Professionalism
- **Success Green**: `#16A34A` (HSL: 142 76% 36%) - Healthcare & Success
- **Warning Amber**: `#F59E0B` (HSL: 38 92% 50%) - Alerts & Notifications
- **Error Red**: `#EF4444` (HSL: 0 84% 60%) - Errors & Critical Actions

#### Surface Colors
- **Background**: `#FFFFFF` - Pure white for clean interfaces
- **Card**: `#FFFFFF` - Consistent card backgrounds
- **Border**: `#E2E8F0` - Subtle, professional borders
- **Muted**: `#F1F5F9` - Light gray for secondary elements

#### Text Colors
- **Primary Text**: `#64748B` - Main content (HSL: 220 9% 46%)
- **Muted Text**: `#64748B` - Secondary content
- **Inverted Text**: `#F8FAFC` - Text on colored backgrounds

### Tailwind Integration

```css
/* Custom utility classes for healthcare-specific colors */
.text-success { color: hsl(var(--success)); }
.text-warning { color: hsl(var(--warning)); }
.text-info { color: hsl(var(--info)); }

.bg-success { background-color: hsl(var(--success)); }
.bg-warning { background-color: hsl(var(--warning)); }
.bg-info { background-color: hsl(var(--info)); }
```

### Design Principles

1. **Trust & Professionalism**: Blue-based palette conveys reliability
2. **Healthcare Focus**: Green accents for success states and health indicators
3. **Accessibility**: High contrast ratios and clear typography
4. **Consistency**: Unified color system across all modules
5. **Scalability**: Easy to extend for future features

---

## 🔐 Licensing System

### License Models

CareNest supports three licensing models:

#### 1. Per-User Licensing
- Each user account consumes one license
- Fixed number of total users allowed
- Best for organizations with stable user counts

#### 2. Pooled Licensing
- Shared pool of concurrent user slots
- Users can log in/out without consuming permanent licenses
- Best for organizations with variable usage patterns

#### 3. Unlimited Licensing
- No user restrictions
- Premium tier for large organizations

### Implementation

```typescript
// License validation
const licenseManager = LicenseManager.getInstance();
const validation = licenseManager.validateLogin(user, tenant);

if (!validation.canLogin) {
  // Show license limit message
  return { error: validation.reason };
}

// Start user session
const session = licenseManager.startUserSession(user, tenant);
```

### License Tracking

- **Active Sessions**: Real-time tracking of concurrent users
- **Usage Analytics**: Detailed usage patterns and trends
- **Automatic Cleanup**: Expired sessions are automatically cleared
- **Tenant Isolation**: Each tenant's license is completely isolated

---

## 🧩 Modular Architecture

### Core Principles

1. **Module Isolation**: Each module operates independently
2. **Lazy Loading**: Modules load only when needed
3. **Permission-Based Access**: Role and license-based visibility
4. **Tenant-Specific Configuration**: Each tenant can customize modules
5. **Dependency Management**: Clear module dependencies

### Module Structure

```
src/
├── modules/
│   ├── dashboard/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types.ts
│   │   └── index.ts
│   ├── roster/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types.ts
│   │   └── index.ts
│   ├── people/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types.ts
│   │   └── index.ts
│   ├── finance/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types.ts
│   │   └── index.ts
│   ├── locations/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types.ts
│   │   └── index.ts
│   └── settings/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       ├── types.ts
│       └── index.ts
```

### Module Configuration

```typescript
// Module definition
const moduleConfig: ModuleConfig = {
  id: 'roster',
  name: 'Roster Schedule',
  path: '/roster',
  icon: 'Calendar',
  isEnabled: true,
  permissions: ['view_roster'],
  dependencies: ['people'],
  settings: {
    allowShiftCreation: true,
    allowShiftEditing: true,
    showConflictWarnings: true
  }
};
```

### Tab Management

Each module can have multiple tabs with independent permissions:

```typescript
const tabConfig: TabConfig = {
  id: 'roster-calendar',
  moduleId: 'roster',
  name: 'Calendar',
  path: '/roster',
  isEnabled: true,
  permissions: ['view_roster'],
  order: 1
};
```

---

## 📁 Folder Structure

### Recommended Structure

```
CareNest/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (app)/             # Protected routes
│   │   │   ├── dashboard/
│   │   │   ├── roster/
│   │   │   ├── people/
│   │   │   ├── finance/
│   │   │   ├── locations/
│   │   │   └── settings/
│   │   ├── globals.css        # Updated color system
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/                # ShadCN components
│   │   ├── layout/            # Layout components
│   │   └── modules/           # Module-specific components
│   │       ├── dashboard/
│   │       ├── roster/
│   │       ├── people/
│   │       ├── finance/
│   │       ├── locations/
│   │       └── settings/
│   ├── lib/
│   │   ├── types.ts           # Enhanced with licensing types
│   │   ├── licensing.ts       # License management
│   │   ├── modules.ts         # Module management
│   │   ├── auth.ts            # Authentication
│   │   ├── data.ts            # Mock data
│   │   └── utils.ts
│   ├── hooks/
│   │   ├── use-license.ts     # License hooks
│   │   ├── use-module.ts      # Module hooks
│   │   └── use-tenant.ts      # Tenant hooks
│   └── services/
│       ├── license-service.ts  # License API calls
│       ├── module-service.ts   # Module API calls
│       └── tenant-service.ts   # Tenant API calls
├── public/
│   ├── carenest-logo.svg      # New logo
│   ├── carenest-icon.svg      # App icon
│   └── carenest-horizontal.svg # Horizontal logo
└── docs/
    ├── STYLE_GUIDE.md         # Detailed style guide
    ├── LICENSING.md           # License documentation
    └── MODULES.md             # Module documentation
```

### Module Isolation Best Practices

1. **Independent State Management**: Each module manages its own state
2. **Isolated API Calls**: Module-specific service layers
3. **Component Boundaries**: Clear separation between modules
4. **Shared Utilities**: Common utilities in `lib/` directory
5. **Type Safety**: Strong typing for all module interfaces

---

## 🚀 Best Practices

### 1. Module Development

```typescript
// Module entry point
// src/modules/roster/index.ts
export { default as RosterModule } from './components/RosterModule';
export { useRoster } from './hooks/useRoster';
export { rosterService } from './services/rosterService';
export type { RosterState, Shift } from './types';
```

### 2. License Integration

```typescript
// Component with license checking
const RosterComponent = () => {
  const { hasPermission } = useLicense();
  const { moduleConfig } = useModule('roster');
  
  if (!hasPermission('view_roster')) {
    return <LicenseUpgradePrompt />;
  }
  
  return <RosterCalendar />;
};
```

### 3. Tenant-Specific Configuration

```typescript
// Tenant-aware component
const FinanceOverview = () => {
  const { tenant } = useTenant();
  const { currency, gstEnabled } = tenant.settings;
  
  return (
    <div className="finance-overview">
      <CurrencyDisplay currency={currency} />
      {gstEnabled && <GSTIndicator />}
    </div>
  );
};
```

### 4. Lazy Loading

```typescript
// Dynamic module loading
const ModuleLoader = ({ moduleId }: { moduleId: string }) => {
  const [Module, setModule] = useState<ComponentType | null>(null);
  
  useEffect(() => {
    import(`../modules/${moduleId}`)
      .then((module) => setModule(module.default))
      .catch(console.error);
  }, [moduleId]);
  
  return Module ? <Module /> : <LoadingSpinner />;
};
```

### 5. Error Boundaries

```typescript
// Module error boundary
class ModuleErrorBoundary extends Component {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  render() {
    if (this.state.hasError) {
      return <ModuleErrorFallback />;
    }
    
    return this.props.children;
  }
}
```

---

## 🔄 Migration Strategy

### Phase 1: Foundation
- [x] Update color system
- [x] Implement licensing logic
- [x] Create module management system

### Phase 2: Module Migration
- [ ] Refactor existing pages into modules
- [ ] Implement lazy loading
- [ ] Add permission checks

### Phase 3: Advanced Features
- [ ] Real-time license tracking
- [ ] Advanced module configuration
- [ ] Performance optimizations

### Phase 4: Production Ready
- [ ] Database integration
- [ ] Real authentication
- [ ] Monitoring and analytics

---

## 📚 Additional Resources

- **Style Guide**: `docs/STYLE_GUIDE.md`
- **License Documentation**: `docs/LICENSING.md`
- **Module Documentation**: `docs/MODULES.md`
- **API Reference**: `docs/API.md`

This architecture provides a solid foundation for a scalable, multi-tenant B2B SaaS platform that can grow with your business needs while maintaining code quality and developer productivity. 