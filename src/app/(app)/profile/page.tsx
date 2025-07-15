'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Camera, Shield, QrCode, Download, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Staff } from '@/lib/types';

// Mock current user data
const mockCurrentUser: Staff = {
  id: 'staff-1',
  name: 'Thirumurthi Palanisamy',
  avatarUrl: '/avatars/thirumurthi.jpg',
  role: 'System Admin',
  email: 'Thirumurthi.Palanisamy@aspire.org.nz',
  phone: '0225653707'
};

export default function ProfilePage() {
  const { toast } = useToast();
  const [userDetails, setUserDetails] = useState({
    title: 'Mr.',
    givenName: 'Thirumurthi',
    surname: 'Palanisamy',
    email: 'Thirumurthi.Palanisamy@aspire.org.nz',
    mobilePhone: '0225653707',
    accountRecoveryEmail: '',
    accountRecoveryPhone: ''
  });

  const [defaultPreferences, setDefaultPreferences] = useState({
    defaultWorkingSite: 'All',
    rightSidebar: 'Visible',
    defaultPrimaryRecordTableStatusFilter: 'Any Status',
    autoFillRosterScheduleShifts: 'Yes',
    primaryRecordTableListLength: '10',
    secondaryRecordTableListLength: '10'
  });

  const [widgets, setWidgets] = useState({
    quickAccessBookmarks: true,
    upcomingRosterSchedule: true,
    upcomingRosterScheduleEntries: '5',
    upcomingCalendarEvents: true
  });

  const [rosterSettings, setRosterSettings] = useState({
    defaultView: 'Use System Setting (Staff)',
    backForwardNavigation: 'Match current display period',
    defaultRosterPeriod: 'Use System Setting (Weekly)'
  });

  const [twoFactorAuth, setTwoFactorAuth] = useState({
    required: 'Authentication App only',
    isEnabled: false,
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
  });

  const [workingHours, setWorkingHours] = useState({
    defaultStartTime: '09:00',
    defaultEndTime: '17:00',
    monday: { start: '09:00', end: '17:00' },
    tuesday: { start: '09:00', end: '17:00' },
    wednesday: { start: '09:00', end: '17:00' },
    thursday: { start: '09:00', end: '17:00' },
    friday: { start: '09:00', end: '17:00' },
    saturday: { start: '09:00', end: '17:00' },
    sunday: { start: '09:00', end: '17:00' }
  });

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        toast({
          title: "Profile Picture Updated",
          description: "Your new profile picture has been set.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile settings have been saved successfully.",
    });
  };

  const handleEnableTwoFactor = () => {
    setTwoFactorAuth(prev => ({ ...prev, isEnabled: true }));
    toast({
      title: "Two-Factor Authentication Enabled",
      description: "Your account is now protected with 2FA.",
    });
  };

  const handleDownloadQRCode = () => {
    toast({
      title: "QR Code Downloaded",
      description: "The QR code has been saved to your device.",
    });
  };

  const handleRefreshQRCode = () => {
    toast({
      title: "QR Code Refreshed",
      description: "A new QR code has been generated.",
    });
  };

  return (
    <div className="min-h-screen bg-muted">
      <div className="w-full h-full p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl lg:text-3xl font-bold text-left">User Profile</h1>
          <p className="text-muted-foreground text-left">Manage your account settings and preferences</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Your basic profile details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative group">
                    <Avatar className="w-24 h-24 border-4 border-background shadow-md cursor-pointer">
                      <AvatarImage src={mockCurrentUser.avatarUrl} alt={mockCurrentUser.name} />
                      <AvatarFallback className="text-3xl">{mockCurrentUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <Camera className="h-8 w-8 text-white" />
                    </div>
                    <input
                      type="file"
                      onChange={handleAvatarChange}
                      className="hidden"
                      accept="image/*"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold">{mockCurrentUser.name}</h3>
                    <p className="text-sm text-muted-foreground">{mockCurrentUser.email}</p>
                    <Badge variant="secondary" className="mt-2">{mockCurrentUser.role}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Two-Factor Authentication */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Two-Factor Authentication
                </CardTitle>
                <CardDescription>Secure your account with 2FA</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Required Two Factor Authentication:</Label>
                  <Select value={twoFactorAuth.required} onValueChange={(value) => setTwoFactorAuth(prev => ({ ...prev, required: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Authentication App only">Authentication App only</SelectItem>
                      <SelectItem value="SMS only">SMS only</SelectItem>
                      <SelectItem value="Both">Both</SelectItem>
                      <SelectItem value="None">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {twoFactorAuth.required !== 'None' && (
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground mb-3">
                        Have you lost or replaced your device? Best enter a new QR code then:
                      </p>
                      <div className="flex justify-center mb-4">
                        <div className="w-32 h-32 bg-white border rounded-lg flex items-center justify-center">
                          <QrCode className="h-24 w-24 text-gray-400" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={handleDownloadQRCode}>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleRefreshQRCode}>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Refresh
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Settings */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="details" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">User Details</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
                <TabsTrigger value="widgets">Widgets</TabsTrigger>
                <TabsTrigger value="roster">Roster</TabsTrigger>
              </TabsList>

              {/* User Details Tab */}
              <TabsContent value="details" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>User Details</CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Select value={userDetails.title} onValueChange={(value) => setUserDetails(prev => ({ ...prev, title: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Mr.">Mr.</SelectItem>
                            <SelectItem value="Mrs.">Mrs.</SelectItem>
                            <SelectItem value="Ms.">Ms.</SelectItem>
                            <SelectItem value="Dr.">Dr.</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="givenName">Given Name</Label>
                        <Input
                          id="givenName"
                          value={userDetails.givenName}
                          onChange={(e) => setUserDetails(prev => ({ ...prev, givenName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="surname">Surname</Label>
                        <Input
                          id="surname"
                          value={userDetails.surname}
                          onChange={(e) => setUserDetails(prev => ({ ...prev, surname: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={userDetails.email}
                          onChange={(e) => setUserDetails(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mobilePhone">Mobile Phone Number</Label>
                        <Input
                          id="mobilePhone"
                          value={userDetails.mobilePhone}
                          onChange={(e) => setUserDetails(prev => ({ ...prev, mobilePhone: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="accountRecoveryEmail">Account Recovery Email</Label>
                        <Input
                          id="accountRecoveryEmail"
                          type="email"
                          value={userDetails.accountRecoveryEmail}
                          onChange={(e) => setUserDetails(prev => ({ ...prev, accountRecoveryEmail: e.target.value }))}
                          placeholder="Enter recovery email"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="accountRecoveryPhone">Account Recovery Phone Number</Label>
                        <Input
                          id="accountRecoveryPhone"
                          value={userDetails.accountRecoveryPhone}
                          onChange={(e) => setUserDetails(prev => ({ ...prev, accountRecoveryPhone: e.target.value }))}
                          placeholder="Enter recovery phone"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Preferences Tab */}
              <TabsContent value="preferences" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Default Preferences</CardTitle>
                    <CardDescription>Configure your default system preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Default Working Site:</Label>
                        <Select value={defaultPreferences.defaultWorkingSite} onValueChange={(value) => setDefaultPreferences(prev => ({ ...prev, defaultWorkingSite: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="All">All</SelectItem>
                            <SelectItem value="Site A">Site A</SelectItem>
                            <SelectItem value="Site B">Site B</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Right Sidebar:</Label>
                        <Select value={defaultPreferences.rightSidebar} onValueChange={(value) => setDefaultPreferences(prev => ({ ...prev, rightSidebar: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Visible">Visible</SelectItem>
                            <SelectItem value="Hidden">Hidden</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Default Primary Record Table Status Filter:</Label>
                        <Select value={defaultPreferences.defaultPrimaryRecordTableStatusFilter} onValueChange={(value) => setDefaultPreferences(prev => ({ ...prev, defaultPrimaryRecordTableStatusFilter: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Any Status">Any Status</SelectItem>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Auto-fill Roster Schedule Shifts on New Timesheets:</Label>
                        <Select value={defaultPreferences.autoFillRosterScheduleShifts} onValueChange={(value) => setDefaultPreferences(prev => ({ ...prev, autoFillRosterScheduleShifts: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Primary Record Table List Length:</Label>
                        <Select value={defaultPreferences.primaryRecordTableListLength} onValueChange={(value) => setDefaultPreferences(prev => ({ ...prev, primaryRecordTableListLength: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Secondary Record Table List Length:</Label>
                        <Select value={defaultPreferences.secondaryRecordTableListLength} onValueChange={(value) => setDefaultPreferences(prev => ({ ...prev, secondaryRecordTableListLength: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Working Hours */}
                <Card>
                  <CardHeader>
                    <CardTitle>Working Hours</CardTitle>
                    <CardDescription>Set your default working hours for each day</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Default Start Time:</Label>
                        <Input
                          type="time"
                          value={workingHours.defaultStartTime}
                          onChange={(e) => setWorkingHours(prev => ({ ...prev, defaultStartTime: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Default End Time:</Label>
                        <Input
                          type="time"
                          value={workingHours.defaultEndTime}
                          onChange={(e) => setWorkingHours(prev => ({ ...prev, defaultEndTime: e.target.value }))}
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                        <div key={day} className="space-y-2">
                          <Label className="capitalize">{day} Start Time:</Label>
                          <Input
                            type="time"
                            value={workingHours[day as keyof typeof workingHours].start}
                            onChange={(e) => setWorkingHours(prev => ({
                              ...prev,
                              [day]: { ...prev[day as keyof typeof workingHours], start: e.target.value }
                            }))}
                          />
                          <Label className="capitalize">{day} End Time:</Label>
                          <Input
                            type="time"
                            value={workingHours[day as keyof typeof workingHours].end}
                            onChange={(e) => setWorkingHours(prev => ({
                              ...prev,
                              [day]: { ...prev[day as keyof typeof workingHours], end: e.target.value }
                            }))}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Widgets Tab */}
              <TabsContent value="widgets" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Widgets</CardTitle>
                    <CardDescription>Configure your dashboard widgets and quick access features</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Quick Access / Bookmarks:</Label>
                          <p className="text-sm text-muted-foreground">Enable quick access to frequently used features</p>
                        </div>
                        <Switch
                          checked={widgets.quickAccessBookmarks}
                          onCheckedChange={(checked) => setWidgets(prev => ({ ...prev, quickAccessBookmarks: checked }))}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Upcoming Roster Schedule:</Label>
                          <p className="text-sm text-muted-foreground">Show upcoming shifts on dashboard</p>
                        </div>
                        <Switch
                          checked={widgets.upcomingRosterSchedule}
                          onCheckedChange={(checked) => setWidgets(prev => ({ ...prev, upcomingRosterSchedule: checked }))}
                        />
                      </div>
                      
                      {widgets.upcomingRosterSchedule && (
                        <div className="space-y-2">
                          <Label>Upcoming Roster Schedule Number of Entries:</Label>
                          <Select value={widgets.upcomingRosterScheduleEntries} onValueChange={(value) => setWidgets(prev => ({ ...prev, upcomingRosterScheduleEntries: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="5">5</SelectItem>
                              <SelectItem value="10">10</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Upcoming Calendar Events:</Label>
                          <p className="text-sm text-muted-foreground">Display calendar events on dashboard</p>
                        </div>
                        <Switch
                          checked={widgets.upcomingCalendarEvents}
                          onCheckedChange={(checked) => setWidgets(prev => ({ ...prev, upcomingCalendarEvents: checked }))}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Custom Record Tables */}
                <Card>
                  <CardHeader>
                    <CardTitle>Custom Record Tables</CardTitle>
                    <CardDescription>Configure your custom record table views</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[1, 2, 3, 4].map((tableNum) => (
                        <div key={tableNum} className="space-y-2">
                          <Label>Table #{tableNum}</Label>
                          <Select defaultValue="-- Default --">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="-- Default --">-- Default --</SelectItem>
                              <SelectItem value="Custom View 1">Custom View 1</SelectItem>
                              <SelectItem value="Custom View 2">Custom View 2</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Roster Tab */}
              <TabsContent value="roster" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Roster Settings</CardTitle>
                    <CardDescription>Configure your roster display preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Default View</Label>
                        <Select value={rosterSettings.defaultView} onValueChange={(value) => setRosterSettings(prev => ({ ...prev, defaultView: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Use System Setting (Staff)">Use System Setting (Staff)</SelectItem>
                            <SelectItem value="List View">List View</SelectItem>
                            <SelectItem value="Calendar View">Calendar View</SelectItem>
                            <SelectItem value="Timeline View">Timeline View</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Back/Forward Navigation</Label>
                        <Select value={rosterSettings.backForwardNavigation} onValueChange={(value) => setRosterSettings(prev => ({ ...prev, backForwardNavigation: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Match current display period">Match current display period</SelectItem>
                            <SelectItem value="Always go to today">Always go to today</SelectItem>
                            <SelectItem value="Remember last view">Remember last view</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Default Roster Period</Label>
                        <Select value={rosterSettings.defaultRosterPeriod} onValueChange={(value) => setRosterSettings(prev => ({ ...prev, defaultRosterPeriod: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Use System Setting (Weekly)">Use System Setting (Weekly)</SelectItem>
                            <SelectItem value="Daily">Daily</SelectItem>
                            <SelectItem value="Weekly">Weekly</SelectItem>
                            <SelectItem value="Monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button onClick={handleSaveProfile} className="px-8">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
