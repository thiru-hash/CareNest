import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { mockShifts, mockStaff, mockProperties } from "@/lib/data";
import { format } from "date-fns";
import { Calendar, Clock, MapPin } from "lucide-react";

export function UpcomingShifts() {
  const upcoming = mockShifts.filter(s => s.status === 'Assigned' || s.status === 'Open').slice(0, 4);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Shifts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcoming.map((shift) => {
            const staff = mockStaff.find(s => s.id === shift.staffId);
            const property = mockProperties.find(p => p.id === shift.propertyId);
            return (
              <div key={shift.id} className="flex items-start gap-4 p-2 rounded-lg hover:bg-muted/50">
                <div className="flex flex-col items-center">
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
          })}
        </div>
      </CardContent>
    </Card>
  );
}
