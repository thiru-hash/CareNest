import { createIsolatedModule } from '@/lib/module-system';

// People Module - Completely isolated from other modules
export const peopleModule = createIsolatedModule({
  id: 'people',
  name: 'People Management',
  version: '1.0.0',
  description: 'Manage clients, staff, and people records',
  author: 'CareNest Team',
  dependencies: [], // No dependencies - completely isolated
  routes: [
    {
      path: '/people',
      component: 'PeoplePage',
      permissions: ['*'],
      metadata: {
        title: 'People',
        description: 'Manage people records'
      }
    },
    {
      path: '/people/[id]',
      component: 'PersonDetailPage',
      permissions: ['*'],
      metadata: {
        title: 'Person Details',
        description: 'View person details'
      }
    },
    {
      path: '/people/new',
      component: 'CreatePersonPage',
      permissions: ['Tenant Admin', 'Manager'],
      metadata: {
        title: 'Add Person',
        description: 'Add new person'
      }
    }
  ],
  components: [
    {
      id: 'PeopleTable',
      name: 'People Table',
      type: 'component',
      permissions: ['*'],
      dependencies: []
    },
    {
      id: 'PersonForm',
      name: 'Person Form',
      type: 'form',
      permissions: ['Tenant Admin', 'Manager'],
      dependencies: []
    },
    {
      id: 'PersonCard',
      name: 'Person Card',
      type: 'component',
      permissions: ['*'],
      dependencies: []
    }
  ],
  hooks: [
    {
      id: 'beforePersonCreate',
      name: 'Before Person Create',
      type: 'before',
      permissions: ['Tenant Admin', 'Manager']
    },
    {
      id: 'afterPersonUpdate',
      name: 'After Person Update',
      type: 'after',
      permissions: ['*']
    }
  ],
  permissions: {
    view: ['*'],
    create: ['Tenant Admin', 'Manager'],
    edit: ['Tenant Admin', 'Manager'],
    delete: ['Tenant Admin'],
    admin: ['Tenant Admin']
  },
  settings: {
    enabled: true,
    autoLoad: true,
    isolated: true, // Critical - prevents interference
    versioning: true,
    backup: true
  },
  data: {
    // Module-specific data that doesn't affect other modules
    personTypes: ['client', 'staff', 'family', 'emergency-contact'],
    statuses: ['active', 'inactive', 'pending', 'suspended'],
    categories: ['residential', 'community', 'hospital', 'clinic']
  }
});

// People Module Instance
export class PeopleModuleInstance {
  private data: any[] = [];
  private settings: any = {};

  constructor() {
    this.initializeModule();
  }

  private initializeModule() {
    // Initialize module-specific data
    this.data = [];
    this.settings = peopleModule.data;
  }

  // Module-specific methods that don't affect other modules
  getPeople() {
    return this.data;
  }

  addPerson(person: any) {
    const newPerson = {
      id: `person-${Date.now()}`,
      ...person,
      createdAt: new Date()
    };
    this.data.push(newPerson);
    return newPerson;
  }

  updatePerson(id: string, updates: any) {
    const index = this.data.findIndex(p => p.id === id);
    if (index !== -1) {
      this.data[index] = { ...this.data[index], ...updates, updatedAt: new Date() };
      return this.data[index];
    }
    return null;
  }

  deletePerson(id: string) {
    const index = this.data.findIndex(p => p.id === id);
    if (index !== -1) {
      return this.data.splice(index, 1)[0];
    }
    return null;
  }

  getPerson(id: string) {
    return this.data.find(p => p.id === id);
  }

  // Module-specific settings
  getSettings() {
    return this.settings;
  }

  updateSettings(newSettings: any) {
    this.settings = { ...this.settings, ...newSettings };
  }

  // Export module data (for backup/restore)
  exportData() {
    return {
      data: this.data,
      settings: this.settings,
      timestamp: new Date().toISOString()
    };
  }

  // Import module data (for backup/restore)
  importData(backup: any) {
    if (backup.data) this.data = backup.data;
    if (backup.settings) this.settings = backup.settings;
  }
}

// Module registration
export const registerPeopleModule = () => {
  const { moduleSystem } = require('@/lib/module-system');
  
  // Register the module
  moduleSystem.registerModule(peopleModule);
  
  // Create and register module instance
  const instance = new PeopleModuleInstance();
  moduleSystem.loadModuleInstance('people', instance);
  
  console.log('People module registered successfully');
};

// Module unregistration
export const unregisterPeopleModule = () => {
  const { moduleSystem } = require('@/lib/module-system');
  
  // Backup module data before unregistering
  const instance = moduleSystem.getModuleInstance('people');
  if (instance) {
    const backup = instance.exportData();
    // Store backup somewhere if needed
    console.log('People module data backed up:', backup);
  }
  
  // Unregister module
  moduleSystem.unregisterModule('people');
  
  console.log('People module unregistered successfully');
}; 