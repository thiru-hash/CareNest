import { createIsolatedModule } from '@/lib/module-system';

// Finance Module - Completely isolated from other modules
export const financeModule = createIsolatedModule({
  id: 'finance',
  name: 'Finance Management',
  version: '1.0.0',
  description: 'Manage financial records, transactions, and billing',
  author: 'CareNest Team',
  dependencies: [], // No dependencies - completely isolated
  routes: [
    {
      path: '/finance',
      component: 'FinancePage',
      permissions: ['Tenant Admin', 'Finance Admin'],
      metadata: {
        title: 'Finance',
        description: 'Manage financial records'
      }
    },
    {
      path: '/finance/transactions',
      component: 'TransactionsPage',
      permissions: ['Tenant Admin', 'Finance Admin'],
      metadata: {
        title: 'Transactions',
        description: 'View financial transactions'
      }
    },
    {
      path: '/finance/billing',
      component: 'BillingPage',
      permissions: ['Tenant Admin', 'Finance Admin'],
      metadata: {
        title: 'Billing',
        description: 'Manage billing and invoices'
      }
    }
  ],
  components: [
    {
      id: 'FinanceOverview',
      name: 'Finance Overview',
      type: 'component',
      permissions: ['Tenant Admin', 'Finance Admin'],
      dependencies: []
    },
    {
      id: 'TransactionTable',
      name: 'Transaction Table',
      type: 'component',
      permissions: ['Tenant Admin', 'Finance Admin'],
      dependencies: []
    },
    {
      id: 'BillingForm',
      name: 'Billing Form',
      type: 'form',
      permissions: ['Tenant Admin', 'Finance Admin'],
      dependencies: []
    }
  ],
  hooks: [
    {
      id: 'beforeTransactionCreate',
      name: 'Before Transaction Create',
      type: 'before',
      permissions: ['Tenant Admin', 'Finance Admin']
    },
    {
      id: 'afterTransactionUpdate',
      name: 'After Transaction Update',
      type: 'after',
      permissions: ['Tenant Admin', 'Finance Admin']
    }
  ],
  permissions: {
    view: ['Tenant Admin', 'Finance Admin'],
    create: ['Tenant Admin', 'Finance Admin'],
    edit: ['Tenant Admin', 'Finance Admin'],
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
    transactionTypes: ['income', 'expense', 'refund', 'adjustment'],
    categories: ['care-services', 'medication', 'equipment', 'transportation', 'administration'],
    paymentMethods: ['cash', 'card', 'bank-transfer', 'insurance', 'medicare'],
    currencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD']
  }
});

// Finance Module Instance
export class FinanceModuleInstance {
  private transactions: any[] = [];
  private settings: any = {};

  constructor() {
    this.initializeModule();
  }

  private initializeModule() {
    // Initialize module-specific data
    this.transactions = [];
    this.settings = financeModule.data;
  }

  // Module-specific methods that don't affect other modules
  getTransactions() {
    return this.transactions;
  }

  addTransaction(transaction: any) {
    const newTransaction = {
      id: `transaction-${Date.now()}`,
      ...transaction,
      createdAt: new Date()
    };
    this.transactions.push(newTransaction);
    return newTransaction;
  }

  updateTransaction(id: string, updates: any) {
    const index = this.transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      this.transactions[index] = { ...this.transactions[index], ...updates, updatedAt: new Date() };
      return this.transactions[index];
    }
    return null;
  }

  deleteTransaction(id: string) {
    const index = this.transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      return this.transactions.splice(index, 1)[0];
    }
    return null;
  }

  getTransaction(id: string) {
    return this.transactions.find(t => t.id === id);
  }

  // Module-specific calculations (isolated from other modules)
  calculateTotalIncome() {
    return this.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
  }

  calculateTotalExpenses() {
    return this.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
  }

  calculateNetProfit() {
    return this.calculateTotalIncome() - this.calculateTotalExpenses();
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
      transactions: this.transactions,
      settings: this.settings,
      timestamp: new Date().toISOString()
    };
  }

  // Import module data (for backup/restore)
  importData(backup: any) {
    if (backup.transactions) this.transactions = backup.transactions;
    if (backup.settings) this.settings = backup.settings;
  }
}

// Module registration
export const registerFinanceModule = () => {
  const { moduleSystem } = require('@/lib/module-system');
  
  // Register the module
  moduleSystem.registerModule(financeModule);
  
  // Create and register module instance
  const instance = new FinanceModuleInstance();
  moduleSystem.loadModuleInstance('finance', instance);
  
  console.log('Finance module registered successfully');
};

// Module unregistration
export const unregisterFinanceModule = () => {
  const { moduleSystem } = require('@/lib/module-system');
  
  // Backup module data before unregistering
  const instance = moduleSystem.getModuleInstance('finance');
  if (instance) {
    const backup = instance.exportData();
    // Store backup somewhere if needed
    console.log('Finance module data backed up:', backup);
  }
  
  // Unregister module
  moduleSystem.unregisterModule('finance');
  
  console.log('Finance module unregistered successfully');
}; 