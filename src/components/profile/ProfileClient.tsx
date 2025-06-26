
"use client";

import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Plane, Hourglass, Camera } from "lucide-react";
import type { Staff } from "@/lib/data";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function ProfileClient({ currentUser }: { currentUser: Staff }) {
  const { toast } = useToast();
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClockInOut = () => {
    if (isClockedIn) {
      // Clocking out
      setIsClockedIn(false);
      // In a real app, this would create a timesheet record here.
      toast({
          title: "Clocked Out",
          description: `Clocked out at ${new Date().toLocaleTimeString()}. A timesheet has been created for your review.`,
      });
      setClockInTime(null);
    } else {
      // Clocking in
      const now = new Date();
      setIsClockedIn(true);
      setClockInTime(now);
       toast({
        title: "Clocked In",
        description: `You have clocked in at ${now.toLocaleTimeString()}`,
      });
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
        toast({
          title: "Profile Picture Updated",
          description: "Your new profile picture has been set.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    if (currentUser.role === 'System Admin') {
      fileInputRef.current?.click();
    }
  };


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start gap-6">
             <div className="relative group">
              <Avatar className="w-24 h-24 border-4 border-background shadow-md cursor-pointer" onClick={handleAvatarClick}>
                <AvatarImage src={avatarUrl} alt={currentUser.name} />
                <AvatarFallback className="text-3xl">{currentUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              {currentUser.role === 'System Admin' && (
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
              )}
               <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                className="hidden"
                accept="image/*"
              />
            </div>
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
             <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" className="w-full mt-4">
                        View Timesheets
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Timesheets</DialogTitle>
                        <DialogDescription>
                            This feature is coming soon. You'll be able to view and manage your timesheets here.
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
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
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" className="w-full mt-4">
                        Request Leave
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Leave Requests</DialogTitle>
                        <DialogDescription>
                            This feature is coming soon. You'll be able to submit and track your leave requests here.
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
