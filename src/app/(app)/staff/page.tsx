'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

const mockStaffData: StaffMember[] = [
  {
    id: '1',
    uid: '668135',
    preferredName: 'Denton',
    surname: 'KUKA',
    birthDate: '01/07/2002',
    employmentType: 'Full-Time',
    payEquity: 'Level 0 Pay rate',
    author: 'Celene PILLAY',
    status: 'Active',
    area: 'ACC',
    phone: '+64 21 123 4567',
    address: 'Wellington, New Zealand',
    emergencyContact: 'Jane Kuka (+64 21 987 6543)',
    skills: ['Personal Care', 'Medication Management', 'First Aid'],
    certifications: ['Level 3 Health & Wellbeing'],
    performanceRating: 4.5,
    lastActive: '2 hours ago'
  },
  {
    id: '2',
    uid: '668107',
    preferredName: 'Abosede',
    surname: 'ALEX',
    startDate: '14/07/2025',
    employmentType: 'Full-Time',
    payEquity: 'Level 0 Pay rate',
    author: 'Celene PILLAY',
    status: 'Active',
    area: 'Aspire HQ (103 Tawa)',
    phone: '+64 22 234 5678',
    address: 'Auckland, New Zealand',
    emergencyContact: 'John Alex (+64 22 876 5432)',
    skills: ['Support Work', 'Community Access', 'Behavioral Support'],
    certifications: ['Level 4 Disability Support'],
    performanceRating: 4.8,
    lastActive: '1 day ago'
  },
  {
    id: '3',
    uid: '667775',
    profilePicture: '/api/placeholder/40/40',
    preferredName: 'Sharmaine',
    surname: 'MARTIN',
    birthDate: '30/04/1965',
    startDate: '07/07/2025',
    employmentType: 'Full-Time',
    payEquity: 'Level 4 b Pay rate',
    payEquityQualification: 'Certificate-707102117-0001.pdf',
    author: 'Celene PILLAY',
    status: 'Active',
    area: 'Training',
    phone: '+64 23 345 6789',
    address: 'Christchurch, New Zealand',
    emergencyContact: 'Mike Martin (+64 23 765 4321)',
    skills: ['Training', 'Mentoring', 'Assessment'],
    certifications: ['Level 4 Training & Assessment', 'First Aid Instructor'],
    performanceRating: 4.9,
    lastActive: '30 minutes ago'
  },
  {
    id: '4',
    uid: '665374',
    profilePicture: '/api/placeholder/40/40',
    preferredName: 'Pooja',
    surname: 'BABU',
    birthDate: '14/09/1997',
    startDate: '07/07/2025',
    employmentType: 'Full-Time',
    payEquity: 'Level 4 b Pay rate',
    payEquityQualification: 'Certificate-704141837-0001.pdf',
    author: 'Kaye Morley',
    status: 'Active',
    area: 'EGL',
    phone: '+64 24 456 7890',
    address: 'Hamilton, New Zealand',
    emergencyContact: 'Raj Babu (+64 24 654 3210)',
    skills: ['Nursing Care', 'Wound Care', 'Medication Administration'],
    certifications: ['Registered Nurse', 'Level 4 Health & Wellbeing'],
    performanceRating: 4.7,
    lastActive: '3 hours ago'
  },
  {
    id: '5',
    uid: '664235',
    profilePicture: '/api/placeholder/40/40',
    preferredName: 'Wairua',
    surname: 'PRITCHARD',
    birthDate: '21/02/2005',
    startDate: '07/07/2025',
    employmentType: 'Full-Time',
    payEquity: 'Level 0 Pay rate',
    author: 'Celene PILLAY',
    status: 'Active',
    area: '1 Holly Place',
    phone: '+64 25 567 8901',
    address: 'Tauranga, New Zealand',
    emergencyContact: 'Hine Pritchard (+64 25 543 2109)',
    skills: ['Youth Support', 'Recreation', 'Life Skills'],
    certifications: ['Youth Work Certificate'],
    performanceRating: 4.2,
    lastActive: '5 hours ago'
  }
];

const areas = [
  'Any Area',
  'ACC',
  'Aspire HQ (103 Tawa)',
  'Training',
  'EGL',
  '1 Holly Place',
  '1 Waikaka Place (46 Maggie Place)',
  '11 Nevada Road',
  '11/13 Anglesea Street',
  '12 Stratford Place',
  '122 Mardon Road',
  '13 Allgood Place',
  '15 Bremworth Avenue',
  '16 Lindsay Crescent',
  '18 Poaka Ave',
  '20 Sirius Crescent',
  '23 Chalgrove Road',
  '235 Clarkin Road',
  '250 Tramway Road',
  '3 Hancock Drive (41 Ravenscourt Place)',
  '34 Chequers Avenue',
  '39 Somerton Drive',
  '4 Poaka Avenue',
  '4 Shrule Place',
  '40 Barrington Drive',
  '41 The Esplanade',
  '43 Ravenscourt Place',
  '55 Moonlight Drive',
  '64 Horsham Downs',
  '78 Palmerston Street',
  '90 Lake Road (EGL)',
  '93 Clarence Street',
  'Flat 1/90 Lake Road',
  'Flat 2/90 Lake Road',
  'Flat 3/90 Lake Road',
  'Flat 4/90 Lake Road',
  'Flat 5/90 Lake Road',
  'Flat4 - Anglesea(ZF)',
  'Very High Needs (VHN)',
  'Volunteer',
  'Supported Independent Living',
  '31 Bellona Place',
  '36 Saxbys Road',
  '41 Maanihi Drive',
  '8 Farringdon Avenue',
  'Transition',
  '1 Bayswater Court',
  '1 Dalmont Place',
  '23 Moonlight Drive',
  '232 Thomas Road',
  '36 Winslow Court',
  '43A Burns Street',
  '57 Barrington Drive',
  '9 Glenwarrick Court'
];

const statuses = [
  'Any Status',
  'Active',
  'Archive',
  'Applicant',
  'Referral',
  'Inactive'
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
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case 'Inactive':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Inactive</Badge>;
      case 'Archive':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Archive</Badge>;
      case 'Applicant':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Applicant</Badge>;
      case 'Referral':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Referral</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">{status}</Badge>;
    }
  };

  const handleAddStaff = (formData: any) => {
    const newStaff: StaffMember = {
      id: Date.now().toString(),
      uid: (Math.floor(Math.random() * 900000) + 100000).toString(),
      preferredName: formData.preferredName,
      surname: formData.surname,
      birthDate: formData.birthDate,
      companyEmail: formData.companyEmail,
      phone: formData.phone,
      address: formData.address,
      emergencyContact: formData.emergencyContact,
      startDate: formData.startDate,
      employmentType: formData.employmentType,
      payEquity: formData.payEquity,
      area: formData.area,
      skills: formData.skills ? formData.skills.split(',').map((s: string) => s.trim()) : [],
      certifications: formData.certifications ? formData.certifications.split(',').map((c: string) => c.trim()) : [],
      author: 'Current User',
      status: 'Active'
    };
    
    setStaffData([newStaff, ...staffData]);
    setAddStaffDialogOpen(false);
  };

  const getPerformanceColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-blue-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Bulk selection logic
  const isAllSelected = currentStaff.length > 0 && currentStaff.every(staff => selectedRows.includes(staff.id));
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRows(selectedRows.filter(id => !currentStaff.some(staff => staff.id === id)));
    } else {
      setSelectedRows([...selectedRows, ...currentStaff.filter(staff => !selectedRows.includes(staff.id)).map(staff => staff.id)]);
    }
  };
  const toggleSelectRow = (id: string) => {
    setSelectedRows(selectedRows.includes(id) ? selectedRows.filter(rowId => rowId !== id) : [...selectedRows, id]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Staff Management</h1>
          <p className="text-muted-foreground">All Staff Records in System</p>
        </div>
        <Button onClick={() => setAddStaffDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Staff
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              {/* Entries per page */}
              <div className="flex items-center space-x-2">
                <Label htmlFor="entries" className="text-sm">Show</Label>
                <Select value={entriesPerPage.toString()} onValueChange={(value) => setEntriesPerPage(Number(value))}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm">entries</span>
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Area Filter */}
              <div className="flex items-center space-x-2">
                <Select value={areaFilter} onValueChange={setAreaFilter}>
                  <SelectTrigger className="w-60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {areas.map(area => (
                      <SelectItem key={area} value={area}>{area}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Search */}
            <div className="flex items-center space-x-2 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search staff..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full lg:w-64"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Staff Table Only */}
      <Card className="overflow-x-auto">
        <CardContent className="p-0">
          <table className="w-full min-w-[900px] border-separate border-spacing-0">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-20">
                  <input type="checkbox" checked={isAllSelected} onChange={toggleSelectAll} aria-label="Select all" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-12 bg-gray-50 z-10">Staff Member</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employment</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 sticky left-0 bg-white z-10">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(staff.id)}
                      onChange={() => toggleSelectRow(staff.id)}
                      aria-label={`Select ${staff.preferredName} ${staff.surname}`}
                    />
                  </td>
                  <td className="px-4 py-3 sticky left-12 bg-white z-10">
                    <div className="flex items-center space-x-3">
                      {staff.profilePicture ? (
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={staff.profilePicture} alt={staff.preferredName} />
                          <AvatarFallback className="text-sm">
                            {staff.preferredName.charAt(0)}{staff.surname.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="text-sm font-semibold text-white">
                            {staff.preferredName.charAt(0)}{staff.surname.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{staff.preferredName} {staff.surname}</div>
                        <div className="text-sm text-gray-500">UID: {staff.uid}</div>
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
          <FormBuilder form={staffFormConfig} onSubmit={handleAddStaff} />
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
  const initialFormData = {
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
  };

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
