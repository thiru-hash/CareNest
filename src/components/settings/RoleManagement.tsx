"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Shield,
  Users,
  Settings,
  Calendar,
  DollarSign,
  FileText
} from "lucide-react";

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

const defaultRoles: Role[] = [
  {
    id: "system-admin",
    name: "System Admin",
    description: "Full system access and administration",
    permissions: ["*"],
    userCount: 2
  },
  {
    id: "tenant-admin",
    name: "Tenant Admin",
    description: "Full access within tenant",
    permissions: ["dashboard", "people", "roster", "finance", "locations", "documents", "compliance"],
    userCount: 5
  },
  {
    id: "manager",
    name: "Manager",
    description: "Management level access",
    permissions: ["dashboard", "people", "roster", "locations"],
    userCount: 12
  },
  {
    id: "support-worker",
    name: "Support Worker",
    description: "Standard support worker access",
    permissions: ["dashboard", "roster", "people"],
    userCount: 45
  },
  {
    id: "hr-manager",
    name: "HR Manager",
    description: "Human resources management",
    permissions: ["dashboard", "people", "documents"],
    userCount: 3
  },
  {
    id: "finance-admin",
    name: "Finance Admin",
    description: "Financial management access",
    permissions: ["dashboard", "finance", "roster"],
    userCount: 4
  }
];

const permissionIcons: { [key: string]: any } = {
  dashboard: Settings,
  people: Users,
  roster: Calendar,
  finance: DollarSign,
  locations: Shield,
  documents: FileText,
  compliance: Shield
};

export function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>(defaultRoles);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const getPermissionIcon = (permission: string) => {
    return permissionIcons[permission] || Shield;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Role Management</h2>
          <p className="text-muted-foreground">
            Manage user roles and their associated permissions
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Role
        </Button>
      </div>

      <div className="grid gap-4">
        {roles.map((role) => (
          <Card key={role.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{role.name}</h3>
                        <Badge variant="secondary">
                          {role.userCount} users
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {role.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {role.permissions.map((permission) => {
                          const IconComponent = getPermissionIcon(permission);
                          return (
                            <Badge key={permission} variant="outline" className="flex items-center space-x-1">
                              <IconComponent className="h-3 w-3" />
                              <span>{permission === "*" ? "All Permissions" : permission}</span>
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 