import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { mockShifts, mockStaff, mockProperties, mockUsers } from "@/lib/data";
import { format, isFuture } from "date-fns";
import { Clock, MapPin } from "lucide-react";
import type { User, Staff, Shift, UserRole } from "@/lib/types";

// In a real app, this would come from an authentication context/session.
// We are temporarily using a 'Support Worker' to demonstrate the dashboard customization for non-admins.
// To see the Admin view, change this to `mockUsers['user-1']`.
const currentUser: User | Staff = mockStaff.find(s => s.id === 'staff-1')!;

export async function UpcomingShifts() {
  const privilegedRoles: UserRole[] = ['Admin', 'Support Manager', 'Roster Team'];
  const isPrivilegedUser = privilegedRoles.includes(currentUser.role);
  
  let upcomingShifts: Shift[];

  // Get all future shifts that are either assigned or open, then sort them by date
  const allUpcomingShifts = mockShifts
    .filter(s => isFuture(s.start) && (s.status === 'Assigned' || s.status === 'Open'))
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  if (isPrivilegedUser) {
    // Privileged users see all upcoming shifts
    upcomingShifts = allUpcomingShifts;
  } else {
    // Other staff (e.g., Support Workers) see their own assigned shifts and all open shifts
    upcomingShifts = allUpcomingShifts.filter(s => s.staffId === currentUser.id || s.status === 'Open');
  }

  const shiftsToShow = upcomingShifts.slice(0, 5);
  const cardTitle = isPrivilegedUser ? 'Upcoming Shifts' : 'My Shifts & Open Shifts';
  const cardDescription = isPrivilegedUser 
    ? 'A view of all upcoming shifts across the organisation.' 
    : 'Your assigned shifts and available open shifts you can pick up.';

  return (
    <Card>
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
        <CardDescription>{cardDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {shiftsToShow.length > 0 ? shiftsToShow.map((shift) => {
            const staff = mockStaff.find(s => s.id === shift.staffId);
            const property = mockProperties.find(p => p.id === shift.propertyId);
            return (
              <div key={shift.id} className="flex items-start gap-4 p-2 rounded-lg hover:bg-muted/50">
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
            );
          }) : (
            <p className="text-sm text-muted-foreground text-center py-4">No upcoming shifts to display.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
