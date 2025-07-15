'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Printer,
  MoreHorizontal,
  Download,
  Upload,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  UserCheck,
  Clock,
  Star
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FormBuilder } from '@/components/settings/FormBuilder';
import { staffFormConfig, staffViewFormConfig } from '@/lib/data/forms';
import { StaffTableClient } from '@/components/staff/StaffTableClient';
import { getCurrentUser } from '@/lib/auth';
import { mockStaff } from '@/lib/data';

interface StaffMember {
  id: string;
  uid: string;
  profilePicture?: string;
  preferredName: string;
  surname: string;
  birthDate?: string;
  companyEmail?: string;
  startDate?: string;
  employmentType?: string;
  payEquity: string;
  payEquityQualification?: string;
  longServiceDetails?: string;
  author: string;
  status: 'Active' | 'Inactive' | 'Archive' | 'Applicant' | 'Referral';
  area?: string;
  phone?: string;
  address?: string;
  emergencyContact?: string;
  skills?: string[];
  certifications?: string[];
  performanceRating?: number;
  lastActive?: string;
}

// Mock data for the old staff system
const mockStaffData: StaffMember[] = [
  {
    id: 'staff-1',
    uid: 'SW001',
    preferredName: 'Jane',
    surname: 'Doe',
    birthDate: '1992-05-20',
    companyEmail: 'jane.doe@carenest.com',
    startDate: '2021-03-15',
    employmentType: 'Full-time',
    payEquity: 'Level 3 Pay rate',
    author: 'System Admin',
    status: 'Active',
    area: 'ACC',
    phone: '+64 21 123 4567',
    address: '123 Support Street, Caretown',
    emergencyContact: 'John Doe - +64 21 987 6543',
    skills: ['First Aid', 'Manual Handling', 'Communication'],
    certifications: ['First Aid Certificate', 'Manual Handling Training'],
    performanceRating: 4.5,
    lastActive: '2024-01-15T10:30:00Z'
  },
  {
    id: 'staff-2',
    uid: 'SW002',
    preferredName: 'John',
    surname: 'Smith',
    birthDate: '1988-11-15',
    companyEmail: 'john.smith@carenest.com',
    startDate: '2022-07-22',
    employmentType: 'Part-time',
    payEquity: 'Level 0 Pay rate',
    author: 'System Admin',
    status: 'Active',
    area: 'Training',
    phone: '+64 21 234 5678',
    address: '456 Helper Avenue, Communityville',
    emergencyContact: 'Mary Smith - +64 21 876 5432',
    skills: ['Patient Care', 'Documentation', 'Team Work'],
    certifications: ['Patient Care Certificate'],
    performanceRating: 4.2,
    lastActive: '2024-01-14T16:45:00Z'
  }
];

export default function StaffPage() {
  const [staffData, setStaffData] = useState<StaffMember[]>(mockStaffData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Any Status');
  const [areaFilter, setAreaFilter] = useState('Any Area');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [addStaffDialogOpen, setAddStaffDialogOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Mock current user for the StaffTableClient
  const currentUser = {
    id: 'staff-admin',
    name: 'Admin User',
    email: 'admin@carenest.com',
    role: 'System Admin' as const
  };

  const filteredStaff = staffData.filter(staff => {
    const matchesSearch = 
      staff.preferredName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.uid.includes(searchTerm) ||
      staff.companyEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'Any Status' || staff.status === statusFilter;
    const matchesArea = areaFilter === 'Any Area' || staff.area === areaFilter;
    
    return matchesSearch && matchesStatus && matchesArea;
  });

  const totalPages = Math.ceil(filteredStaff.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentStaff = filteredStaff.slice(startIndex, endIndex);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'Inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      case 'Archive':
        return <Badge className="bg-red-100 text-red-800">Archive</Badge>;
      case 'Applicant':
        return <Badge className="bg-blue-100 text-blue-800">Applicant</Badge>;
      case 'Referral':
        return <Badge className="bg-purple-100 text-purple-800">Referral</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const handleAddStaff = (formData: any) => {
    const newStaff: StaffMember = {
      id: `staff-${Date.now()}`,
      uid: `SW${String(Date.now()).slice(-3)}`,
      preferredName: formData.preferredName || 'New',
      surname: formData.surname || 'Staff',
      birthDate: formData.birthDate,
      companyEmail: formData.companyEmail,
      startDate: formData.startDate,
      employmentType: formData.employmentType || 'Full-time',
      payEquity: formData.payEquity || 'Level 0 Pay rate',
      author: 'System Admin',
      status: 'Active',
      area: formData.area,
      phone: formData.phone,
      address: formData.address,
      emergencyContact: formData.emergencyContact,
      skills: formData.skills ? formData.skills.split(',').map((s: string) => s.trim()) : [],
      certifications: formData.certifications ? formData.certifications.split(',').map((c: string) => c.trim()) : [],
      performanceRating: 0,
      lastActive: new Date().toISOString()
    };

    setStaffData(prev => [newStaff, ...prev]);
    setAddStaffDialogOpen(false);
  };

  const getPerformanceColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-yellow-600';
    if (rating >= 3.5) return 'text-orange-600';
    return 'text-red-600';
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === currentStaff.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(currentStaff.map(staff => staff.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl lg:text-3xl font-bold text-left">Staff Management</h1>
        <p className="text-muted-foreground text-left">Manage staff members and their information</p>
      </div>

      {/* Use the new StaffTableClient component */}
      <StaffTableClient 
        staffToDisplay={mockStaff} 
        currentUser={currentUser}
      />

      {/* Legacy Staff Table (keeping for reference) */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Legacy Staff Records</CardTitle>
              <CardDescription>
                Original staff records using the old data structure
              </CardDescription>
            </div>
            <Button onClick={() => setAddStaffDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Staff
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search staff..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Any Status">Any Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Archive">Archive</SelectItem>
                    <SelectItem value="Applicant">Applicant</SelectItem>
                    <SelectItem value="Referral">Referral</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={areaFilter} onValueChange={setAreaFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Any Area">Any Area</SelectItem>
                    <SelectItem value="ACC">ACC</SelectItem>
                    <SelectItem value="Training">Training</SelectItem>
                    <SelectItem value="EGL">EGL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Staff Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="text-xs text-muted-foreground border-b">
                    <th className="py-2 px-2">
                      <input
                        type="checkbox"
                        checked={selectedRows.length === currentStaff.length && currentStaff.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded"
                      />
                    </th>
                    <th className="py-2 px-2">Staff</th>
                    <th className="py-2 px-2">Contact</th>
                    <th className="py-2 px-2">Employment</th>
                    <th className="py-2 px-2">Performance</th>
                    <th className="py-2 px-2">Status</th>
                    <th className="py-2 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentStaff.map((staff, idx) => (
                    <tr key={staff.id} className={
                      `align-middle ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b last:border-0`
                    }>
                      <td className="py-2 px-2">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(staff.id)}
                          onChange={() => toggleSelectRow(staff.id)}
                          className="rounded"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={staff.profilePicture} alt={`${staff.preferredName} ${staff.surname}`} />
                            <AvatarFallback>{staff.preferredName.charAt(0)}{staff.surname.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-gray-900">{staff.preferredName} {staff.surname}</div>
                            <div className="text-xs text-muted-foreground">UID: {staff.uid}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900">{staff.companyEmail || 'No email'}</div>
                        <div className="text-sm text-gray-500">{staff.phone || 'No phone'}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900">{staff.employmentType || 'Not specified'}</div>
                        <div className="text-sm text-gray-500">{staff.area || 'No area assigned'}</div>
                      </td>
                      <td className="px-4 py-3">
                        {staff.performanceRating ? (
                          <div className="flex items-center space-x-2">
                            <Star className={`h-4 w-4 ${getPerformanceColor(staff.performanceRating)}`} />
                            <span className={`text-sm font-medium ${getPerformanceColor(staff.performanceRating)}`}>
                              {staff.performanceRating}/5.0
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">No rating</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(staff.status)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedStaff(staff)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="outline">
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="h-3 w-3 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Printer className="h-3 w-3 mr-2" />
                                Print
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Download className="h-3 w-3 mr-2" />
                                Export
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredStaff.length)} of {filteredStaff.length} entries
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              );
            })}
            {totalPages > 5 && (
              <>
                <span className="px-2">...</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                >
                  {totalPages}
                </Button>
              </>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Add Staff Dialog */}
      <Dialog open={addStaffDialogOpen} onOpenChange={setAddStaffDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Staff Record</DialogTitle>
          </DialogHeader>
          <FormBuilder 
            key="add-staff-form"
            form={staffFormConfig} 
            onSubmit={handleAddStaff} 
          />
        </DialogContent>
      </Dialog>

      {/* View Staff Dialog */}
      {selectedStaff && (
        <Dialog open={!!selectedStaff} onOpenChange={() => setSelectedStaff(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Staff Details - {selectedStaff.preferredName} {selectedStaff.surname}</DialogTitle>
            </DialogHeader>
            <ViewStaffFormWithDynamicForm staff={selectedStaff} onClose={() => setSelectedStaff(null)} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// View Staff Form Component with Dynamic Form
function ViewStaffFormWithDynamicForm({ staff, onClose }: { staff: StaffMember; onClose: () => void }) {
  const initialFormData = useMemo(() => ({
    preferredName: staff.preferredName,
    surname: staff.surname,
    birthDate: staff.birthDate,
    companyEmail: staff.companyEmail,
    phone: staff.phone,
    address: staff.address,
    emergencyContact: staff.emergencyContact,
    startDate: staff.startDate,
    employmentType: staff.employmentType,
    payEquity: staff.payEquity,
    area: staff.area
  }), [staff]);

    return (
    <div className="space-y-6">
      {/* Header with Avatar */}
      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
        {staff.profilePicture ? (
          <Avatar className="h-16 w-16">
            <AvatarImage src={staff.profilePicture} alt={staff.preferredName} />
            <AvatarFallback className="text-lg font-semibold">
              {staff.preferredName.charAt(0)}{staff.surname.charAt(0)}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-lg font-semibold text-white">
              {staff.preferredName.charAt(0)}{staff.surname.charAt(0)}
            </span>
          </div>
        )}
        <div>
          <h2 className="text-2xl font-bold">{staff.preferredName} {staff.surname}</h2>
          <p className="text-gray-600">UID: {staff.uid}</p>
          <div className="flex items-center space-x-2 mt-2">
            {getStatusBadge(staff.status)}
            {staff.performanceRating && (
              <div className="flex items-center space-x-1">
                <Star className={`h-4 w-4 ${getPerformanceColor(staff.performanceRating)}`} />
                <span className={`text-sm font-medium ${getPerformanceColor(staff.performanceRating)}`}>
                  {staff.performanceRating}/5.0
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Form for Staff Details */}
      <FormBuilder 
        key={`view-staff-form-${staff.id}`}
        form={staffViewFormConfig} 
        initialData={initialFormData}
        readonly={true}
      />

      {/* Skills and Certifications */}
      {staff.skills && staff.skills.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Skills & Certifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {staff.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Certifications</h4>
              <div className="flex flex-wrap gap-2">
                {staff.certifications?.map((cert, index) => (
                  <Badge key={index} variant="outline">
                    {cert}
                  </Badge>
                )) || <span className="text-gray-500">No certifications</span>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pay Equity Qualification */}
      {staff.payEquityQualification && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Pay Equity Qualification</h3>
          <a href="#" className="text-blue-600 hover:text-blue-800 underline">
            {staff.payEquityQualification}
          </a>
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
}
