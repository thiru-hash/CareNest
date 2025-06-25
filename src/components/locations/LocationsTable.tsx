
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { mockProperties, mockStaff } from "@/lib/data";
import { getAccessiblePropertyIds } from "@/lib/access-control";
import type { User, Staff } from "@/lib/types";

// In a real app, this would come from an authentication context/session
const currentUser: User | Staff = mockStaff.find(s => s.id === 'staff-admin')!;

export async function LocationsTable() {
  const accessiblePropertyIds = await getAccessiblePropertyIds(currentUser.id);
  const accessibleProperties = mockProperties.filter(p => accessiblePropertyIds.includes(p.id));

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Locations</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Status</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accessibleProperties.length > 0 ? (
              accessibleProperties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell className="font-medium">{property.name}</TableCell>
                  <TableCell>{property.address}</TableCell>
                  <TableCell>
                    <Badge variant={property.status === 'Active' ? 'default' : 'destructive'} className="bg-green-500/20 text-green-700 border-green-500/30 hover:bg-green-500/30">
                      {property.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  You do not have access to any locations at this time.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
