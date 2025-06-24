import { notFound } from "next/navigation";
import { mockClients, mockProperties } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LogSummary } from "@/components/people/LogSummary";
import { Building2, User } from "lucide-react";

export default function ClientProfilePage({ params }: { params: { id: string } }) {
  const client = mockClients.find((c) => c.id === params.id);

  if (!client) {
    notFound();
  }

  const property = mockProperties.find((p) => p.id === client.propertyId);

  return (
    <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start gap-6">
            <Avatar className="w-24 h-24 border-4 border-background shadow-md">
                <AvatarImage src={client.avatarUrl} alt={client.name} />
                <AvatarFallback className="text-3xl">{client.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <h1 className="text-3xl font-bold">{client.name}</h1>
                <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>Client ID: {client.id}</span>
                    </div>
                    {property && (
                        <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        <span>{property.name}</span>
                        </div>
                    )}
                </div>
                 <div className="mt-2">
                    <Badge variant={client.status === 'Active' ? 'default' : 'destructive'} className="bg-green-500/20 text-green-700 border-green-500/30 hover:bg-green-500/30">{client.status}</Badge>
                </div>
            </div>
        </div>

      <LogSummary client={client} />
    </div>
  );
}
