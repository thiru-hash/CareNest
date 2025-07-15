import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDashboardConfig } from '@/lib/hooks/useDashboardConfig';
import { Settings } from 'lucide-react';

export function UserLevelSelector() {
  const { config, currentUserLevel, setUserLevel } = useDashboardConfig();
  const [isOpen, setIsOpen] = useState(false);

  const userLevels = [
    { id: 'admin', name: 'System Admin', description: 'Full system access' },
    { id: 'client-admin', name: 'Client IT Admin', description: 'Client organization management' },
    { id: 'manager', name: 'Manager', description: 'Team and shift management' },
    { id: 'caregiver', name: 'Caregiver', description: 'Direct care staff' },
    { id: 'coordinator', name: 'Coordinator', description: 'Shift coordination' }
  ];

  const currentLevel = userLevels.find(level => level.id === currentUserLevel);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <Card className="w-80 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Test User Level
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select User Level:</label>
              <Select value={currentUserLevel} onValueChange={setUserLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {userLevels.map(level => (
                    <SelectItem key={level.id} value={level.id}>
                      <div className="flex items-center gap-2">
                        <span>{level.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {config.userLevels.find(ul => ul.id === level.id)?.sections.length || 0} sections
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {currentLevel && (
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-semibold text-sm">{currentLevel.name}</h4>
                <p className="text-xs text-muted-foreground">{currentLevel.description}</p>
                <div className="mt-2">
                  <p className="text-xs font-medium">Visible Sections:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {config.userLevels.find(ul => ul.id === currentUserLevel)?.sections.map(sectionId => {
                      const section = config.dashboardSections.find(s => s.id === sectionId);
                      return section ? (
                        <Badge key={sectionId} variant="outline" className="text-xs">
                          {section.name}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>
            )}
            
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="w-full"
            >
              Close
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          size="sm"
          variant="outline"
          className="shadow-lg"
        >
          <Settings className="h-4 w-4 mr-2" />
          {currentLevel?.name || 'Select Level'}
        </Button>
      )}
    </div>
  );
} 