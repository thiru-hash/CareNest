'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  User,
  Users,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { Label } from '@/components/ui/label';

// Isolated People Module Types
interface Person {
  id: string;
  name: string;
  type: 'client' | 'staff' | 'family' | 'emergency-contact';
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  email?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  emergencyContact?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface PeopleTableProps {
  className?: string;
}

// Module-wide constants for person types and statuses
const personTypes = ['client', 'staff', 'family', 'emergency-contact'];
const statuses = ['active', 'inactive', 'pending', 'suspended'];

export function PeopleTable({ className = '' }: PeopleTableProps) {
  // Mock user for now - in real app this would come from auth context
  const user = { role: 'Manager' };
  const [people, setPeople] = useState<Person[]>([]);
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Load people data (isolated from other modules)
  useEffect(() => {
    // In a real app, this would load from the module's isolated data store
    const mockPeople: Person[] = [
      {
        id: 'person-1',
        name: 'John Smith',
        type: 'client',
        status: 'active',
        email: 'john.smith@email.com',
        phone: '+1 (555) 123-4567',
        address: '123 Main St, Anytown, USA',
        dateOfBirth: '1985-03-15',
        emergencyContact: 'Jane Smith',
        notes: 'Prefers morning appointments',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: 'person-2',
        name: 'Sarah Johnson',
        type: 'staff',
        status: 'active',
        email: 'sarah.johnson@carenest.com',
        phone: '+1 (555) 987-6543',
        address: '456 Oak Ave, Somewhere, USA',
        dateOfBirth: '1990-07-22',
        notes: 'Registered nurse, specializes in elderly care',
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: 'person-3',
        name: 'Michael Chen',
        type: 'client',
        status: 'active',
        email: 'michael.chen@email.com',
        phone: '+1 (555) 456-7890',
        address: '789 Pine Rd, Elsewhere, USA',
        dateOfBirth: '1978-11-08',
        emergencyContact: 'Lisa Chen',
        notes: 'Requires wheelchair access',
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-15')
      }
    ];

    setPeople(mockPeople);
    setFilteredPeople(mockPeople);
  }, []);

  // Filter people (isolated logic)
  useEffect(() => {
    let filtered = people;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(person =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.phone?.includes(searchTerm)
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(person => person.type === typeFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(person => person.status === statusFilter);
    }

    setFilteredPeople(filtered);
  }, [people, searchTerm, typeFilter, statusFilter]);

  // Module-specific permissions (isolated from other modules)
  const canCreate = ['Tenant Admin', 'Manager'].includes(user.role);
  const canEdit = ['Tenant Admin', 'Manager'].includes(user.role);
  const canDelete = ['Tenant Admin'].includes(user.role);

  const handleCreatePerson = (personData: Partial<Person>) => {
    const newPerson: Person = {
      id: `person-${Date.now()}`,
      name: personData.name || '',
      type: personData.type || 'client',
      status: personData.status || 'active',
      email: personData.email,
      phone: personData.phone,
      address: personData.address,
      dateOfBirth: personData.dateOfBirth,
      emergencyContact: personData.emergencyContact,
      notes: personData.notes,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setPeople(prev => [...prev, newPerson]);
    setIsCreateDialogOpen(false);
  };

  const handleUpdatePerson = (id: string, updates: Partial<Person>) => {
    setPeople(prev =>
      prev.map(person =>
        person.id === id
          ? { ...person, ...updates, updatedAt: new Date() }
          : person
      )
    );
    setSelectedPerson(null);
  };

  const handleDeletePerson = (id: string) => {
    setPeople(prev => prev.filter(person => person.id !== id));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'client':
        return 'bg-blue-100 text-blue-800';
      case 'staff':
        return 'bg-green-100 text-green-800';
      case 'family':
        return 'bg-purple-100 text-purple-800';
      case 'emergency-contact':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>People Management</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage clients, staff, and people records
              </p>
            </div>
            {canCreate && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Person
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search people..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {personTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPeople.map((person) => (
                <TableRow key={person.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{person.name}</div>
                      {person.dateOfBirth && (
                        <div className="text-sm text-muted-foreground">
                          DOB: {new Date(person.dateOfBirth).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(person.type)}>
                      {person.type.charAt(0).toUpperCase() + person.type.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(person.status)}>
                      {person.status.charAt(0).toUpperCase() + person.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {person.email && (
                        <div className="flex items-center space-x-1 text-sm">
                          <Mail className="h-3 w-3" />
                          <span>{person.email}</span>
                        </div>
                      )}
                      {person.phone && (
                        <div className="flex items-center space-x-1 text-sm">
                          <Phone className="h-3 w-3" />
                          <span>{person.phone}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {person.createdAt.toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedPerson(person)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {canEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedPerson(person)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {canDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePerson(person.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Person Detail/Edit Dialog */}
      {selectedPerson && (
        <Dialog open={!!selectedPerson} onOpenChange={() => setSelectedPerson(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {canEdit ? 'Edit Person' : 'Person Details'}
              </DialogTitle>
            </DialogHeader>
            <PersonForm
              person={selectedPerson}
              onSubmit={(updates) => handleUpdatePerson(selectedPerson.id, updates)}
              onCancel={() => setSelectedPerson(null)}
              readOnly={!canEdit}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Create Person Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Person</DialogTitle>
          </DialogHeader>
          <PersonForm
            onSubmit={handleCreatePerson}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Isolated Person Form Component
interface PersonFormProps {
  person?: Person;
  onSubmit: (personData: Partial<Person>) => void;
  onCancel: () => void;
  readOnly?: boolean;
}

function PersonForm({ person, onSubmit, onCancel, readOnly = false }: PersonFormProps) {
  const [formData, setFormData] = useState<Partial<Person>>(
    person || {
      name: '',
      type: 'client',
      status: 'active',
      email: '',
      phone: '',
      address: '',
      dateOfBirth: '',
      emergencyContact: '',
      notes: ''
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Name *</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
            disabled={readOnly}
          />
        </div>
        <div>
          <Label>Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}
            disabled={readOnly}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {personTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            value={formData.email || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            disabled={readOnly}
          />
        </div>
        <div>
          <Label>Phone</Label>
          <Input
            value={formData.phone || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            disabled={readOnly}
          />
        </div>
        <div>
          <Label>Date of Birth</Label>
          <Input
            type="date"
            value={formData.dateOfBirth || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
            disabled={readOnly}
          />
        </div>
        <div>
          <Label>Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}
            disabled={readOnly}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statuses.map(status => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label>Address</Label>
        <Input
          value={formData.address || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
          disabled={readOnly}
        />
      </div>
      <div>
        <Label>Emergency Contact</Label>
        <Input
          value={formData.emergencyContact || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact: e.target.value }))}
          disabled={readOnly}
        />
      </div>
      <div>
        <Label>Notes</Label>
        <textarea
          value={formData.notes || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          className="w-full p-2 border rounded-md"
          rows={3}
          disabled={readOnly}
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        {!readOnly && (
          <Button type="submit">
            {person ? 'Update Person' : 'Create Person'}
          </Button>
        )}
      </div>
    </form>
  );
} 