"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Plane, Hourglass } from "lucide-react";
import { mockStaff } from "@/lib/data";
import { format } from "date-fns";

// In a real app, this would come from an authentication context/session.
// We'll use a staff member to demonstrate this page.
const currentUser = mockStaff[0];

export default function ProfilePage() {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<Date | null>(null);

  const handleClockInOut = () => {
    if (isClockedIn) {
      // Clocking out
      setIsClockedIn(false);
      // In a real app, this would create a timesheet record here.
      alert(`Clocked out at ${new Date().toLocaleTimeString()}. A timesheet has been created for your review.`);
      setClockInTime(null);
    } else {
      // Clocking in
      const now = new Date();
      setIsClockedIn(true);
      setClockInTime(now);
      alert(`Clocked in at ${now.toLocaleTimeString()}`);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start gap-6">
            <Avatar className="w-24 h-24 border-4 border-background shadow-md">
              <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
              <AvatarFallback className="text-3xl">{currentUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 pt-2">
              <h1 className="text-3xl font-bold">{currentUser.name}</h1>
              <p className="text-muted-foreground">{currentUser.role}</p>
              <p className="text-sm text-muted-foreground mt-2">{currentUser.email}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Shift Management</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">
              {isClockedIn ? "Clocked In" : "Clocked Out"}
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              {isClockedIn && clockInTime
                ? `Since ${format(clockInTime, "p")}`
                : "You are not currently on shift."}
            </p>
             <Button
              onClick={handleClockInOut}
              className={isClockedIn ? "w-full bg-destructive hover:bg-destructive/90" : "w-full"}
            >
              {isClockedIn ? "Clock Out & End Shift" : "Clock In & Start Shift"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">My Timesheets</CardTitle>
            <Hourglass className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold">16h 45m</div>
            <p className="text-xs text-muted-foreground">
              Worked this payroll period
            </p>
             <Button variant="outline" className="w-full mt-4">
              View Timesheets
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Leave Requests</CardTitle>
            <Plane className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold">8h / 40h</div>
            <p className="text-xs text-muted-foreground">
              Approved / Accrued Annual Leave
            </p>
            <Button variant="outline" className="w-full mt-4">
                Request Leave
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
