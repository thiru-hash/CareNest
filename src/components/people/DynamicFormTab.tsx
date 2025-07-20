'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Eye, Trash2, Save, FileText, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { DynamicFormRenderer } from './DynamicFormRenderer';
import { getFormConfig } from '@/lib/formConfig';

interface FormRecord {
  id: string;
  formId: string;
  clientId: string;
  data: { [key: string]: any };
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  submittedBy?: string;
}

interface DynamicFormTabProps {
  tabId: string;
  tabName: string;
  formId?: string;
  clientId: string;
  clientName: string;
}

export function DynamicFormTab({ 
  tabId, 
  tabName, 
  formId, 
  clientId, 
  clientName 
}: DynamicFormTabProps) {
  const [records, setRecords] = useState<FormRecord[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<FormRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Get form configuration
  const formConfig = useMemo(() => {
    return formId ? getFormConfig(formId) : undefined;
  }, [formId]);

  // Get table columns from form config
  const tableColumns = useMemo(() => {
    if (!formConfig?.displayOptions?.tableColumns) {
      return ['Date', 'Status', 'Submitted By', 'Updated'];
    }
    
    return [
      ...formConfig.displayOptions.tableColumns.map(col => {
        const field = formConfig.fields.find(f => f.name === col);
        return field?.label || col;
      }),
      'Status',
      'Submitted By',
      'Updated'
    ];
  }, [formConfig]);

  // Load existing records for this tab
  useEffect(() => {
    const loadRecords = async () => {
      setIsLoading(true);
      try {
        // Mock data - in real app this would fetch from database
        const mockRecords: FormRecord[] = [
          {
            id: 'record-1',
            formId: formId || '',
            clientId,
            data: {
              goal_title: 'Improve Mobility',
              goal_description: 'Work on walking independently with support',
              target_date: '2024-06-15',
              status: 'in_progress',
              progress_notes: 'Making good progress with physical therapy',
              responsible_staff: 'Sarah Johnson',
              is_active: true
            },
            status: 'submitted',
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-01-15T10:30:00Z',
            submittedBy: 'John Smith'
          },
          {
            id: 'record-2',
            formId: formId || '',
            clientId,
            data: {
              goal_title: 'Social Skills Development',
              goal_description: 'Participate in group activities and make friends',
              target_date: '2024-08-20',
              status: 'not_started',
              progress_notes: 'Ready to start social skills program',
              responsible_staff: 'Mike Wilson',
              is_active: true
            },
            status: 'draft',
            createdAt: '2024-01-10T14:35:00Z',
            updatedAt: '2024-01-10T14:35:00Z',
            submittedBy: 'Sarah Johnson'
          }
        ];

        setRecords(mockRecords);
      } catch (error) {
        console.error('Error loading records:', error);
        toast({
          title: 'Error',
          description: 'Failed to load records',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (formId) {
      loadRecords();
    }
  }, [formId, clientId]); // Removed toast from dependencies

  const handleAddNew = () => {
    setCurrentRecord(null);
    setIsFormOpen(true);
  };

  const handleEditRecord = (record: FormRecord) => {
    setCurrentRecord(record);
    setIsFormOpen(true);
  };

  const handleViewRecord = (record: FormRecord) => {
    setCurrentRecord(record);
    setIsFormOpen(true);
  };

  const handleDeleteRecord = async (recordId: string) => {
    try {
      // Mock API call - in real app this would delete from database
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setRecords(prev => prev.filter(record => record.id !== recordId));
      
      toast({
        title: 'Success',
        description: 'Record deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting record:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete record',
        variant: 'destructive'
      });
    }
  };

  const handleFormSubmit = async (formData: { [key: string]: any }, action: 'save' | 'submit' | 'draft') => {
    try {
      const now = new Date().toISOString();
      const newRecord: FormRecord = {
        id: currentRecord?.id || `record-${Date.now()}`,
        formId: formId || '',
        clientId,
        data: formData,
        status: action === 'submit' ? 'submitted' : action === 'draft' ? 'draft' : 'submitted',
        createdAt: currentRecord?.createdAt || now,
        updatedAt: now,
        submittedBy: 'Current User' // In real app this would be the actual user
      };

      if (currentRecord) {
        // Update existing record
        setRecords(prev => prev.map(record => 
          record.id === currentRecord.id ? newRecord : record
        ));
      } else {
        // Add new record
        setRecords(prev => [...prev, newRecord]);
      }

      setIsFormOpen(false);
      setCurrentRecord(null);

      const actionText = action === 'submit' ? 'submitted' : action === 'draft' ? 'saved as draft' : 'saved';
      toast({
        title: 'Success',
        description: `Record ${actionText} successfully`,
      });
    } catch (error) {
      console.error('Error saving record:', error);
      toast({
        title: 'Error',
        description: 'Failed to save record',
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: 'Draft', variant: 'secondary' as const },
      submitted: { label: 'Submitted', variant: 'default' as const },
      approved: { label: 'Approved', variant: 'default' as const },
      rejected: { label: 'Rejected', variant: 'destructive' as const }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderTableCell = (record: FormRecord, column: string) => {
    if (column === 'Status') {
      return getStatusBadge(record.status);
    }
    if (column === 'Submitted By') {
      return record.submittedBy || 'Unknown';
    }
    if (column === 'Updated') {
      return formatDate(record.updatedAt);
    }
    if (column === 'Date') {
      return formatDate(record.createdAt);
    }
    
    // For form data columns, find the field name and get the value
    const fieldName = formConfig?.displayOptions?.tableColumns?.find((_, index) => {
      const field = formConfig.fields.find(f => f.name === _);
      return field?.label === column;
    });
    
    if (fieldName && record.data[fieldName] !== undefined) {
      const value = record.data[fieldName];
      
      // Handle boolean values
      if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No';
      }
      
      // Handle date values
      if (fieldName.includes('date') || fieldName.includes('Date')) {
        return new Date(value).toLocaleDateString();
      }
      
      return value;
    }
    
    return '-';
  };

  if (!formId) {
    return (
      <Card className="border-0 shadow-none">
        <CardHeader className="px-0 pt-0 pb-4">
          <CardTitle className="text-lg">{tabName}</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              No form assigned to this tab. Configure in System Settings > Sections.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Go to Settings → Sections → Edit "People We Support" → Add tabs and assign forms.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Check if form configuration exists
  if (!formConfig) {
    return (
      <Card className="border-0 shadow-none">
        <CardHeader className="px-0 pt-0 pb-4">
          <CardTitle className="text-lg">{tabName}</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              This form hasn't been configured yet. Please check the Form Settings.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Form ID: {formId}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-0 shadow-none">
        <CardHeader className="px-0 pt-0 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{tabName}</CardTitle>
            <Button onClick={handleAddNew} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add New
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Loading records...</div>
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No records found</p>
              <p className="text-sm text-gray-400 mt-2">
                Click "Add New" to create your first record
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    {tableColumns.map((column) => (
                      <TableHead key={column}>{column}</TableHead>
                    ))}
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record) => (
                    <TableRow key={record.id}>
                      {tableColumns.map((column) => (
                        <TableCell key={column}>
                          {renderTableCell(record, column)}
                        </TableCell>
                      ))}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewRecord(record)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditRecord(record)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteRecord(record.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {currentRecord ? 'Edit Record' : 'Add New Record'} - {tabName}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <DynamicFormRenderer
              formId={formId}
              clientId={clientId}
              mode="edit"
              initialData={currentRecord?.data}
              onSubmit={handleFormSubmit}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 