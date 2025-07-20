export interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
  settings: {
    branding: {
      logo: string;
      primaryColor: string;
      companyName: string;
    };
    features: {
      automation: boolean;
      advancedReporting: boolean;
      customForms: boolean;
      apiAccess: boolean;
    };
    modules: {
      roster: boolean;
      people: boolean;
      finance: boolean;
      timesheet: boolean;
      compliance: boolean;
      automation: boolean;
    };
  };
}

export const mockTenants: Tenant[] = [
  {
    id: 'tenant-1',
    name: 'CareNest Demo',
    slug: 'carenest-demo',
    domain: 'demo.carenest.com',
    status: 'active',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    settings: {
      branding: {
        logo: '/carenest-logo.svg',
        primaryColor: '#10B981',
        companyName: 'CareNest Demo'
      },
      features: {
        automation: true,
        advancedReporting: true,
        customForms: true,
        apiAccess: false
      },
      modules: {
        roster: true,
        people: true,
        finance: true,
        timesheet: true,
        compliance: true,
        automation: true
      }
    }
  },
  {
    id: 'tenant-2',
    name: 'Sunrise Care',
    slug: 'sunrise-care',
    domain: 'sunrise.carenest.com',
    status: 'active',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
    settings: {
      branding: {
        logo: '/sunrise-logo.svg',
        primaryColor: '#F59E0B',
        companyName: 'Sunrise Care'
      },
      features: {
        automation: false,
        advancedReporting: true,
        customForms: true,
        apiAccess: false
      },
      modules: {
        roster: true,
        people: true,
        finance: false,
        timesheet: true,
        compliance: true,
        automation: false
      }
    }
  },
  {
    id: 'tenant-3',
    name: 'Golden Years',
    slug: 'golden-years',
    domain: 'golden.carenest.com',
    status: 'inactive',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-12'),
    settings: {
      branding: {
        logo: '/golden-logo.svg',
        primaryColor: '#8B5CF6',
        companyName: 'Golden Years'
      },
      features: {
        automation: false,
        advancedReporting: false,
        customForms: false,
        apiAccess: false
      },
      modules: {
        roster: true,
        people: true,
        finance: false,
        timesheet: false,
        compliance: false,
        automation: false
      }
    }
  }
]; 