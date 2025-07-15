"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Settings,
  Users,
  Calendar,
  DollarSign,
  MapPin,
  FileText,
  Shield
} from "lucide-react";

interface Section {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  icon: string;
  order: number;
}

const defaultSections: Section[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    description: "Main dashboard and overview",
    enabled: true,
    icon: "Settings",
    order: 1
  },
  {
    id: "people",
    name: "People We Support",
    description: "Manage clients and people records",
    enabled: true,
    icon: "Users",
    order: 2
  },
  {
    id: "staff",
    name: "Staff Management",
    description: "Manage staff records and employment details",
    enabled: true,
    icon: "Users",
    order: 3
  },
  {
    id: "roster",
    name: "Roster Schedule",
    description: "Staff scheduling and shift management",
    enabled: true,
    icon: "Calendar",
    order: 4
  },
  {
    id: "finance",
    name: "Finance",
    description: "Financial management and reporting",
    enabled: true,
    icon: "DollarSign",
    order: 5
  },
  {
    id: "locations",
    name: "Locations",
    description: "Property and location management",
    enabled: true,
    icon: "MapPin",
    order: 6
  },
  {
    id: "documents",
    name: "Documents",
    description: "Document templates and management",
    enabled: true,
    icon: "FileText",
    order: 7
  },
  {
    id: "compliance",
    name: "Compliance",
    description: "Compliance and audit management",
    enabled: true,
    icon: "Shield",
    order: 8
  }
];

interface SectionManagerProps {
  onDatabaseCreation?: (sectionName: string, formData: any) => Promise<void>;
}

export function SectionManager({ onDatabaseCreation }: SectionManagerProps) {
  const [sections, setSections] = useState<Section[]>(defaultSections);
  const [editingSection, setEditingSection] = useState<Section | null>(null);

  const toggleSection = (sectionId: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, enabled: !section.enabled }
        : section
    ));
  };

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Settings,
      Users,
      Calendar,
      DollarSign,
      MapPin,
      FileText,
      Shield
    };
    return icons[iconName] || Settings;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Section Management</h2>
          <p className="text-muted-foreground">
            Configure which sections are available in the application
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Section
        </Button>
      </div>

      <div className="grid gap-4">
        {sections.map((section) => {
          const IconComponent = getIconComponent(section.icon);
          
          return (
            <Card key={section.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{section.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {section.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={section.enabled}
                        onCheckedChange={() => toggleSection(section.id)}
                      />
                      <Label className="text-sm">
                        {section.enabled ? "Enabled" : "Disabled"}
                      </Label>
                    </div>
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
          );
        })}
      </div>
    </div>
  );
} 