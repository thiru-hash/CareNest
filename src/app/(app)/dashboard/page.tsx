import { getCurrentUser } from '@/lib/auth';
import { UpcomingShifts, NoticeBoard, FinanceOverview, ComplianceRenewals } from '@/components/dashboard/DashboardClient';

export default async function DashboardPage() {
  const currentUser = await getCurrentUser();

  return (
    <div className="min-h-screen bg-muted">
      <div className="w-full h-full p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl lg:text-3xl font-bold text-left">Dashboard</h1>
          <p className="text-muted-foreground text-left">Welcome to your CareNest dashboard</p>
          <div className="text-xs text-muted-foreground">
            Current Time: {new Date().toLocaleTimeString()} | 
            Today: {new Date().toISOString().split('T')[0]}
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            <UpcomingShifts currentUser={currentUser} />
            <NoticeBoard />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <FinanceOverview />
            <ComplianceRenewals currentUser={currentUser} />
          </div>
        </div>
      </div>
    </div>
  );
}
