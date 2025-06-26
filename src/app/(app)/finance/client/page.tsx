
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
import { ArrowRight, Search } from "lucide-react";
import { mockClients, mockProperties } from "@/lib/data";
import Link from "next/link";
import { Input } from "@/components/ui/input";

export default async function ClientFinanceListPage() {
  return (
    <div className="space-y-6">
        <Card>
        <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <CardTitle>Client-Level Finance</CardTitle>
                    <CardDescription>Select a client to view and manage their individual financial details.</CardDescription>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search clients..." className="pl-8" />
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Location</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {mockClients.map((client) => {
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
                    <TableCell className="text-right">
                        <Button asChild variant="outline" size="sm">
                            <Link href={`/finance/client/${client.id}`}>
                                View Finances
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </TableCell>
                    </TableRow>
                )})
                }
            </TableBody>
            </Table>
        </CardContent>
        </Card>
    </div>
  );
}
