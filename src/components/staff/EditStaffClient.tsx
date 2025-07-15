"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FormBuilder } from "@/components/settings/FormBuilder";
import { useSystemSettings } from "@/lib/hooks/useSystemSettings";
import { useToast } from "@/hooks/use-toast";
import { mockForms } from "@/lib/data";
import type { Staff, CustomForm } from "@/lib/types";
import { 
  Save, 
  X, 
  Camera, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Building, 
  DollarSign, 
  FileText, 
  Shield,
  User,
  Settings
} from "lucide-react";
import { format } from "date-fns";

interface EditStaffClientProps {
  currentUser: Staff;
  isOwnProfile: boolean;
  currentUserRole: string;
}

export function EditStaffClient({ currentUser, isOwnProfile, currentUserRole }: EditStaffClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { settings, canViewPayRates, canEditStaff } = useSystemSettings();
  
  const [staffData, setStaffData] = useState<Staff>(currentUser);
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [dynamicForms, setDynamicForms] = useState<CustomForm[]>([]);
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load dynamic forms if enabled
    if (settings.enableDynamicForms) {
      const staffForms = mockForms.filter(form => 
        form.id.includes('staff') || form.id.includes('form-staff')
      );
      setDynamicForms(staffForms);
    }
  }, [settings.enableDynamicForms]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
        setStaffData(prev => ({ ...prev, avatarUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setStaffData(prev => ({ ...prev, [field]: value }));
  };

  const handlePersonalDetailsChange = (field: string, value: any) => {
    setStaffData(prev => ({
      ...prev,
      personalDetails: {
        ...prev.personalDetails,
        [field]: value
      }
    }));
  };

  const handleEmploymentDetailsChange = (field: string, value: any) => {
    setStaffData(prev => ({
      ...prev,
      employmentDetails: {
        ...prev.employmentDetails,
        [field]: value
      }
    }));
  };

  const handleFormSubmit = (formId: string, data: any) => {
    setFormData(prev => ({ ...prev, [formId]: data }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the staff data with form data
      const updatedStaff = {
        ...staffData,
        // Add any additional form data here
        customForms: formData
      };

      console.log('Saving staff data:', updatedStaff);
      
      toast({
        title: "Profile Updated",
        description: "Staff profile has been successfully updated.",
      });

      // Redirect back to profile view
      router.push(`/staff/${currentUser.id}`);
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "There was an error updating the profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(`/staff/${currentUser.id}`);
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return format(date, 'yyyy-MM-dd');
  };

  const getEmploymentTypeColor = (type: string) => {
    const colorMap = {
      'Full-time': 'bg-blue-100 text-blue-800',
      'Part-time': 'bg-yellow-100 text-yellow-800',
      'Casual': 'bg-purple-100 text-purple-800',
      'Contract': 'bg-orange-100 text-orange-800'
    };
    return colorMap[type as keyof typeof colorMap] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header with Save/Cancel buttons */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={avatarUrl} alt={staffData.name} />
            <AvatarFallback>{staffData.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{staffData.name}</h2>
            <p className="text-muted-foreground">{staffData.role}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="employment">Employment</TabsTrigger>
          <TabsTrigger value="forms">Custom Forms</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Update personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Avatar Upload */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <AvatarImage src={avatarUrl} alt={staffData.name} />
                  <AvatarFallback>{staffData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                    <Camera className="mr-2 h-4 w-4" />
                    Change Photo
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Name and Email */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={staffData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={staffData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
              </div>

              {/* Phone and Address */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={staffData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={staffData.personalDetails?.address || ''}
                    onChange={(e) => handlePersonalDetailsChange('address', e.target.value)}
                  />
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={staffData.personalDetails?.dob ? formatDate(staffData.personalDetails.dob) : ''}
                  onChange={(e) => handlePersonalDetailsChange('dob', e.target.value ? new Date(e.target.value) : undefined)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Employment Details Tab */}
        <TabsContent value="employment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Employment Details
              </CardTitle>
              <CardDescription>
                Update employment information and role details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Role and Employment Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={staffData.role} onValueChange={(value) => handleInputChange('role', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Support Worker">Support Worker</SelectItem>
                      <SelectItem value="Support Manager">Support Manager</SelectItem>
                      <SelectItem value="Roster Admin">Roster Admin</SelectItem>
                      <SelectItem value="Finance Admin">Finance Admin</SelectItem>
                      <SelectItem value="System Admin">System Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="employmentType">Employment Type</Label>
                  <Select 
                    value={staffData.employmentDetails?.employmentType || ''} 
                    onValueChange={(value) => handleEmploymentDetailsChange('employmentType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select employment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Casual">Casual</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Start Date and Pay Rate */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={staffData.employmentDetails?.startDate ? formatDate(staffData.employmentDetails.startDate) : ''}
                    onChange={(e) => handleEmploymentDetailsChange('startDate', e.target.value ? new Date(e.target.value) : undefined)}
                  />
                </div>
                {canViewPayRates(currentUserRole) && (
                  <div>
                    <Label htmlFor="payRate">Pay Rate ($/hr)</Label>
                    <Input
                      id="payRate"
                      type="number"
                      step="0.01"
                      value={staffData.employmentDetails?.payRate || ''}
                      onChange={(e) => handleEmploymentDetailsChange('payRate', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                )}
              </div>

              {/* Groups and Properties */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="groups">Groups</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select groups" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="support-workers">Support Workers</SelectItem>
                      <SelectItem value="managers">Managers</SelectItem>
                      <SelectItem value="admins">Administrators</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="properties">Properties</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select properties" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="property-1">Wellington Residential</SelectItem>
                      <SelectItem value="property-2">Auckland Community</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Custom Forms Tab */}
        <TabsContent value="forms" className="space-y-6">
          {settings.enableDynamicForms && dynamicForms.length > 0 ? (
            dynamicForms.map((form) => (
              <Card key={form.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {form.name}
                  </CardTitle>
                  <CardDescription>
                    Custom form created in System Settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormBuilder
                    form={form}
                    onSubmit={(data) => handleFormSubmit(form.id, data)}
                    initialData={formData[form.id] || {}}
                  />
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-8">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Custom Forms</h3>
                  <p className="text-muted-foreground">
                    {settings.enableDynamicForms 
                      ? "No custom forms have been created for staff profiles yet."
                      : "Dynamic forms are disabled in System Settings."
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Profile Settings
              </CardTitle>
              <CardDescription>
                Configure profile visibility and permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="profile-visible">Profile Visible</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow other staff to view this profile
                  </p>
                </div>
                <Switch id="profile-visible" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="contact-visible">Contact Information Visible</Label>
                  <p className="text-sm text-muted-foreground">
                    Show contact details to other staff
                  </p>
                </div>
                <Switch id="contact-visible" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="employment-visible">Employment Details Visible</Label>
                  <p className="text-sm text-muted-foreground">
                    Show employment information to other staff
                  </p>
                </div>
                <Switch id="employment-visible" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 