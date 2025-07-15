'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { 
  Settings, 
  Zap, 
  Mail, 
  Bell, 
  Calendar, 
  Users, 
  Shield, 
  Clock,
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface Automation {
  id: string;
  name: string;
  description: string;
  type: 'email' | 'notification' | 'compliance' | 'scheduling' | 'reporting';
  status: 'active' | 'inactive' | 'draft';
  clientId?: string;
  trigger: string;
  action: string;
  lastRun?: string;
  nextRun?: string;
  isGlobal: boolean;
}

const mockAutomations: Automation[] = [
  {
    id: '1',
    name: 'Compliance Due Date Alerts',
    description: 'Send email notifications 30 days before compliance items expire',
    type: 'compliance',
    status: 'active',
    trigger: '30 days before expiry',
    action: 'Send email to staff and manager',
    lastRun: '2024-01-15 09:00',
    nextRun: '2024-01-16 09:00',
    isGlobal: true
  },
  {
    id: '2',
    name: 'Shift Reminder Notifications',
    description: 'Send SMS reminders 2 hours before shift start',
    type: 'scheduling',
    status: 'active',
    clientId: 'client-123',
    trigger: '2 hours before shift',
    action: 'Send SMS to staff',
    lastRun: '2024-01-15 07:00',
    nextRun: '2024-01-15 14:00',
    isGlobal: false
  },
  {
    id: '3',
    name: 'Weekly Compliance Report',
    description: 'Generate and email weekly compliance status report',
    type: 'reporting',
    status: 'active',
    trigger: 'Every Monday at 8 AM',
    action: 'Generate PDF report and email to managers',
    lastRun: '2024-01-15 08:00',
    nextRun: '2024-01-22 08:00',
    isGlobal: true
  }
];

export function SystemAutomation() {
  const [automations, setAutomations] = useState<Automation[]>(mockAutomations);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAutomation, setEditingAutomation] = useState<Automation | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const handleCreateAutomation = (automation: Omit<Automation, 'id'>) => {
    const newAutomation: Automation = {
      ...automation,
      id: Date.now().toString(),
      status: 'draft'
    };
    setAutomations(prev => [...prev, newAutomation]);
    setShowCreateForm(false);
  };

  const handleUpdateAutomation = (id: string, updates: Partial<Automation>) => {
    setAutomations(prev => prev.map(automation => 
      automation.id === id ? { ...automation, ...updates } : automation
    ));
    setEditingAutomation(null);
  };

  const handleDeleteAutomation = (id: string) => {
    setAutomations(prev => prev.filter(automation => automation.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    setAutomations(prev => prev.map(automation => 
      automation.id === id 
        ? { ...automation, status: automation.status === 'active' ? 'inactive' : 'active' }
        : automation
    ));
  };

  const filteredAutomations = automations.filter(automation => {
    if (filter === 'all') return true;
    return automation.status === filter;
  });

  const getTypeIcon = (type: Automation['type']) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'notification': return <Bell className="h-4 w-4" />;
      case 'compliance': return <Shield className="h-4 w-4" />;
      case 'scheduling': return <Calendar className="h-4 w-4" />;
      case 'reporting': return <Users className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Automation['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Automation Rules
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Create and manage automated workflows for your organization
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Automation
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All ({automations.length})
        </Button>
        <Button
          variant={filter === 'active' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('active')}
        >
          Active ({automations.filter(a => a.status === 'active').length})
        </Button>
        <Button
          variant={filter === 'inactive' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('inactive')}
        >
          Inactive ({automations.filter(a => a.status === 'inactive').length})
        </Button>
      </div>

      {/* Automation List */}
      <div className="space-y-4">
        {filteredAutomations.map((automation) => (
          <Card key={automation.id} className="border border-gray-200 dark:border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                    {getTypeIcon(automation.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                        {automation.name}
                      </h4>
                      <Badge className={`text-xs ${getStatusColor(automation.status)}`}>
                        {automation.status}
                      </Badge>
                      {automation.isGlobal && (
                        <Badge variant="outline" className="text-xs">
                          Global
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      {automation.description}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Trigger:</span>
                        <span className="ml-1 text-gray-600 dark:text-gray-400">{automation.trigger}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Action:</span>
                        <span className="ml-1 text-gray-600 dark:text-gray-400">{automation.action}</span>
                      </div>
                    </div>
                    {automation.lastRun && (
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Last run: {automation.lastRun} | Next run: {automation.nextRun}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleStatus(automation.id)}
                  >
                    {automation.status === 'active' ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingAutomation(automation)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteAutomation(automation.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Form */}
      {(showCreateForm || editingAutomation) && (
        <Card className="border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg">
              {editingAutomation ? 'Edit Automation' : 'Create New Automation'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AutomationForm
              automation={editingAutomation}
              onSubmit={editingAutomation 
                ? (data) => handleUpdateAutomation(editingAutomation.id, data)
                : handleCreateAutomation
              }
              onCancel={() => {
                setShowCreateForm(false);
                setEditingAutomation(null);
              }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface AutomationFormProps {
  automation?: Automation | null;
  onSubmit: (data: Omit<Automation, 'id'>) => void;
  onCancel: () => void;
}

function AutomationForm({ automation, onSubmit, onCancel }: AutomationFormProps) {
  const [formData, setFormData] = useState({
    name: automation?.name || '',
    description: automation?.description || '',
    type: automation?.type || 'email',
    trigger: automation?.trigger || '',
    action: automation?.action || '',
    isGlobal: automation?.isGlobal || false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Automation Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Compliance Due Date Alerts"
            required
          />
        </div>
        <div>
          <Label htmlFor="type">Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as Automation['type'] }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">Email Notifications</SelectItem>
              <SelectItem value="notification">System Notifications</SelectItem>
              <SelectItem value="compliance">Compliance Alerts</SelectItem>
              <SelectItem value="scheduling">Scheduling</SelectItem>
              <SelectItem value="reporting">Reporting</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe what this automation does..."
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="trigger">Trigger Condition</Label>
          <Input
            id="trigger"
            value={formData.trigger}
            onChange={(e) => setFormData(prev => ({ ...prev, trigger: e.target.value }))}
            placeholder="e.g., 30 days before expiry"
            required
          />
        </div>
        <div>
          <Label htmlFor="action">Action</Label>
          <Input
            id="action"
            value={formData.action}
            onChange={(e) => setFormData(prev => ({ ...prev, action: e.target.value }))}
            placeholder="e.g., Send email to staff"
            required
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isGlobal"
          checked={formData.isGlobal}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isGlobal: checked }))}
        />
        <Label htmlFor="isGlobal">Apply to all clients (Global automation)</Label>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {automation ? 'Update' : 'Create'} Automation
        </Button>
      </div>
    </form>
  );
} 