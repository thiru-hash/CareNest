"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockShifts, mockStaff, mockProperties } from "@/lib/data";
import { format, isFuture, isPast } from "date-fns";
import { Clock, MapPin, Send } from "lucide-react";
import type { Staff, Shift, UserRole, Timesheet } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { TimesheetDialog } from "../timesheet/TimesheetDialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { mockNotices, mockInvoices, mockPayrollRuns, mockComplianceItems } from "@/lib/data";
import { Megaphone, AlertTriangle, Info, User, DollarSign, FileWarning, Users, CalendarCheck2, CheckCircle2, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Notice } from "@/lib/types";
import { differenceInDays } from "date-fns";

// UpcomingShifts Component
export function UpcomingShifts({ currentUser }: { currentUser: Staff }) {
  const { toast } = useToast();
  const [shiftsToShow, setShiftsToShow] = useState<Shift[]>([]);
  const [cardTitle, setCardTitle] = useState("Upcoming Shifts");
  const [cardDescription, setCardDescription] = useState("Loading shifts...");
  const [clockedInShiftId, setClockedInShiftId] = useState<string | null>(null);
  
  const [requestedShiftIds, setRequestedShiftIds] = useState<string[]>([]);
  const [requestingShiftId, setRequestingShiftId] = useState<string | null>(null);
  const [requestMessage, setRequestMessage] = useState("");

  const [shiftForTimesheet, setShiftForTimesheet] = useState<Shift | null>(null);

  useEffect(() => {
    const privilegedRoles: UserRole[] = ['System Admin', 'Support Manager', 'Roster Admin'];
    const isPrivilegedUser = privilegedRoles.includes(currentUser.role);
  
    let upcomingShifts: Shift[];

    const allUpcomingShifts = mockShifts
      .filter(s => isFuture(s.end) && ['Assigned', 'Open', 'In Progress'].includes(s.status))
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
  }, [currentUser]);

  const handleClockIn = (shiftId: string) => {
    setClockedInShiftId(shiftId);
    toast({
      title: "Clocked In",
      description: `You have clocked in for shift ${shiftId} at ${new Date().toLocaleTimeString()}`,
    });
  };

  const handleClockOut = (shift: Shift) => {
    setClockedInShiftId(null);
    setShiftForTimesheet(shift);
  };
  
  const handleSendRequest = (shift: Shift, message: string) => {
    console.log(`[Notification Sent] User ${currentUser.name} (${currentUser.id}) requested open shift ${shift.id} for "${shift.title}" with message: "${message}"`);
    toast({
        title: "Request Sent",
        description: `Your request for the "${shift.title}" shift has been sent.`,
    });
    setRequestedShiftIds(prev => [...prev, shift.id]);
    setRequestingShiftId(null);
    setRequestMessage("");
    // In a real app, the backend would now handle this. If the shift is assigned to someone else,
    // a notification would be sent to all users who requested it, and it would be removed from their "Open Shifts" view.
  };

  const handleRequestClick = (shiftId: string) => {
    setRequestingShiftId(shiftId);
    setRequestMessage("");
  };

  const handleCancelRequest = () => {
    setRequestingShiftId(null);
    setRequestMessage("");
  }
  
  const canClockIn = (shift: Shift) => {
    // Allow clocking in if the shift has not ended yet.
    return !isPast(shift.end);
  }

  const handleSaveTimesheet = (timesheetData: Omit<Timesheet, 'id' | 'staffId'>) => {
    console.log("Timesheet submitted:", { ...timesheetData, staffId: currentUser.id });
    toast({
      title: "Timesheet Submitted",
      description: `Your timesheet for shift ${timesheetData.shiftId} has been submitted for approval.`,
    });
    setShiftForTimesheet(null);
  };


  return (
    <>
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
              const hasBeenRequested = requestedShiftIds.includes(shift.id);
              const isRequestFormOpen = requestingShiftId === shift.id;

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
                        <Button onClick={() => handleClockOut(shift)} className="w-full bg-destructive hover:bg-destructive/90">
                          <Clock className="mr-2" /> Clock Out & End Shift
                        </Button>
                      ) : (
                        <Button onClick={() => handleClockIn(shift.id)} disabled={isAnyShiftClockedIn} className="w-full">
                          <Clock className="mr-2" /> Clock In & Start Shift
                        </Button>
                      )}
                    </div>
                  )}
                  
                  {shift.status === 'Open' && !isRequestFormOpen && (
                     <div className="w-full">
                       <Button 
                         onClick={() => handleRequestClick(shift.id)} 
                         variant="outline" 
                         className="w-full"
                         disabled={hasBeenRequested}
                       >
                         <Send className="mr-2" />
                         {hasBeenRequested ? 'Request Sent' : 'Request Shift'}
                       </Button>
                     </div>
                  )}

                  {isRequestFormOpen && (
                    <div className="mt-2 space-y-2 border-t pt-3">
                      <Label htmlFor={`request-message-${shift.id}`}>Optional Message</Label>
                      <Textarea
                        id={`request-message-${shift.id}`}
                        placeholder="Add a message for the rostering team..."
                        value={requestMessage}
                        onChange={(e) => setRequestMessage(e.target.value)}
                      />
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={handleCancelRequest}>Cancel</Button>
                        <Button onClick={() => handleSendRequest(shift, requestMessage)}>
                          <Send className="mr-2" /> Send Request
                        </Button>
                      </div>
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
      {shiftForTimesheet && (
        <TimesheetDialog 
            shift={shiftForTimesheet}
            isOpen={!!shiftForTimesheet}
            setIsOpen={(isOpen) => !isOpen && setShiftForTimesheet(null)}
            onSave={handleSaveTimesheet}
        />
      )}
    </>
  );
}

// NoticeBoard Component
const noticeConfig: Record<Notice['type'], { icon: React.ElementType, color: string }> = {
    Urgent: { icon: Megaphone, color: 'border-destructive' },
    Warning: { icon: AlertTriangle, color: 'border-yellow-500' },
    Info: { icon: Info, color: 'border-primary' },
};

export function NoticeBoard() {
  const publishedNotices = mockNotices.filter(n => n.status === 'Published').sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime());
  const allStaff = [...mockStaff];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notice Board</CardTitle>
        <CardDescription>Important announcements and updates for all staff.</CardDescription>
      </CardHeader>
      <CardContent>
        {publishedNotices.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {publishedNotices.map((notice, index) => {
              const config = noticeConfig[notice.type];
              const Icon = config.icon;
              const author = allStaff.find(s => s.id === notice.authorId);

              return (
                <AccordionItem key={notice.id} value={notice.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-4 w-full">
                      <Icon className={cn("h-6 w-6", config.color.replace('border-', 'text-'))} />
                      <div className="flex-1 text-left">
                        <p className="font-semibold">{notice.title}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <Avatar className="h-5 w-5">
                             <AvatarImage src={author?.avatarUrl} alt={author?.name} />
                             <AvatarFallback className="text-xs">{author?.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{author?.name || 'System'}</span>
                          <span>&bull;</span>
                          <span>{format(notice.createdAt, "dd MMM yyyy")}</span>
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="prose prose-sm max-w-none text-muted-foreground pl-14">
                    {notice.content}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">No notices to display.</p>
        )}
      </CardContent>
    </Card>
  );
}

// FinanceOverview Component
export function FinanceOverview() {
  const totalInvoiced = mockInvoices.reduce((acc, inv) => acc + inv.amount, 0);
  const totalOverdue = mockInvoices
    .filter(inv => inv.status === 'Overdue')
    .reduce((acc, inv) => acc + inv.amount, 0);
  
  const nextPayroll = mockPayrollRuns
    .filter(run => run.status === 'Pending')
    .reduce((acc, run) => acc + run.netPay, 0);

  const upcomingInvoiceDue = mockInvoices
    .filter(inv => inv.status === 'Pending' && differenceInDays(inv.dueDate, new Date()) >= 0)
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Finance Overview</CardTitle>
        <CardDescription>A quick summary of key financial metrics.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Invoiced</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalInvoiced.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all clients</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Overdue</CardTitle>
            <FileWarning className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">${totalOverdue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Invoices &gt;30 days past due</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Next Payroll Due</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${nextPayroll.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">For pending payroll runs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Next Invoice Due</CardTitle>
            <CalendarCheck2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {upcomingInvoiceDue ? `$${upcomingInvoiceDue.amount.toLocaleString()}`: 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {upcomingInvoiceDue ? `Due on ${format(upcomingInvoiceDue.dueDate, 'dd MMM')}` : 'No upcoming invoices'}
            </p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}

// ComplianceRenewals Component
const statusConfig = {
    Overdue: { icon: AlertTriangle, color: 'text-destructive', badge: 'destructive' },
    'Expiring Soon': { icon: ShieldAlert, color: 'text-yellow-500', badge: 'secondary' },
    Compliant: { icon: CheckCircle2, color: 'text-green-500', badge: 'default' }
} as const;

export function ComplianceRenewals({ currentUser }: { currentUser: Staff }) {
  const hrRoles: UserRole[] = ['System Admin', 'Human Resources Manager', 'HR Admin', 'HR'];
  const isHR = hrRoles.includes(currentUser.role);
  
  const renewals = mockComplianceItems
    .filter(item => {
        if (isHR) {
            return item.status !== 'Compliant';
        }
        return item.staffId === currentUser.id && item.status !== 'Compliant';
    })
    .slice(0, 4);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compliance Renewals</CardTitle>
        <CardDescription>
          {isHR ? "Items needing attention across the organisation." : "Your items needing attention soon."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {renewals.map((item) => {
            const staff = mockStaff.find(s => s.id === item.staffId);
            const config = statusConfig[item.status];
            const Icon = config.icon;
            return (
              <div key={item.id} className="flex items-center gap-4">
                <Icon className={cn("h-6 w-6", config.color)} />
                <Avatar className="h-9 w-9">
                  <AvatarImage src={staff?.avatarUrl} alt={staff?.name} />
                  <AvatarFallback>{staff?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{staff?.name}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-medium">{format(item.renewalDate, "dd MMM yyyy")}</p>
                    <Badge variant={config.badge as any} className="mt-1">{item.status}</Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
} 