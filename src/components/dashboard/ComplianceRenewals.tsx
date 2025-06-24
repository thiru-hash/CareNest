import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { mockComplianceItems, mockStaff } from "@/lib/data";
import { format } from "date-fns";
import { AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

const statusConfig = {
    Overdue: { icon: AlertTriangle, color: 'text-destructive', badge: 'destructive' },
    'Expiring Soon': { icon: ShieldAlert, color: 'text-yellow-500', badge: 'secondary' },
    Compliant: { icon: CheckCircle2, color: 'text-green-500', badge: 'default' }
} as const;


export function ComplianceRenewals() {
  const renewals = mockComplianceItems.filter(item => item.status !== 'Compliant').slice(0, 4);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compliance Renewals</CardTitle>
        <CardDescription>Items needing attention soon.</CardDescription>
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
