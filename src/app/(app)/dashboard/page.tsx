import { ComplianceRenewals } from "@/components/dashboard/ComplianceRenewals";
import { UpcomingShifts } from "@/components/dashboard/UpcomingShifts";

export default function DashboardPage() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        <UpcomingShifts />
        <ComplianceRenewals />
    </div>
  );
}
