import { ComplianceRenewals } from "@/components/dashboard/ComplianceRenewals";
import { UpcomingShifts } from "@/components/dashboard/UpcomingShifts";
import { FinanceOverview } from "@/components/dashboard/FinanceOverview";
import { getCurrentUser } from "@/lib/auth";
import type { UserRole } from "@/lib/types";

export default async function DashboardPage() {
  const currentUser = await getCurrentUser();

  const financeRoles: UserRole[] = ['System Admin', 'Finance Admin', 'CEO', 'GM Service'];
  const canViewFinance = financeRoles.includes(currentUser.role);

  return (
    <div className="grid gap-6">
        {canViewFinance && <FinanceOverview />}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            <UpcomingShifts currentUser={currentUser} />
            <ComplianceRenewals currentUser={currentUser} />
        </div>
    </div>
  );
}
