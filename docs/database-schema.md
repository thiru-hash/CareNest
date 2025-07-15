# CareNest Database Schema

## Overview
This document outlines the complete database schema for the CareNest disability sector SaaS platform, designed for NZ & AU markets.

## Core Tables

### 1. Tenants (Multi-tenancy)
```sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  domain VARCHAR(255),
  logo_url TEXT,
  primary_color VARCHAR(7),
  license_model VARCHAR(20) DEFAULT 'per_user',
  max_users INTEGER DEFAULT 10,
  active_users INTEGER DEFAULT 0,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Users & Staff
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  role VARCHAR(50) NOT NULL,
  phone VARCHAR(20),
  status VARCHAR(20) DEFAULT 'active',
  last_active TIMESTAMP,
  login_count INTEGER DEFAULT 0,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE staff_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  employment_type VARCHAR(20), -- 'Full-time', 'Part-time', 'Casual'
  start_date DATE,
  pay_rate DECIMAL(10,2),
  personal_details JSONB, -- DOB, address, emergency contacts
  hr_details JSONB, -- Interview notes, documents
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Clients (People We Support)
```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  status VARCHAR(20) DEFAULT 'Active',
  property_id UUID,
  date_of_birth DATE,
  address TEXT,
  emergency_contact JSONB,
  medical_info JSONB, -- Conditions, allergies, medications
  support_plan JSONB, -- Goals, preferences, restrictions
  support_logs TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Properties/Locations
```sql
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  image_url TEXT,
  status VARCHAR(20) DEFAULT 'Active',
  type VARCHAR(50), -- 'Residential', 'Community', 'Day Program'
  capacity INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 5. Shifts & Roster
```sql
CREATE TABLE shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  staff_id UUID REFERENCES users(id),
  client_id UUID REFERENCES clients(id),
  property_id UUID REFERENCES properties(id),
  status VARCHAR(20) DEFAULT 'Open', -- 'Open', 'Assigned', 'In Progress', 'Completed'
  billable BOOLEAN DEFAULT true,
  rate DECIMAL(10,2),
  service_type VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 6. Timesheets
```sql
CREATE TABLE timesheets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  staff_id UUID REFERENCES users(id) NOT NULL,
  shift_id UUID REFERENCES shifts(id) NOT NULL,
  property_id UUID REFERENCES properties(id),
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  hours_worked DECIMAL(5,2) NOT NULL,
  break_duration INTEGER DEFAULT 0, -- in minutes
  status VARCHAR(20) DEFAULT 'Draft', -- 'Draft', 'Submitted', 'Approved', 'Rejected'
  notes TEXT,
  travel_log JSONB, -- Array of travel entries
  submitted_at TIMESTAMP,
  reviewed_at TIMESTAMP,
  reviewed_by UUID REFERENCES users(id),
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 7. Compliance & Training
```sql
CREATE TABLE compliance_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  staff_id UUID REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100), -- 'Training', 'Background Check', 'Health'
  renewal_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'Compliant', -- 'Compliant', 'Expiring Soon', 'Overdue'
  document_url TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 8. Finance & Billing
```sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  client_id UUID REFERENCES clients(id),
  status VARCHAR(20) DEFAULT 'Draft', -- 'Draft', 'Pending', 'Paid', 'Overdue'
  date_issued DATE NOT NULL,
  due_date DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) DEFAULT 0,
  line_items JSONB,
  xero_exported BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE client_funding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id),
  core_budget DECIMAL(10,2),
  core_spent DECIMAL(10,2) DEFAULT 0,
  capacity_budget DECIMAL(10,2),
  capacity_spent DECIMAL(10,2) DEFAULT 0,
  capital_budget DECIMAL(10,2),
  capital_spent DECIMAL(10,2) DEFAULT 0,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE client_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id),
  date DATE NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR(20) NOT NULL, -- 'Expense', 'Payment'
  amount DECIMAL(10,2) NOT NULL,
  gst DECIMAL(10,2) DEFAULT 0,
  category VARCHAR(50), -- 'Transport', 'Groceries', 'Equipment', 'Utilities', 'Other'
  attachment_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 9. Incidents & Case Management
```sql
CREATE TABLE incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id),
  staff_id UUID REFERENCES users(id),
  incident_date TIMESTAMP NOT NULL,
  incident_type VARCHAR(100) NOT NULL,
  severity VARCHAR(20) NOT NULL, -- 'Low', 'Medium', 'High', 'Critical'
  description TEXT NOT NULL,
  actions_taken TEXT,
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_date DATE,
  status VARCHAR(20) DEFAULT 'Open', -- 'Open', 'In Progress', 'Resolved', 'Closed'
  reported_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE case_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id),
  staff_id UUID REFERENCES users(id),
  note_date TIMESTAMP NOT NULL,
  note_type VARCHAR(50), -- 'Daily Log', 'Progress Note', 'Communication Log'
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 10. Documents
```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'Contract', 'Policy', 'Certification', 'Other'
  entity_type VARCHAR(20) NOT NULL, -- 'staff', 'client', 'property', 'system'
  entity_id UUID NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 11. System Settings & Permissions
```sql
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_groups (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, group_id)
);

CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  section VARCHAR(100) NOT NULL,
  permission VARCHAR(20) NOT NULL, -- 'view', 'create', 'edit', 'delete'
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(group_id, section, permission)
);

CREATE TABLE app_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  path VARCHAR(100) NOT NULL,
  icon_name VARCHAR(100),
  order_index INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'Active',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE section_tabs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID REFERENCES app_sections(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  order_index INTEGER DEFAULT 0,
  form_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE custom_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  linked_section_id UUID REFERENCES app_sections(id),
  fields JSONB NOT NULL,
  status VARCHAR(20) DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 12. Audit & Activity Logs
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  activity_type VARCHAR(100) NOT NULL,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Indexes for Performance

```sql
-- Users
CREATE INDEX idx_users_tenant_id ON users(tenant_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Shifts
CREATE INDEX idx_shifts_tenant_id ON shifts(tenant_id);
CREATE INDEX idx_shifts_staff_id ON shifts(staff_id);
CREATE INDEX idx_shifts_client_id ON shifts(client_id);
CREATE INDEX idx_shifts_start_time ON shifts(start_time);
CREATE INDEX idx_shifts_status ON shifts(status);

-- Timesheets
CREATE INDEX idx_timesheets_tenant_id ON timesheets(tenant_id);
CREATE INDEX idx_timesheets_staff_id ON timesheets(staff_id);
CREATE INDEX idx_timesheets_shift_id ON timesheets(shift_id);
CREATE INDEX idx_timesheets_status ON timesheets(status);
CREATE INDEX idx_timesheets_submitted_at ON timesheets(submitted_at);

-- Clients
CREATE INDEX idx_clients_tenant_id ON clients(tenant_id);
CREATE INDEX idx_clients_property_id ON clients(property_id);
CREATE INDEX idx_clients_status ON clients(status);

-- Compliance
CREATE INDEX idx_compliance_tenant_id ON compliance_items(tenant_id);
CREATE INDEX idx_compliance_staff_id ON compliance_items(staff_id);
CREATE INDEX idx_compliance_renewal_date ON compliance_items(renewal_date);
CREATE INDEX idx_compliance_status ON compliance_items(status);

-- Finance
CREATE INDEX idx_invoices_tenant_id ON invoices(tenant_id);
CREATE INDEX idx_invoices_client_id ON invoices(client_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_date_issued ON invoices(date_issued);

-- Audit
CREATE INDEX idx_audit_logs_tenant_id ON audit_logs(tenant_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

## Data Retention & Archiving

```sql
-- Archive old timesheets (older than 7 years)
CREATE OR REPLACE FUNCTION archive_old_timesheets()
RETURNS void AS $$
BEGIN
  INSERT INTO timesheets_archive 
  SELECT * FROM timesheets 
  WHERE created_at < NOW() - INTERVAL '7 years';
  
  DELETE FROM timesheets 
  WHERE created_at < NOW() - INTERVAL '7 years';
END;
$$ LANGUAGE plpgsql;

-- Archive old audit logs (older than 2 years)
CREATE OR REPLACE FUNCTION archive_old_audit_logs()
RETURNS void AS $$
BEGIN
  INSERT INTO audit_logs_archive 
  SELECT * FROM audit_logs 
  WHERE created_at < NOW() - INTERVAL '2 years';
  
  DELETE FROM audit_logs 
  WHERE created_at < NOW() - INTERVAL '2 years';
END;
$$ LANGUAGE plpgsql;
```

## Security Considerations

1. **Row Level Security (RLS)** for multi-tenancy
2. **Encryption at rest** for sensitive data
3. **Audit trails** for all data modifications
4. **Data retention policies** compliant with NZ/AU regulations
5. **Backup and recovery** procedures
6. **Access control** based on user roles and permissions

## Compliance Features

1. **NDIS/ACC integration** fields and tracking
2. **Privacy Act compliance** data handling
3. **Incident reporting** for regulatory requirements
4. **Quality & safeguarding** mechanisms
5. **Cultural safety** considerations
6. **Restrictive practice** logging 