import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockShifts, mockStaff, mockProperties } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

export function ScheduleCalendar() {
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const day = new Date();
    day.setDate(day.getDate() + i);
    return day;
  });

  const shiftsByDay = daysOfWeek.map(day => 
    mockShifts.filter(shift => format(shift.start, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'))
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Roster</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                {daysOfWeek.map((day) => (
                  <TableHead key={day.toISOString()} className="text-center">
                    <div className="font-semibold">{format(day, 'EEE')}</div>
                    <div className="text-muted-foreground text-sm">{format(day, 'd MMM')}</div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                {shiftsByDay.map((dayShifts, index) => (
                  <TableCell key={index} className="align-top p-2 h-96 w-[14.28%]">
                    <div className="space-y-2">
                    {dayShifts.map((shift) => {
                      const staff = mockStaff.find(s => s.id === shift.staffId);
                      const property = mockProperties.find(p => p.id === shift.propertyId);
                      return (
                        <div key={shift.id} className="p-2 rounded-lg bg-accent/50 border border-accent">
                          <p className="font-bold text-primary">{shift.title}</p>
                          <p className="text-xs text-muted-foreground">{format(shift.start, 'p')} - {format(shift.end, 'p')}</p>
                          <p className="text-xs mt-1">{property?.name}</p>
                          <div className="mt-2">
                            {staff ? (
                                <Badge variant="secondary">{staff.name}</Badge>
                            ) : (
                                <Badge variant="destructive">{shift.status}</Badge>
                            )}
                          </div>
                        </div>
                      )
                    })}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
