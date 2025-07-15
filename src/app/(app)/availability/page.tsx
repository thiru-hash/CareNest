'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AvailabilityPage() {
  const { toast } = useToast();
  const [availability, setAvailability] = useState({
    defaultStartTime: '09:00',
    defaultEndTime: '17:00',
    monday: { available: true, start: '09:00', end: '17:00' },
    tuesday: { available: true, start: '09:00', end: '17:00' },
    wednesday: { available: true, start: '09:00', end: '17:00' },
    thursday: { available: true, start: '09:00', end: '17:00' },
    friday: { available: true, start: '09:00', end: '17:00' },
    saturday: { available: false, start: '09:00', end: '17:00' },
    sunday: { available: false, start: '09:00', end: '17:00' }
  });

  const [preferences, setPreferences] = useState({
    preferredShiftLength: '8',
    maxShiftsPerWeek: '5',
    preferredStartTime: '09:00',
    preferredEndTime: '17:00',
    allowOvertime: true,
    allowWeekends: false,
    allowEvenings: true,
    allowNights: false
  });

  const handleSaveAvailability = () => {
    toast({
      title: "Availability Updated",
      description: "Your availability preferences have been saved successfully.",
    });
  };

  const days = [
    { key: 'monday', label: 'Monday', short: 'Mon' },
    { key: 'tuesday', label: 'Tuesday', short: 'Tue' },
    { key: 'wednesday', label: 'Wednesday', short: 'Wed' },
    { key: 'thursday', label: 'Thursday', short: 'Thu' },
    { key: 'friday', label: 'Friday', short: 'Fri' },
    { key: 'saturday', label: 'Saturday', short: 'Sat' },
    { key: 'sunday', label: 'Sunday', short: 'Sun' }
  ];

  return (
    <div className="min-h-screen bg-muted">
      <div className="w-full h-full p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl lg:text-3xl font-bold text-left">My Availability</h1>
          <p className="text-muted-foreground text-left">Set your working availability and preferences</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Weekly Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Weekly Schedule
              </CardTitle>
              <CardDescription>Set your availability for each day of the week</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {days.map((day) => (
                <div key={day.key} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={availability[day.key as keyof typeof availability].available}
                      onCheckedChange={(checked) => setAvailability(prev => ({
                        ...prev,
                        [day.key]: { ...prev[day.key as keyof typeof availability], available: checked }
                      }))}
                    />
                    <div>
                      <Label className="font-medium">{day.label}</Label>
                      {availability[day.key as keyof typeof availability].available && (
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {availability[day.key as keyof typeof availability].start} - {availability[day.key as keyof typeof availability].end}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {availability[day.key as keyof typeof availability].available && (
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={availability[day.key as keyof typeof availability].start}
                        onChange={(e) => setAvailability(prev => ({
                          ...prev,
                          [day.key]: { ...prev[day.key as keyof typeof availability], start: e.target.value }
                        }))}
                        className="w-24"
                      />
                      <span className="text-muted-foreground">to</span>
                      <Input
                        type="time"
                        value={availability[day.key as keyof typeof availability].end}
                        onChange={(e) => setAvailability(prev => ({
                          ...prev,
                          [day.key]: { ...prev[day.key as keyof typeof availability], end: e.target.value }
                        }))}
                        className="w-24"
                      />
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Preferences
              </CardTitle>
              <CardDescription>Set your shift preferences and constraints</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Preferred Shift Length (hours):</Label>
                  <Select value={preferences.preferredShiftLength} onValueChange={(value) => setPreferences(prev => ({ ...prev, preferredShiftLength: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4">4 hours</SelectItem>
                      <SelectItem value="6">6 hours</SelectItem>
                      <SelectItem value="8">8 hours</SelectItem>
                      <SelectItem value="10">10 hours</SelectItem>
                      <SelectItem value="12">12 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Max Shifts Per Week:</Label>
                  <Select value={preferences.maxShiftsPerWeek} onValueChange={(value) => setPreferences(prev => ({ ...prev, maxShiftsPerWeek: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 shifts</SelectItem>
                      <SelectItem value="4">4 shifts</SelectItem>
                      <SelectItem value="5">5 shifts</SelectItem>
                      <SelectItem value="6">6 shifts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Preferred Start Time:</Label>
                  <Input
                    type="time"
                    value={preferences.preferredStartTime}
                    onChange={(e) => setPreferences(prev => ({ ...prev, preferredStartTime: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Preferred End Time:</Label>
                  <Input
                    type="time"
                    value={preferences.preferredEndTime}
                    onChange={(e) => setPreferences(prev => ({ ...prev, preferredEndTime: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Allow Overtime:</Label>
                    <p className="text-sm text-muted-foreground">Accept shifts beyond your preferred hours</p>
                  </div>
                  <Switch
                    checked={preferences.allowOvertime}
                    onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, allowOvertime: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Allow Weekend Shifts:</Label>
                    <p className="text-sm text-muted-foreground">Accept shifts on Saturdays and Sundays</p>
                  </div>
                  <Switch
                    checked={preferences.allowWeekends}
                    onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, allowWeekends: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Allow Evening Shifts:</Label>
                    <p className="text-sm text-muted-foreground">Accept shifts after 6 PM</p>
                  </div>
                  <Switch
                    checked={preferences.allowEvenings}
                    onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, allowEvenings: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Allow Night Shifts:</Label>
                    <p className="text-sm text-muted-foreground">Accept overnight shifts</p>
                  </div>
                  <Switch
                    checked={preferences.allowNights}
                    onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, allowNights: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Availability Summary</CardTitle>
            <CardDescription>Overview of your current availability settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {days.filter(day => availability[day.key as keyof typeof availability].available).length}
                </div>
                <p className="text-sm text-muted-foreground">Available Days</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {preferences.preferredShiftLength}h
                </div>
                <p className="text-sm text-muted-foreground">Preferred Shift Length</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {preferences.maxShiftsPerWeek}
                </div>
                <p className="text-sm text-muted-foreground">Max Shifts Per Week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSaveAvailability} className="px-8">
            Save Availability
          </Button>
        </div>
      </div>
    </div>
  );
} 