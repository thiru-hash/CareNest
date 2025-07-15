/**
 * Database Automation Service
 * 
 * This service handles automatic database table creation when clients
 * add new sections and forms to their CareNest application.
 * 
 * Features:
 * - Automatic table creation based on form fields
 * - Proper data types and constraints
 * - Index creation for performance
 * - Foreign key relationships
 * - Migration tracking
 */

export interface DatabaseField {
  name: string;
  type: 'text' | 'textarea' | 'number' | 'email' | 'phone' | 'date' | 'datetime' | 'select' | 'multiselect' | 'checkbox' | 'radio' | 'file' | 'image' | 'richtext' | 'headline' | 'divider';
  required?: boolean;
  maxLength?: number;
  options?: Array<{ value: string; label: string }>;
  defaultValue?: any;
}

export interface DatabaseTable {
  name: string;
  fields: DatabaseField[];
  indexes?: string[];
  foreignKeys?: Array<{
    field: string;
    references: string;
    onDelete: 'CASCADE' | 'SET NULL' | 'RESTRICT';
  }>;
}

export interface DatabaseMigration {
  id: string;
  tableName: string;
  sql: string;
  executedAt: Date;
  status: 'pending' | 'executed' | 'failed';
  error?: string;
}

export class DatabaseAutomationService {
  private migrations: DatabaseMigration[] = [];

  /**
   * Generate SQL for creating a new table based on form fields
   */
  generateCreateTableSQL(tableName: string, fields: DatabaseField[]): string {
    const sanitizedTableName = this.sanitizeTableName(tableName);
    
    const fieldDefinitions = fields.map(field => {
      const sanitizedFieldName = this.sanitizeFieldName(field.name);
      const fieldType = this.getSQLFieldType(field.type, field.maxLength);
      const constraints = this.getFieldConstraints(field);
      
      return `  ${sanitizedFieldName} ${fieldType}${constraints}`;
    });

    // Add standard system fields
    const systemFields = [
      '  id VARCHAR(36) PRIMARY KEY',
      '  tenant_id VARCHAR(36) NOT NULL',
      '  created_by VARCHAR(36) NOT NULL',
      '  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
      '  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
      '  status ENUM(\'active\', \'inactive\', \'draft\') DEFAULT \'active\'',
      '  INDEX idx_tenant_id (tenant_id)',
      '  INDEX idx_created_by (created_by)',
      '  INDEX idx_status (status)'
    ];

    const allFields = [...systemFields, ...fieldDefinitions];

    return `
CREATE TABLE IF NOT EXISTS ${sanitizedTableName} (
${allFields.join(',\n')}
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `.trim();
  }

  /**
   * Generate SQL for creating indexes based on field types
   */
  generateIndexesSQL(tableName: string, fields: DatabaseField[]): string[] {
    const sanitizedTableName = this.sanitizeTableName(tableName);
    const indexes: string[] = [];

    fields.forEach(field => {
      const sanitizedFieldName = this.sanitizeFieldName(field.name);
      
      // Create indexes for commonly searched fields
      if (['text', 'email', 'phone', 'select'].includes(field.type)) {
        indexes.push(`CREATE INDEX idx_${sanitizedTableName}_${sanitizedFieldName} ON ${sanitizedTableName} (${sanitizedFieldName});`);
      }
      
      // Create full-text indexes for searchable text fields
      if (field.type === 'textarea' || field.type === 'richtext') {
        indexes.push(`CREATE FULLTEXT INDEX idx_${sanitizedTableName}_${sanitizedFieldName}_search ON ${sanitizedTableName} (${sanitizedFieldName});`);
      }
    });

    return indexes;
  }

  /**
   * Generate foreign key constraints
   */
  generateForeignKeysSQL(tableName: string, foreignKeys: Array<{ field: string; references: string; onDelete: 'CASCADE' | 'SET NULL' | 'RESTRICT' }>): string[] {
    const sanitizedTableName = this.sanitizeTableName(tableName);
    const constraints: string[] = [];

    foreignKeys.forEach((fk, index) => {
      const sanitizedFieldName = this.sanitizeFieldName(fk.field);
      const constraintName = `fk_${sanitizedTableName}_${sanitizedFieldName}_${index}`;
      
      constraints.push(`
ALTER TABLE ${sanitizedTableName} 
ADD CONSTRAINT ${constraintName} 
FOREIGN KEY (${sanitizedFieldName}) 
REFERENCES ${fk.references} (id) 
ON DELETE ${fk.onDelete};
      `.trim());
    });

    return constraints;
  }

  /**
   * Execute database creation
   */
  async createDatabaseTable(tableName: string, fields: DatabaseField[], foreignKeys?: Array<{ field: string; references: string; onDelete: 'CASCADE' | 'SET NULL' | 'RESTRICT' }>): Promise<{
    success: boolean;
    sql: string[];
    error?: string;
  }> {
    try {
      const createTableSQL = this.generateCreateTableSQL(tableName, fields);
      const indexesSQL = this.generateIndexesSQL(tableName, fields);
      const foreignKeysSQL = foreignKeys ? this.generateForeignKeysSQL(tableName, foreignKeys) : [];

      const allSQL = [createTableSQL, ...indexesSQL, ...foreignKeysSQL];

      // In a real implementation, you would execute these SQL statements
      // against your database here
      console.log('Executing database creation for table:', tableName);
      console.log('SQL Statements:', allSQL);

      // Simulate database execution
      await this.simulateDatabaseExecution(allSQL);

      // Record migration
      const migration: DatabaseMigration = {
        id: `migration_${Date.now()}`,
        tableName,
        sql: allSQL.join('\n\n'),
        executedAt: new Date(),
        status: 'executed'
      };

      this.migrations.push(migration);

      return {
        success: true,
        sql: allSQL
      };

    } catch (error) {
      console.error('Database creation failed:', error);
      
      const migration: DatabaseMigration = {
        id: `migration_${Date.now()}`,
        tableName,
        sql: '',
        executedAt: new Date(),
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      this.migrations.push(migration);

      return {
        success: false,
        sql: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get SQL field type based on form field type
   */
  private getSQLFieldType(fieldType: string, maxLength?: number): string {
    switch (fieldType) {
      case 'text':
      case 'email':
      case 'phone':
        return maxLength && maxLength <= 255 ? `VARCHAR(${maxLength})` : 'VARCHAR(255)';
      
      case 'textarea':
      case 'richtext':
        return 'TEXT';
      
      case 'number':
        return 'DECIMAL(10,2)';
      
      case 'date':
        return 'DATE';
      
      case 'datetime':
        return 'DATETIME';
      
      case 'select':
      case 'radio':
        return 'VARCHAR(100)';
      
      case 'multiselect':
      case 'checkbox':
        return 'JSON';
      
      case 'file':
      case 'image':
        return 'VARCHAR(500)'; // Store file path/URL
      
      case 'headline':
      case 'divider':
        return 'VARCHAR(255)'; // Store display text
      
      default:
        return 'VARCHAR(255)';
    }
  }

  /**
   * Get field constraints based on field configuration
   */
  private getFieldConstraints(field: DatabaseField): string {
    const constraints: string[] = [];

    if (field.required) {
      constraints.push('NOT NULL');
    }

    if (field.defaultValue !== undefined) {
      if (typeof field.defaultValue === 'string') {
        constraints.push(`DEFAULT '${field.defaultValue}'`);
      } else {
        constraints.push(`DEFAULT ${field.defaultValue}`);
      }
    }

    return constraints.length > 0 ? ` ${constraints.join(' ')}` : '';
  }

  /**
   * Sanitize table name for SQL
   */
  private sanitizeTableName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
  }

  /**
   * Sanitize field name for SQL
   */
  private sanitizeFieldName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
  }

  /**
   * Simulate database execution (replace with real database connection)
   */
  private async simulateDatabaseExecution(sqlStatements: string[]): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In real implementation, you would:
    // 1. Connect to your database
    // 2. Execute each SQL statement
    // 3. Handle transactions and rollbacks
    // 4. Log all operations
    
    console.log('Database execution completed successfully');
  }

  /**
   * Get migration history
   */
  getMigrationHistory(): DatabaseMigration[] {
    return this.migrations;
  }

  /**
   * Rollback last migration
   */
  async rollbackLastMigration(): Promise<boolean> {
    const lastMigration = this.migrations[this.migrations.length - 1];
    
    if (!lastMigration || lastMigration.status !== 'executed') {
      return false;
    }

    try {
      // In real implementation, you would execute DROP TABLE statement
      console.log('Rolling back migration:', lastMigration.id);
      
      lastMigration.status = 'failed';
      return true;
    } catch (error) {
      console.error('Rollback failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const databaseAutomation = new DatabaseAutomationService(); 