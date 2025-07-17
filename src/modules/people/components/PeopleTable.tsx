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
import Link from 'next/link';

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

  // Load people data (isolated from other modules) - ONLY CLIENTS
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
      },
      {
        id: 'person-3',
        name: 'Dianne Russell',
        type: 'client',
        status: 'active',
        email: 'd.russell@gmail.com',
        phone: '(229) 555-0109',
        address: '6301 Elgin St. Celina, Delaware, 10299',
        dateOfBirth: '1987-12-03',
        emergencyContact: 'Ms Juliane Cheng',
        notes: 'Client may provide additional documents as test results',
        createdAt: new Date('2024-01-05'),
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
  const canView = true; // Everyone can view

  const handleCreatePerson = (personData: Partial<Person>) => {
    const newPerson: Person = {
      id: `person-${Date.now()}`,
      name: personData.name || '',
      type: 'client', // Always create as client
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
          {filteredPeople.map(person => (
            <TableRow key={person.id}>
              <TableCell>
                <div>
                  <Link 
                    href={`/people/${person.id}`}
                    className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {person.name}
                  </Link>
                  <div className="text-sm text-gray-500">
                    DOB: {person.dateOfBirth ? new Date(person.dateOfBirth).toLocaleDateString() : 'N/A'}
                  </div>
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
                      <Mail className="h-3 w-3 text-gray-400" />
                      <span>{person.email}</span>
                    </div>
                  )}
                  {person.phone && (
                    <div className="flex items-center space-x-1 text-sm">
                      <Phone className="h-3 w-3 text-gray-400" />
                      <span>{person.phone}</span>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-500">
                  {person.createdAt.toLocaleDateString()}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  {canView && (
                    <Link href={`/people/${person.id}`}>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                  {canEdit && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => setSelectedPerson(person)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Create Person Dialog */}
      {canCreate && (
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="hidden">Add Person</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Person</DialogTitle>
            </DialogHeader>
            <PersonForm
              onSubmit={handleCreatePerson}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Person Dialog */}
      {selectedPerson && canEdit && (
        <Dialog open={!!selectedPerson} onOpenChange={() => setSelectedPerson(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Person</DialogTitle>
            </DialogHeader>
            <PersonForm
              person={selectedPerson}
              onSubmit={(updates) => handleUpdatePerson(selectedPerson.id, updates)}
              onCancel={() => setSelectedPerson(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Person Form Component
interface PersonFormProps {
  person?: Person;
  onSubmit: (personData: Partial<Person>) => void;
  onCancel: () => void;
  readOnly?: boolean;
}

function PersonForm({ person, onSubmit, onCancel, readOnly = false }: PersonFormProps) {
  const [formData, setFormData] = useState({
    name: person?.name || '',
    email: person?.email || '',
    phone: person?.phone || '',
    address: person?.address || '',
    dateOfBirth: person?.dateOfBirth || '',
    emergencyContact: person?.emergencyContact || '',
    notes: person?.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
          disabled={readOnly}
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          disabled={readOnly}
        />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          disabled={readOnly}
        />
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
          disabled={readOnly}
        />
      </div>
      <div>
        <Label htmlFor="dateOfBirth">Date of Birth</Label>
        <Input
          id="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
          disabled={readOnly}
        />
      </div>
      <div>
        <Label htmlFor="emergencyContact">Emergency Contact</Label>
        <Input
          id="emergencyContact"
          value={formData.emergencyContact}
          onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact: e.target.value }))}
          disabled={readOnly}
        />
      </div>
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Input
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          disabled={readOnly}
        />
      </div>
      {!readOnly && (
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {person ? 'Update' : 'Create'}
          </Button>
        </div>
      )}
    </form>
  );
} 