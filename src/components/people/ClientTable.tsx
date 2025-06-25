
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { mockProperties, mockStaff } from "@/lib/data";
import { getAccessibleClients } from "@/lib/access-control";
import { User, Staff } from "@/lib/types";

// In a real app, this would come from an authentication context/session
const currentUser: User | Staff = mockStaff.find(s => s.id === 'staff-admin')!;

export async function ClientTable() {
  const accessibleClients = await getAccessibleClients(currentUser.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>People We Support</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accessibleClients.length > 0 ? (
              accessibleClients.map((client) => {
                const property = mockProperties.find(p => p.id === client.propertyId);
                return (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={client.avatarUrl} alt={client.name} />
                        <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {client.name}
                    </div>
                  </TableCell>
                  <TableCell>{property?.name || "N/A"}</TableCell>
                  <TableCell>
                    <Badge variant={client.status === 'Active' ? 'default' : 'outline'} className="bg-green-500/20 text-green-700 border-green-500/30 hover:bg-green-500/30">
                      {client.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="sm">
                        <Link href={`/people/${client.id}`}>
                            View Profile
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              )})
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  You do not have access to any client profiles at this time.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
