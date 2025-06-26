import { ComplianceRenewals } from "@/components/dashboard/ComplianceRenewals";
import { UpcomingShifts } from "@/components/dashboard/UpcomingShifts";
import { NoticeBoard } from "@/components/dashboard/NoticeBoard";
import { FinanceOverview } from "@/components/dashboard/FinanceOverview";
import { getCurrentUser } from "@/lib/auth";

export default async function DashboardPage() {
  const currentUser = await getCurrentUser();

  return (
    <div className="grid gap-6">
        <NoticeBoard />
        <FinanceOverview />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            <UpcomingShifts currentUser={currentUser} />
            <ComplianceRenewals />
        </div>
    </div>
  );
}
