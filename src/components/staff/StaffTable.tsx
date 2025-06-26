

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, UserPlus, ArrowRight } from "lucide-react";
import { mockStaff } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";

export async function StaffTable() {
  const currentUser = await getCurrentUser();

  const staffToDisplay = currentUser.role === 'System Admin'
    ? mockStaff
    : mockStaff.filter(staff => staff.id === currentUser.id);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>Staff Members</CardTitle>
                <CardDescription>View and manage staff members in the system.</CardDescription>
            </div>
            {currentUser.role === 'System Admin' && (
                <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Staff
                </Button>
            )}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staffToDisplay.length > 0 ? staffToDisplay.map((staff) => (
              <TableRow key={staff.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={staff.avatarUrl} alt={staff.name} />
                      <AvatarFallback>{staff.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p>{staff.name}</p>
                        <p className="text-sm text-muted-foreground">{staff.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{staff.role}</TableCell>
                <TableCell>{staff.phone}</TableCell>
                <TableCell className="text-right">
                   <Button asChild variant="outline" size="sm">
                      <Link href={`/staff/${staff.id}`}>
                          View Profile
                          <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                  </Button>
                </TableCell>
              </TableRow>
            )) : (
                <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                        No staff records to display.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
