
import { notFound } from "next/navigation";
import { mockClients, mockProperties, mockSections, mockForms } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Building2, User } from "lucide-react";
import { canAccessClient } from "@/lib/access-control";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getCurrentUser } from "@/lib/auth";
import { ClientExpenseManager } from "@/components/finance/ClientExpenseManager";

// Placeholder component for rendering forms based on their configuration
function DynamicForm({ formId }: { formId: string }) {
  const form = mockForms.find(f => f.id === formId);
  if (!form) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Form Not Found</CardTitle>
                <CardDescription>The requested form could not be found in the configuration.</CardDescription>
            </CardHeader>
        </Card>
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>{form.name}</CardTitle>
        <CardDescription>This is a placeholder for the form. The full renderer will be implemented in a future step.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
            {form.fields.sort((a,b) => a.order - b.order).map(field => {
                if (field.type === 'headline') {
                    return <h3 key={field.id} className="text-lg font-semibold border-b pb-2 pt-4">{field.name}</h3>
                }
                return (
                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                        <Label htmlFor={field.id}>{field.name}{field.required ? <span className="text-destructive ml-1">*</span> : ''}</Label>
                        <Input id={field.id} placeholder={`Enter ${field.name}...`} className="md:col-span-2" disabled/>
                    </div>
                )
            })}
            {form.fields.length === 0 && <p className="text-muted-foreground">This form has no fields configured yet.</p>}
        </div>
      </CardContent>
    </Card>
  );
}

export default async function ClientProfilePage({ params }: { params: { id: string } }) {
  const currentUser = await getCurrentUser();
  const hasAccess = await canAccessClient(currentUser, params.id);
  if (!hasAccess) {
    notFound();
  }
  
  const client = mockClients.find((c) => c.id === params.id);

  if (!client) {
    notFound();
  }

  const property = mockProperties.find((p) => p.id === client.propertyId);

  // Find the 'People We Support' section configuration
  const peopleSection = mockSections.find(s => s.id === 'sec-people');
  const sectionTabs = peopleSection?.tabs?.sort((a, b) => a.order - b.order) || [];
  
  const defaultTab = sectionTabs[0];

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

        {sectionTabs.length > 0 && defaultTab ? (
             <Tabs defaultValue={defaultTab.id} className="w-full">
                <div className="overflow-x-auto pb-1">
                    <TabsList>
                        {sectionTabs.map(tab => (
                            <TabsTrigger key={tab.id} value={tab.id} className="whitespace-nowrap">
                                {tab.name}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                {sectionTabs.map(tab => (
                    <TabsContent key={tab.id} value={tab.id} className="mt-4">
                       {tab.id === 'tab-pws-9' ? (
                        <ClientExpenseManager clientId={client.id} />
                       ) : (
                        <DynamicForm formId={tab.formId} />
                       )}
                    </TabsContent>
                ))}
             </Tabs>
        ) : (
             <Card>
                <CardHeader>
                    <CardTitle>No Tabs Configured</CardTitle>
                    <CardDescription>There are no tabs configured for this section yet. Please ask an administrator to set them up.</CardDescription>
                </CardHeader>
            </Card>
        )}
    </div>
  );
}
