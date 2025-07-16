
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MoreHorizontal, 
  PlusCircle, 
  UserPlus, 
  Shield, 
  Lock, 
  Unlock, 
  Key, 
  Eye, 
  Edit, 
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { mockUserAccounts, mockStaff, mockUserAuditLogs } from "@/lib/data";
import type { UserAccount, UserStatus, Staff } from "@/lib/types";
import { cn } from "@/lib/utils";
import { TwoFactorSetup } from "./TwoFactorSetup";
import { useToast } from "@/hooks/use-toast";

export function UserManagement() {
  const [users, setUsers] = useState<UserAccount[]>(mockUserAccounts);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "all">("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isTwoFactorSetupOpen, setIsTwoFactorSetupOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const { toast } = useToast();

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStaffName = (staffId?: string) => {
    if (!staffId) return "Not Linked";
    const staff = mockStaff.find(s => s.id === staffId);
    return staff ? staff.name : "Unknown Staff";
  };

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

  const handleCreateUser = (userData: Partial<UserAccount>) => {
    const newUser: UserAccount = {
      id: `user-${Date.now()}`,
      username: userData.username || "",
      email: userData.email || "",
      staffId: userData.staffId,
      status: userData.status || "Pending",
      role: userData.role || "Support Worker",
      permissions: userData.permissions || [],
        groupIds: userData.groupIds || [],
      passwordNeverExpires: userData.passwordNeverExpires || false,
      twoFactorEnabled: userData.twoFactorEnabled || false,
      recoveryEmail: userData.recoveryEmail,
      recoveryPhone: userData.recoveryPhone,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: "current-user", // In real app, get from auth context
      notes: userData.notes
      };
      setUsers(prev => [...prev, newUser]);
    setIsCreateDialogOpen(false);
  };

  const handleUpdateUser = (userId: string, updates: Partial<UserAccount>) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, ...updates, updatedAt: new Date() }
        : user
    ));
    setIsEditDialogOpen(false);
    setSelectedUser(null);
  };

  const handleBlockUser = (userId: string) => {
    const userToBlock = users.find(u => u.id === userId);
    if (userToBlock) {
      // When blocking a user, remove all permissions, groups, and disable 2FA
      handleUpdateUser(userId, { 
        status: "Blocked",
        twoFactorEnabled: false,
        permissions: [],
        groupIds: [],
        notes: userToBlock.notes ? `${userToBlock.notes}\n[BLOCKED] Account blocked on ${new Date().toLocaleString()}` : `[BLOCKED] Account blocked on ${new Date().toLocaleString()}`
      });
    }
  };

  const handleUnblockUser = (userId: string) => {
    const userToUnblock = users.find(u => u.id === userId);
    if (userToUnblock) {
      // When unblocking, restore basic permissions but keep 2FA disabled
      const basicPermissions = ['view_dashboard'];
      handleUpdateUser(userId, { 
        status: "Active",
        twoFactorEnabled: false, // Keep 2FA disabled, user must re-enable
        permissions: basicPermissions,
        notes: userToUnblock.notes ? `${userToUnblock.notes}\n[UNBLOCKED] Account unblocked on ${new Date().toLocaleString()}` : `[UNBLOCKED] Account unblocked on ${new Date().toLocaleString()}`
      });
    }
  };

  const handleResetPassword = (userId: string) => {
    // In real app, this would trigger a password reset email
    alert(`Password reset email sent to ${users.find(u => u.id === userId)?.email}`);
  };

  const getUnlinkedStaff = () => {
    const linkedStaffIds = users.map(u => u.staffId).filter(Boolean);
    return mockStaff.filter(staff => !linkedStaffIds.includes(staff.id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
              <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>
                Manage user accounts, permissions, and access controls. Users are billed based on active accounts.
              </CardDescription>
              </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Import
              </Button>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create User
                  </Button>
                </DialogTrigger>
                <CreateUserDialog 
                  onSave={handleCreateUser}
                  availableStaff={getUnlinkedStaff()}
                />
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as UserStatus | "all")}>
              <SelectTrigger className="w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Blocked">Blocked</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Accounts ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Staff Record</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>2FA</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                const staff = mockStaff.find(s => s.id === user.staffId);
                return (
                <TableRow key={user.id}>
                    <TableCell>
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={staff?.avatarUrl} alt={user.username} />
                          <AvatarFallback className="bg-blue-100 text-blue-800">
                            {user.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                      </Avatar>
                      <div>
                          <div className="font-medium">{user.username}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{getStaffName(user.staffId)}</div>
                        {user.staffId && (
                          <div className="text-gray-500">Linked</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(user.status)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {user.lastLogin ? (
                          <div>
                            <div>{user.lastLogin.toLocaleDateString()}</div>
                            <div className="text-gray-500">{user.lastLogin.toLocaleTimeString()}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">Never</span>
                        )}
                    </div>
                  </TableCell>
                    <TableCell>
                      <Badge variant={user.twoFactorEnabled ? "default" : "secondary"}>
                        {user.twoFactorEnabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setSelectedUser(user);
                            setIsEditDialogOpen(true);
                          }}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleResetPassword(user.id)}>
                            <Key className="mr-2 h-4 w-4" />
                            Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setSelectedUser(user);
                            setIsTwoFactorSetupOpen(true);
                          }}>
                            <Shield className="mr-2 h-4 w-4" />
                            Setup 2FA
                          </DropdownMenuItem>
                          {user.twoFactorEnabled ? (
                            <DropdownMenuItem onClick={() => {
                              handleUpdateUser(user.id, { twoFactorEnabled: false });
                              toast({
                                title: "2FA Disabled",
                                description: `Two-factor authentication disabled for ${user.username}.`,
                              });
                            }}>
                              <Shield className="mr-2 h-4 w-4" />
                              Disable 2FA
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => {
                              handleUpdateUser(user.id, { twoFactorEnabled: true });
                              toast({
                                title: "2FA Enabled",
                                description: `Two-factor authentication enabled for ${user.username}.`,
                              });
                            }}>
                              <Shield className="mr-2 h-4 w-4" />
                              Enable 2FA
                            </DropdownMenuItem>
                          )}
                          {user.status === "Blocked" ? (
                            <DropdownMenuItem onClick={() => handleUnblockUser(user.id)}>
                              <Unlock className="mr-2 h-4 w-4" />
                              Unblock User
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleBlockUser(user.id)}>
                              <Lock className="mr-2 h-4 w-4" />
                              Block User
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      {selectedUser && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit User: {selectedUser.username}</DialogTitle>
              <DialogDescription>
                Update user account settings and permissions
              </DialogDescription>
            </DialogHeader>
            <EditUserDialog 
              user={selectedUser}
              onSave={(updates) => handleUpdateUser(selectedUser.id, updates)}
              availableStaff={mockStaff}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Two-Factor Setup Dialog */}
      {selectedUser && (
        <Dialog open={isTwoFactorSetupOpen} onOpenChange={setIsTwoFactorSetupOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Configure Two-Factor Authentication</DialogTitle>
              <DialogDescription>
                Enable 2FA for {selectedUser.username}. The user will complete setup on their next login.
              </DialogDescription>
            </DialogHeader>
            <TwoFactorSetup
              user={selectedUser}
              onSetupComplete={(enabled) => {
                if (enabled) {
                  handleUpdateUser(selectedUser.id, { twoFactorEnabled: true });
                  toast({
                    title: "2FA Enabled",
                    description: `Two-factor authentication enabled for ${selectedUser.username}.`,
                  });
                }
                setIsTwoFactorSetupOpen(false);
                setSelectedUser(null);
              }}
              onCancel={() => {
                setIsTwoFactorSetupOpen(false);
                setSelectedUser(null);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Create User Dialog Component
function CreateUserDialog({ onSave, availableStaff }: { 
  onSave: (userData: Partial<UserAccount>) => void;
  availableStaff: Staff[];
}) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    staffId: "",
    role: "Support Worker" as UserRole,
    status: "Pending" as UserStatus,
    passwordNeverExpires: false,
    twoFactorEnabled: false,
    recoveryEmail: "",
    recoveryPhone: "",
    notes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Create New User Account</DialogTitle>
        <DialogDescription>
          Create a new user account and optionally link to a staff record
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as UserRole }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Support Worker">Support Worker</SelectItem>
                    <SelectItem value="Support Manager">Support Manager</SelectItem>
                    <SelectItem value="Roster Admin">Roster Admin</SelectItem>
                    <SelectItem value="Finance Admin">Finance Admin</SelectItem>
                    <SelectItem value="Human Resources Manager">Human Resources Manager</SelectItem>
                    <SelectItem value="IT Admin">IT Admin</SelectItem>
                    <SelectItem value="System Admin">System Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as UserStatus }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="staffId">Link to Staff Record (Optional)</Label>
              <Select value={formData.staffId || "none"} onValueChange={(value) => setFormData(prev => ({ ...prev, staffId: value === "none" ? undefined : value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select staff member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Staff Link</SelectItem>
                  {availableStaff.map(staff => (
                    <SelectItem key={staff.id} value={staff.id}>
                      {staff.name} ({staff.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="recoveryEmail">Recovery Email</Label>
                <Input
                  id="recoveryEmail"
                  type="email"
                  value={formData.recoveryEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, recoveryEmail: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="recoveryPhone">Recovery Phone</Label>
                <Input
                  id="recoveryPhone"
                  value={formData.recoveryPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, recoveryPhone: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="twoFactor"
                checked={formData.twoFactorEnabled}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, twoFactorEnabled: checked }))}
              />
              <Label htmlFor="twoFactor">Enable Two-Factor Authentication</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="passwordNeverExpires"
                checked={formData.passwordNeverExpires}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, passwordNeverExpires: checked }))}
              />
              <Label htmlFor="passwordNeverExpires">Password Never Expires</Label>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes about this user account"
              />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button type="submit">Create User</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

// Edit User Dialog Component
function EditUserDialog({ user, onSave, availableStaff }: {
  user: UserAccount;
  onSave: (updates: Partial<UserAccount>) => void;
  availableStaff: Staff[];
}) {
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    staffId: user.staffId || "",
    role: user.role,
    status: user.status,
    passwordNeverExpires: user.passwordNeverExpires,
    twoFactorEnabled: user.twoFactorEnabled,
    recoveryEmail: user.recoveryEmail || "",
    recoveryPhone: user.recoveryPhone || "",
    notes: user.notes || ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as UserRole }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Support Worker">Support Worker</SelectItem>
                  <SelectItem value="Support Manager">Support Manager</SelectItem>
                  <SelectItem value="Roster Admin">Roster Admin</SelectItem>
                  <SelectItem value="Finance Admin">Finance Admin</SelectItem>
                  <SelectItem value="Human Resources Manager">Human Resources Manager</SelectItem>
                  <SelectItem value="IT Admin">IT Admin</SelectItem>
                  <SelectItem value="System Admin">System Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as UserStatus }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Blocked">Blocked</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="staffId">Link to Staff Record</Label>
            <Select value={formData.staffId || "none"} onValueChange={(value) => setFormData(prev => ({ ...prev, staffId: value === "none" ? undefined : value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select staff member" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Staff Link</SelectItem>
                {availableStaff.map(staff => (
                  <SelectItem key={staff.id} value={staff.id}>
                    {staff.name} ({staff.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="recoveryEmail">Recovery Email</Label>
              <Input
                id="recoveryEmail"
                type="email"
                value={formData.recoveryEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, recoveryEmail: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="recoveryPhone">Recovery Phone</Label>
              <Input
                id="recoveryPhone"
                value={formData.recoveryPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, recoveryPhone: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="twoFactor"
              checked={formData.twoFactorEnabled}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, twoFactorEnabled: checked }))}
            />
            <Label htmlFor="twoFactor">Enable Two-Factor Authentication</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="passwordNeverExpires"
              checked={formData.passwordNeverExpires}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, passwordNeverExpires: checked }))}
            />
            <Label htmlFor="passwordNeverExpires">Password Never Expires</Label>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes about this user account"
            />
          </div>
        </TabsContent>
      </Tabs>

      <DialogFooter>
        <Button type="submit">Save Changes</Button>
      </DialogFooter>
    </form>
  );
}
