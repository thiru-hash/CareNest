import { createIsolatedModule } from '@/lib/module-system';

// Roster Module - Manages shifts and scheduling
export const rosterModule = createIsolatedModule({
  id: 'roster',
  name: 'Roster Management',
  version: '1.0.0',
  description: 'Manage shifts, scheduling, and time tracking',
  author: 'CareNest Team',
  dependencies: ['people'], // Depends on people module for staff data
  routes: [
    {
      path: '/roster',
      component: 'RosterPage',
      permissions: ['*'],
      metadata: {
        title: 'Roster',
        description: 'Manage shifts and scheduling'
      }
    },
    {
      path: '/roster/shifts',
      component: 'ShiftsPage',
      permissions: ['*'],
      metadata: {
        title: 'Shifts',
        description: 'View and manage shifts'
      }
    },
    {
      path: '/roster/schedule',
      component: 'SchedulePage',
      permissions: ['*'],
      metadata: {
        title: 'Schedule',
        description: 'View schedule'
      }
    }
  ],
  components: [
    {
      id: 'ShiftTable',
      name: 'Shift Table',
      type: 'component',
      permissions: ['*'],
      dependencies: []
    },
    {
      id: 'ShiftForm',
      name: 'Shift Form',
      type: 'form',
      permissions: ['Tenant Admin', 'Manager'],
      dependencies: []
    },
    {
      id: 'OpenShiftsWidget',
      name: 'Open Shifts Widget',
      type: 'component',
      permissions: ['*'],
      dependencies: []
    }
  ],
  hooks: [
    {
      id: 'beforeShiftCreate',
      name: 'Before Shift Create',
      type: 'before',
      permissions: ['Tenant Admin', 'Manager']
    },
    {
      id: 'afterShiftUpdate',
      name: 'After Shift Update',
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
    isolated: true,
    versioning: true,
    backup: true
  },
  data: {
    shiftTypes: ['morning', 'afternoon', 'night', 'split'],
    shiftStatuses: ['scheduled', 'assigned', 'in-progress', 'completed', 'cancelled'],
    openShiftStatuses: ['open', 'requested', 'assigned', 'filled']
  }
});

// Roster Module Instance
export class RosterModuleInstance {
  private shifts: any[] = [];
  private openShifts: any[] = [];
  private settings: any = {};

  constructor() {
    this.initializeModule();
  }

  private initializeModule() {
    // Initialize module-specific data
    this.settings = rosterModule.data;
    
    // Initialize with mock data
    this.shifts = [
      {
        id: 'shift-1',
        startTime: '08:30',
        endTime: '12:30',
        date: '2024-01-15',
        area: 'Aspire HQ',
        client: '103 Tawa',
        assignedStaff: 'staff-1',
        status: 'assigned',
        notes: 'Morning support shift',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: 'shift-2',
        startTime: '13:00',
        endTime: '17:00',
        date: '2024-01-15',
        area: 'Aspire HQ',
        client: '103 Tawa',
        assignedStaff: 'staff-2',
        status: 'assigned',
        notes: 'Afternoon support shift',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-15')
      }
    ];

    this.openShifts = [
      {
        id: 'open-1',
        startTime: '09:00',
        endTime: '13:00',
        date: '2024-01-15',
        area: 'Aspire HQ',
        client: '105 Johnson',
        requiredRole: 'Support Worker',
        payRate: '$25/hour',
        description: 'Morning support shift for elderly client',
        urgency: 'high',
        status: 'open',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: 'open-2',
        startTime: '14:00',
        endTime: '18:00',
        date: '2024-01-15',
        area: 'Aspire HQ',
        client: '107 Wilson',
        requiredRole: 'Registered Nurse',
        payRate: '$35/hour',
        description: 'Afternoon nursing care for post-surgery client',
        urgency: 'medium',
        status: 'open',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-15')
      }
    ];
  }

  // Get shifts for a specific staff member
  getShiftsForStaff(staffId: string) {
    return this.shifts.filter(shift => shift.assignedStaff === staffId);
  }

  // Get open shifts
  getOpenShifts() {
    return this.openShifts.filter(shift => shift.status === 'open');
  }

  // Get all shifts
  getAllShifts() {
    return this.shifts;
  }

  // Add a new shift
  addShift(shift: any) {
    const newShift = {
      id: `shift-${Date.now()}`,
      ...shift,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.shifts.push(newShift);
    return newShift;
  }

  // Update a shift
  updateShift(id: string, updates: any) {
    const index = this.shifts.findIndex(s => s.id === id);
    if (index !== -1) {
      this.shifts[index] = { ...this.shifts[index], ...updates, updatedAt: new Date() };
      return this.shifts[index];
    }
    return null;
  }

  // Delete a shift
  deleteShift(id: string) {
    const index = this.shifts.findIndex(s => s.id === id);
    if (index !== -1) {
      return this.shifts.splice(index, 1)[0];
    }
    return null;
  }

  // Add an open shift
  addOpenShift(openShift: any) {
    const newOpenShift = {
      id: `open-${Date.now()}`,
      ...openShift,
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.openShifts.push(newOpenShift);
    return newOpenShift;
  }

  // Update an open shift
  updateOpenShift(id: string, updates: any) {
    const index = this.openShifts.findIndex(s => s.id === id);
    if (index !== -1) {
      this.openShifts[index] = { ...this.openShifts[index], ...updates, updatedAt: new Date() };
      return this.openShifts[index];
    }
    return null;
  }

  // Request an open shift
  requestOpenShift(openShiftId: string, staffId: string, reason: string) {
    const openShift = this.openShifts.find(s => s.id === openShiftId);
    if (openShift) {
      openShift.status = 'requested';
      openShift.requestedBy = staffId;
      openShift.requestReason = reason;
      openShift.updatedAt = new Date();
      return openShift;
    }
    return null;
  }

  // Get module settings
  getSettings() {
    return this.settings;
  }

  // Update module settings
  updateSettings(newSettings: any) {
    this.settings = { ...this.settings, ...newSettings };
  }

  // Export module data
  exportData() {
    return {
      shifts: this.shifts,
      openShifts: this.openShifts,
      settings: this.settings,
      timestamp: new Date().toISOString()
    };
  }

  // Import module data
  importData(backup: any) {
    if (backup.shifts) this.shifts = backup.shifts;
    if (backup.openShifts) this.openShifts = backup.openShifts;
    if (backup.settings) this.settings = backup.settings;
  }
}

// Module registration
export const registerRosterModule = () => {
  const { moduleSystem } = require('@/lib/module-system');
  
  // Register the module
  moduleSystem.registerModule(rosterModule);
  
  // Create and register module instance
  const instance = new RosterModuleInstance();
  moduleSystem.loadModuleInstance('roster', instance);
  
  console.log('Roster module registered successfully');
};

// Module unregistration
export const unregisterRosterModule = () => {
  const { moduleSystem } = require('@/lib/module-system');
  
  // Backup module data before unregistering
  const instance = moduleSystem.getModuleInstance('roster');
  if (instance) {
    const backup = instance.exportData();
    console.log('Roster module data backed up:', backup);
  }
  
  // Unregister module
  moduleSystem.unregisterModule('roster');
  
  console.log('Roster module unregistered successfully');
}; 