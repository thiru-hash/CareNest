"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowLeft, 
  Edit, 
  Save, 
  X, 
  Lock, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Shield,
  Key,
  Users,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { mockUserAccounts, mockStaff } from "@/lib/data";
import type { UserAccount, UserStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function UserProfilePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const user = mockUserAccounts.find(u => u.id === id);
  const staff = user?.staffId ? mockStaff.find(s => s.id === user.staffId) : null;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    role: user?.role || "Support Worker",
    status: user?.status || "Active",
    twoFactorEnabled: user?.twoFactorEnabled || false,
    passwordNeverExpires: user?.passwordNeverExpires || false,
    recoveryEmail: user?.recoveryEmail || "",
    recoveryPhone: user?.recoveryPhone || "",
    notes: user?.notes || ""
  });

  if (!user) {
    return (
      <div className="section-padding">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">User Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The requested user could not be found.</p>
          <Button asChild>
            <Link href="/settings">Back to Settings</Link>
          </Button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: UserStatus) => {
    const statusConfig = {
      Active: { color: "bg-green-500/20 text-green-700 border-green-500/30", icon: CheckCircle },
      Inactive: { color: "bg-gray-500/20 text-gray-700 border-gray-500/30", icon: Clock },
      Blocked: { color: "bg-red-500/20 text-red-700 border-red-500/30", icon: XCircle },
      Pending: { color: "bg-yellow-500/20 text-yellow-700 border-yellow-500/30", icon: AlertTriangle }
    };
    const config = statusConfig[status];
    const Icon = config.icon;
    
    return (
      <Badge className={cn("flex items-center gap-1", config.color)}>
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  const handleSave = () => {
    // In real app, this would update the user data
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
      twoFactorEnabled: user.twoFactorEnabled,
      passwordNeverExpires: user.passwordNeverExpires,
      recoveryEmail: user.recoveryEmail || "",
      recoveryPhone: user.recoveryPhone || "",
      notes: user.notes || ""
    });
    setIsEditing(false);
  };

  return (
    <div className="section-padding">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/settings">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Settings
            </Link>
          </Button>
        </div>
        
        {/* User Header */}
        <div className="flex items-center gap-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={staff?.avatarUrl} alt={user.username} />
            <AvatarFallback className="bg-blue-100 text-blue-800 text-2xl font-bold">
              {user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {staff ? `${staff.name}` : user.username}
              </h1>
              {getStatusBadge(user.status)}
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">{user.email}</p>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Lock className="mr-2 h-4 w-4" />
                Change Password
              </Button>
              {isEditing ? (
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="user-details" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="user-details">User Details</TabsTrigger>
          <TabsTrigger value="access-keys">Access Keys</TabsTrigger>
          <TabsTrigger value="signature">Signature</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
          <TabsTrigger value="area">Area</TabsTrigger>
          <TabsTrigger value="my-team">My Team</TabsTrigger>
          <TabsTrigger value="staff-availability">Staff Availability</TabsTrigger>
        </TabsList>

        {/* User Details Tab */}
        <TabsContent value="user-details" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="honorific">Honorific (Title)</Label>
                  <div className="flex items-center gap-2">
                    <Edit className="h-4 w-4 text-blue-600" />
                    <Input
                      id="honorific"
                      value="Mr."
                      disabled={!isEditing}
                      className="flex-1"
                    />
                    <Button variant="ghost" size="sm" disabled={!isEditing}>
                      ▼
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <div className="flex items-center gap-2">
                    <Edit className="h-4 w-4 text-blue-600" />
                    <Input
                      id="firstName"
                      value={staff?.name.split(' ')[0] || ""}
                      disabled={!isEditing}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <div className="flex items-center gap-2">
                    <Edit className="h-4 w-4 text-blue-600" />
                    <Input
                      id="lastName"
                      value={staff?.name.split(' ').slice(1).join(' ') || ""}
                      disabled={!isEditing}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manager">Manager</Label>
                  <div className="flex items-center gap-2">
                    <Edit className="h-4 w-4 text-blue-600" />
                    <Input
                      id="manager"
                      value=""
                      disabled={!isEditing}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkToRecord">Link to Record</Label>
                  <div className="flex items-center gap-2">
                    <Link className="h-4 w-4 text-blue-600" />
                    <Input
                      id="linkToRecord"
                      value="No record selected"
                      disabled={!isEditing}
                      className="flex-1"
                    />
                    <Button variant="ghost" size="sm" disabled={!isEditing}>
                      ▼
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Login Details Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Login Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Login Username</Label>
                  <div className="flex items-center gap-2">
                    <Edit className="h-4 w-4 text-blue-600" />
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                      disabled={!isEditing}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center gap-2">
                    <Edit className="h-4 w-4 text-blue-600" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recoveryEmail">Account Recovery Email</Label>
                  <div className="flex items-center gap-2">
                    <Edit className="h-4 w-4 text-blue-600" />
                    <Input
                      id="recoveryEmail"
                      type="email"
                      value={formData.recoveryEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, recoveryEmail: e.target.value }))}
                      disabled={!isEditing}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobilePhone">Mobile Phone</Label>
                  <div className="flex items-center gap-2">
                    <Edit className="h-4 w-4 text-blue-600" />
                    <Input
                      id="mobilePhone"
                      value={staff?.phone || ""}
                      disabled={!isEditing}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recoveryPhone">Account Recovery Phone</Label>
                  <div className="flex items-center gap-2">
                    <Edit className="h-4 w-4 text-blue-600" />
                    <Input
                      id="recoveryPhone"
                      value={formData.recoveryPhone}
                      onChange={(e) => setFormData(prev => ({ ...prev, recoveryPhone: e.target.value }))}
                      disabled={!isEditing}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="enabled">Enabled</Label>
                  <div className="flex items-center gap-2">
                    <Edit className="h-4 w-4 text-blue-600" />
                    <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as UserStatus }))} disabled={!isEditing}>
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Yes</SelectItem>
                        <SelectItem value="Inactive">No</SelectItem>
                        <SelectItem value="Blocked">Blocked</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passwordNeverExpires">Password never expire</Label>
                  <div className="flex items-center gap-2">
                    <Edit className="h-4 w-4 text-blue-600" />
                    <Select value={formData.passwordNeverExpires ? "Yes" : "No"} onValueChange={(value) => setFormData(prev => ({ ...prev, passwordNeverExpires: value === "Yes" }))} disabled={!isEditing}>
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twoFactor">Two Factor Authentication</Label>
                  <div className="flex items-center gap-2">
                    <Edit className="h-4 w-4 text-blue-600" />
                    <Select value={formData.twoFactorEnabled ? "Enabled" : "None (least secure)"} onValueChange={(value) => setFormData(prev => ({ ...prev, twoFactorEnabled: value === "Enabled" }))} disabled={!isEditing}>
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Enabled">Enabled</SelectItem>
                        <SelectItem value="None (least secure)">None (least secure)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Access Keys Tab */}
        <TabsContent value="access-keys" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Access Keys & API Tokens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Key className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Access Keys</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  This user doesn't have any access keys or API tokens configured.
                </p>
                <Button>
                  <Key className="mr-2 h-4 w-4" />
                  Generate Access Key
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Signature Tab */}
        <TabsContent value="signature" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Email Signature
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="signature">Email Signature</Label>
                  <textarea
                    id="signature"
                    className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none"
                    placeholder="Enter email signature..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button>Save Signature</Button>
                  <Button variant="outline">Preview</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Groups Tab */}
        <TabsContent value="groups" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Groups
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>System Admin</span>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>All Users</span>
                  <Badge variant="default">Active</Badge>
                </div>
                <Button variant="outline" className="w-full">
                  <Users className="mr-2 h-4 w-4" />
                  Add to Group
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Area Tab */}
        <TabsContent value="area" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Service Areas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Service Areas</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  This user is not assigned to any specific service areas.
                </p>
                <Button>
                  <MapPin className="mr-2 h-4 w-4" />
                  Assign Service Area
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Team Tab */}
        <TabsContent value="my-team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Team Members</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  This user is not managing any team members.
                </p>
                <Button>
                  <Users className="mr-2 h-4 w-4" />
                  Add Team Member
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Staff Availability Tab */}
        <TabsContent value="staff-availability" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Availability Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Availability Set</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  This user hasn't set their availability schedule.
                </p>
                <Button>
                  <Clock className="mr-2 h-4 w-4" />
                  Set Availability
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 