# RBAC Database Schema

## Core Tables

### 1. Organizations
```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  domain VARCHAR(255),
  logo_url TEXT,
  primary_color VARCHAR(7),
  settings JSONB DEFAULT '{}',
  rbac_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Roles
```sql
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  rbac_enabled BOOLEAN DEFAULT false,
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(organization_id, name)
);
```

### 3. Staff
```sql
CREATE TABLE staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  status VARCHAR(20) DEFAULT 'active',
  rbac_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Properties
```sql
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  type VARCHAR(50), -- 'residential', 'community', 'office'
  status VARCHAR(20) DEFAULT 'active',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 5. Clients
```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  support_plan JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 6. Roster Entries
```sql
CREATE TABLE roster_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  staff_id UUID REFERENCES staff(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  status VARCHAR(20) DEFAULT 'scheduled', -- 'scheduled', 'active', 'completed', 'cancelled'
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 7. Clock Events
```sql
CREATE TABLE clock_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  staff_id UUID REFERENCES staff(id) ON DELETE CASCADE,
  roster_entry_id UUID REFERENCES roster_entries(id) ON DELETE CASCADE,
  event_type VARCHAR(20) NOT NULL, -- 'clock_in', 'clock_out'
  timestamp TIMESTAMP NOT NULL,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 8. Access Grants
```sql
CREATE TABLE access_grants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  staff_id UUID REFERENCES staff(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  roster_entry_id UUID REFERENCES roster_entries(id) ON DELETE CASCADE,
  clock_event_id UUID REFERENCES clock_events(id),
  grant_type VARCHAR(20) NOT NULL, -- 'rbac_automatic', 'manual', 'temporary'
  granted_at TIMESTAMP NOT NULL,
  revoked_at TIMESTAMP,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 9. Access Audit Log
```sql
CREATE TABLE access_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  staff_id UUID REFERENCES staff(id),
  action VARCHAR(50) NOT NULL, -- 'access_granted', 'access_revoked', 'access_denied'
  resource_type VARCHAR(20) NOT NULL, -- 'property', 'client', 'document'
  resource_id UUID,
  reason TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Indexes for Performance

```sql
-- Roster entries by staff and time
CREATE INDEX idx_roster_entries_staff_time ON roster_entries(staff_id, start_time, end_time);

-- Active roster entries
CREATE INDEX idx_roster_entries_active ON roster_entries(status, start_time, end_time) 
WHERE status IN ('scheduled', 'active');

-- Clock events by staff and time
CREATE INDEX idx_clock_events_staff_time ON clock_events(staff_id, timestamp);

-- Access grants by staff and property
CREATE INDEX idx_access_grants_staff_property ON access_grants(staff_id, property_id, granted_at);

-- Audit log by staff and time
CREATE INDEX idx_audit_log_staff_time ON access_audit_log(staff_id, created_at);
```

## Views for Common Queries

### Active Access View
```sql
CREATE VIEW active_access AS
SELECT 
  ag.staff_id,
  ag.property_id,
  ag.roster_entry_id,
  ag.granted_at,
  ag.expires_at,
  s.name as staff_name,
  p.name as property_name,
  o.name as organization_name
FROM access_grants ag
JOIN staff s ON ag.staff_id = s.id
JOIN properties p ON ag.property_id = p.id
JOIN organizations o ON ag.organization_id = o.id
WHERE ag.revoked_at IS NULL 
  AND (ag.expires_at IS NULL OR ag.expires_at > NOW());
```

### Current RBAC Access View
```sql
CREATE VIEW current_rbac_access AS
SELECT 
  s.id as staff_id,
  s.name as staff_name,
  p.id as property_id,
  p.name as property_name,
  re.id as roster_entry_id,
  re.start_time,
  re.end_time,
  ce.timestamp as last_clock_event,
  ag.granted_at as access_granted_at
FROM staff s
JOIN roster_entries re ON s.id = re.staff_id
JOIN properties p ON re.property_id = p.id
JOIN organizations o ON s.organization_id = o.id
LEFT JOIN clock_events ce ON s.id = ce.staff_id 
  AND ce.event_type = 'clock_in'
  AND ce.timestamp = (
    SELECT MAX(timestamp) 
    FROM clock_events 
    WHERE staff_id = s.id AND event_type = 'clock_in'
  )
LEFT JOIN access_grants ag ON s.id = ag.staff_id 
  AND p.id = ag.property_id 
  AND ag.revoked_at IS NULL
WHERE o.rbac_enabled = true
  AND s.rbac_enabled = true
  AND re.status = 'active'
  AND NOW() BETWEEN re.start_time AND re.end_time;
``` 