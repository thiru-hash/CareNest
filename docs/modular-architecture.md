# 🏗️ CareNest Modular Architecture

## Overview

CareNest is built as a **modular, multi-tenant SaaS platform** with role-based access control. Each section (People, Finance, Roster, etc.) is developed as a separate module that can be independently developed, tested, and deployed.

## 📁 Module Structure

```
src/
├── modules/                    # All feature modules
│   ├── index.ts               # Module registry & configurations
│   ├── people/                # People module (clients, staff, groups)
│   │   ├── index.ts           # Module exports & configuration
│   │   ├── types.ts           # Module-specific types
│   │   ├── components/        # Module components
│   │   ├── hooks/             # Module hooks
│   │   ├── utils/             # Module utilities
│   │   └── pages/             # Module pages
│   ├── finance/               # Finance module
│   ├── roster/                # Roster module
│   ├── compliance/            # Compliance module
│   └── settings/              # Settings module
├── lib/
│   ├── module-registry.ts     # Module registry system
│   └── types.ts               # Shared types
└── components/
    └── ui/                    # Shared UI components
```

## 🎯 Key Benefits

### ✅ **Independent Development**
- Each module can be developed separately
- Changes in one module don't affect others
- Teams can work on different modules simultaneously

### ✅ **Role-Based Access**
- Modules are only loaded for users with appropriate roles
- Feature flags control access to specific sections
- Clean separation of concerns

### ✅ **Scalable Architecture**
- Easy to add new modules
- Modules can be enabled/disabled per tenant
- Support for different license models

### ✅ **Maintainable Codebase**
- Clear module boundaries
- Shared utilities and components
- Consistent patterns across modules

## 🔧 Module Configuration

### Core Modules
```typescript
export const CORE_MODULES = {
  dashboard: {
    id: 'dashboard',
    name: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    isEnabled: true,
    permissions: ['view'],
    dependencies: [],
    settings: {
      widgets: ['finance', 'shifts', 'compliance', 'notifications']
    }
  },
  // ... other modules
};
```

### Role-Based Access
```typescript
export const ROLE_MODULE_ACCESS = {
  'System Admin': ['dashboard', 'people', 'roster', 'finance', 'compliance', 'settings'],
  'Support Worker': ['dashboard', 'roster'],
  'Finance Admin': ['dashboard', 'finance', 'people'],
  // ... other roles
};
```

## 🚀 Module Development Workflow

### 1. **Create Module Structure**
```bash
src/modules/your-module/
├── index.ts           # Module exports
├── types.ts           # Module types
├── components/        # Module components
├── hooks/            # Module hooks
├── utils/            # Module utilities
└── pages/            # Module pages
```

### 2. **Define Module Configuration**
```typescript
// src/modules/your-module/index.ts
export const YOUR_MODULE_CONFIG: ModuleConfig = {
  id: 'your-module',
  name: 'Your Module',
  path: '/your-module',
  icon: 'YourIcon',
  isEnabled: true,
  permissions: ['view', 'create', 'edit', 'delete'],
  dependencies: ['people'], // if depends on other modules
  settings: {
    sections: ['section1', 'section2'],
    features: ['feature1', 'feature2']
  }
};
```

### 3. **Register Module**
```typescript
// src/modules/index.ts
import { YOUR_MODULE_CONFIG } from './your-module';

export const CORE_MODULES = {
  // ... existing modules
  'your-module': YOUR_MODULE_CONFIG
};
```

### 4. **Add Role Access**
```typescript
export const ROLE_MODULE_ACCESS = {
  'System Admin': [...existingModules, 'your-module'],
  'Your Role': ['dashboard', 'your-module'],
  // ... other roles
};
```

## 🎛️ Module Registry System

The module registry manages:
- **Module configurations**
- **Role-based access control**
- **Dynamic module loading**
- **Feature flags**
- **Dependency management**

### Key Functions
```typescript
// Get modules for a specific role
getModulesForRole(role: UserRole): ModuleConfig[]

// Check if module is enabled for role
isModuleEnabledForRole(moduleId: string, role: UserRole): boolean

// Get navigation items for role
getNavigationItems(role: UserRole): NavigationItem[]

// Get dashboard widgets for role
getDashboardWidgets(role: UserRole): string[]
```

## 🔐 Role-Based Access Control

### User Roles
1. **CareNest Owner/Founder** - Full platform access
2. **CareNest Tech Team** - Platform admin access
3. **Client Company Admin** - Tenant management
4. **End Users** - Role-based module access

### Access Levels
- **System Admin** - All modules
- **Finance Admin** - Dashboard, Finance, People
- **Support Worker** - Dashboard, Roster
- **HR Admin** - Dashboard, People, Compliance

## 🎨 Dashboard Widgets

Dashboard widgets are role-based:
- **Finance widgets** - Only for admin roles
- **Shift widgets** - All roles
- **Compliance widgets** - All roles
- **Notification widgets** - All roles

## 🚀 Next Steps

### Phase 1: Core Modules ✅
- [x] Module registry system
- [x] Role-based access control
- [x] People module structure
- [x] Dashboard role-based widgets

### Phase 2: Module Development
- [ ] Finance module
- [ ] Roster module
- [ ] Compliance module
- [ ] Settings module

### Phase 3: Advanced Features
- [ ] Dynamic form builder
- [ ] Custom field permissions
- [ ] Tenant-specific branding
- [ ] Automation system

## 📋 Development Guidelines

### ✅ **Do's**
- Keep modules self-contained
- Use shared UI components
- Follow consistent naming conventions
- Document module dependencies
- Test modules independently

### ❌ **Don'ts**
- Don't create circular dependencies
- Don't hardcode role checks in components
- Don't duplicate shared functionality
- Don't skip module documentation

## 🔄 Module Lifecycle

1. **Development** - Build module independently
2. **Testing** - Test module in isolation
3. **Integration** - Register with module registry
4. **Deployment** - Enable for appropriate roles
5. **Monitoring** - Track usage and performance

This modular architecture ensures CareNest can scale efficiently while maintaining clean separation of concerns and enabling independent development of features. 