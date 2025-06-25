"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockShifts, mockStaff, mockProperties, mockUsers } from "@/lib/data";
import { format, isFuture, isPast } from "date-fns";
import { Clock, MapPin, Send } from "lucide-react";
import type { User, Staff, Shift, UserRole } from "@/lib/types";

// In a real app, this would come from an authentication context/session.
const currentUser: User | Staff = mockStaff.find(s => s.id === 'staff-1')!;

export function UpcomingShifts() {
  const [shiftsToShow, setShiftsToShow] = useState<Shift[]>([]);
  const [cardTitle, setCardTitle] = useState("Upcoming Shifts");
  const [cardDescription, setCardDescription] = useState("Loading shifts...");
  const [clockedInShiftId, setClockedInShiftId] = useState<string | null>(null);

  useEffect(() => {
    const privilegedRoles: UserRole[] = ['Admin', 'Support Manager', 'Roster Team'];
    const isPrivilegedUser = privilegedRoles.includes(currentUser.role);
  
    let upcomingShifts: Shift[];

    const allUpcomingShifts = mockShifts
      .filter(s => isFuture(s.start) && (s.status === 'Assigned' || s.status === 'Open'))
      .sort((a, b) => a.start.getTime() - b.start.getTime());

    if (isPrivilegedUser) {
      upcomingShifts = allUpcomingShifts;
    } else {
      upcomingShifts = allUpcomingShifts.filter(s => s.staffId === currentUser.id || s.status === 'Open');
    }

    setShiftsToShow(upcomingShifts.slice(0, 5));
    setCardTitle(isPrivilegedUser ? 'Upcoming Shifts' : 'My Shifts & Open Shifts');
    setCardDescription(isPrivilegedUser 
      ? 'A view of all upcoming shifts across the organisation.' 
      : 'Your assigned shifts and available open shifts you can pick up.');
  }, []);

  const handleClockIn = (shiftId: string) => {
    setClockedInShiftId(shiftId);
    alert(`Clocked in for shift ${shiftId} at ${new Date().toLocaleTimeString()}`);
  };

  const handleClockOut = () => {
    const shiftId = clockedInShiftId;
    setClockedInShiftId(null);
    alert(`Clocked out from shift ${shiftId} at ${new Date().toLocaleTimeString()}. A timesheet has been created for your review.`);
  };

  const handleRequestShift = (shift: Shift) => {
    // In a real app, this would trigger a server action to send an email/notification.
    console.log(`[Notification Sent] User ${currentUser.name} (${currentUser.id}) requested open shift ${shift.id} for "${shift.title}".`);
    alert(`Your request to pick up the "${shift.title}" shift has been sent to the rostering team.`);
  };
  
  const canClockIn = (shift: Shift) => {
    // Allow clocking in if the shift has not ended yet.
    return !isPast(shift.end);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
        <CardDescription>{cardDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {shiftsToShow.length > 0 ? shiftsToShow.map((shift) => {
            const staff = mockStaff.find(s => s.id === shift.staffId);
            const property = mockProperties.find(p => p.id === shift.propertyId);
            const isThisShiftClockedIn = clockedInShiftId === shift.id;
            const isAnyShiftClockedIn = clockedInShiftId !== null;
            const canThisShiftBeClockedIn = canClockIn(shift);

            return (
              <div key={shift.id} className="flex flex-col gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center w-12">
                      <div className="font-bold text-lg">{format(shift.start, "dd")}</div>
                      <div className="text-sm text-muted-foreground">{format(shift.start, "MMM")}</div>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{shift.title}</p>
                    <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                      <Clock className="h-4 w-4" />
                      <span>{format(shift.start, "p")} - {format(shift.end, "p")}</span>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{property?.name || "N/A"}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {staff ? (
                       <Avatar className="h-8 w-8">
                         <AvatarImage src={staff.avatarUrl} alt={staff.name} />
                         <AvatarFallback>{staff.name.charAt(0)}</AvatarFallback>
                       </Avatar>
                    ) : (
                      <Badge variant={shift.status === 'Open' ? 'destructive' : 'secondary'}>{shift.status}</Badge>
                    )}
                  </div>
                </div>

                {shift.staffId === currentUser.id && canThisShiftBeClockedIn && (
                  <div className="w-full">
                    {isThisShiftClockedIn ? (
                      <Button onClick={handleClockOut} className="w-full bg-destructive hover:bg-destructive/90">
                        <Clock className="mr-2" /> Clock Out & End Shift
                      </Button>
                    ) : (
                      <Button onClick={() => handleClockIn(shift.id)} disabled={isAnyShiftClockedIn} className="w-full">
                        <Clock className="mr-2" /> Clock In & Start Shift
                      </Button>
                    )}
                  </div>
                )}
                
                {shift.status === 'Open' && (
                   <div className="w-full">
                     <Button onClick={() => handleRequestShift(shift)} variant="outline" className="w-full">
                       <Send className="mr-2" /> Request Shift
                     </Button>
                   </div>
                )}
              </div>
            );
          }) : (
            <p className="text-sm text-muted-foreground text-center py-4">No upcoming shifts to display.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
