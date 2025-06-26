import { getCurrentUser } from "@/lib/auth";
import { mockStaff } from "@/lib/data";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Briefcase, Cake, Edit, FileText, Landmark, Shield, User } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function StaffProfilePage({ params }: { params: { id: string } }) {
  const currentUser = await getCurrentUser();
  const staffMember = mockStaff.find(s => s.id === params.id);

  if (!staffMember) {
    notFound();
  }

  const isViewingSelf = currentUser.id === staffMember.id;
  const isHr = ['Human Resources Manager', 'HR Admin', 'HR'].includes(currentUser.role);
  const isFinance = ['Finance Admin'].includes(currentUser.role);
  const isAdmin = currentUser.role === 'System Admin';

  const canViewPersonal = isViewingSelf || isHr || isAdmin;
  const canViewFinance = isFinance || isAdmin;
  const canViewHr = isHr || isAdmin;
  const canEdit = isAdmin;

  return (
    <div className="space-y-6">
       <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start gap-6">
              <Avatar className="w-24 h-24 border-4 border-background shadow-md">
                <AvatarImage src={staffMember.avatarUrl} alt={staffMember.name} />
                <AvatarFallback className="text-3xl">{staffMember.name.charAt(0)}</AvatarFallback>
              </Avatar>
            <div className="flex-1 pt-2">
              <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">{staffMember.name}</h1>
                    <p className="text-muted-foreground">{staffMember.role}</p>
                </div>
                {canEdit && <Button><Edit className="mr-2 h-4 w-4" /> Edit Profile</Button>}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>General Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" defaultValue={staffMember.name} disabled={!canEdit} />
                        </div>
                        <div>
                            <Label htmlFor="role">Role</Label>
                            <Input id="role" defaultValue={staffMember.role} disabled={!canEdit} />
                        </div>
                         <div>
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" defaultValue={staffMember.email} disabled={!canEdit} />
                        </div>
                         <div>
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" type="tel" defaultValue={staffMember.phone} disabled={!canEdit} />
                        </div>
                    </div>
                </CardContent>
            </Card>

             {canViewPersonal && (
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="dob">Date of Birth</Label>
                                <Input id="dob" defaultValue={staffMember.personalDetails ? format(staffMember.personalDetails.dob, 'dd MMMM yyyy') : ''} disabled />
                            </div>
                            <div>
                                <Label htmlFor="address">Address</Label>
                                <Input id="address" defaultValue={staffMember.personalDetails?.address} disabled={!canEdit} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
            
            {canViewFinance && (
                <Card>
                    <CardHeader>
                        <CardTitle>Salary & Employment</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid sm:grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="startDate">Start Date</Label>
                                <Input id="startDate" defaultValue={staffMember.employmentDetails ? format(staffMember.employmentDetails.startDate, 'dd MMMM yyyy') : ''} disabled />
                            </div>
                            <div>
                                <Label htmlFor="employmentType">Employment Type</Label>
                                <Input id="employmentType" defaultValue={staffMember.employmentDetails?.employmentType} disabled={!canEdit} />
                            </div>
                            <div>
                                <Label htmlFor="payRate">Pay Rate (per hour)</Label>
                                <div className="relative">
                                    <Landmark className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input id="payRate" type="number" defaultValue={staffMember.employmentDetails?.payRate} className="pl-8" disabled={!canEdit} />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
        <div className="lg:col-span-1 space-y-6">
            {canViewHr && (
                <Card>
                    <CardHeader>
                         <CardTitle>HR Documents & Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Label>Interview Notes</Label>
                        <p className="text-sm text-muted-foreground p-3 border rounded-md bg-muted/50 min-h-[60px]">
                            {staffMember.hrDetails?.interviewNotes || "No interview notes recorded."}
                        </p>
                        
                        <Label className="mt-4 block">Documents</Label>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Type</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {staffMember.hrDetails?.documents && staffMember.hrDetails.documents.length > 0 ? staffMember.hrDetails.documents.map(doc => (
                                    <TableRow key={doc.id}>
                                        <TableCell className="font-medium flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-muted-foreground"/> {doc.name}
                                        </TableCell>
                                        <TableCell>{doc.type}</TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={2} className="text-center h-24">No documents uploaded.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
      </div>
    </div>
  );
}
