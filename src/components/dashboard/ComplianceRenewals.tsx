import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Clock, Shield, ExternalLink } from 'lucide-react';
import { mockComplianceItems } from '@/lib/data';
import type { Staff, UserRole } from '@/lib/types';

interface ComplianceRenewalsProps {
  currentUser?: Staff;
}

export function ComplianceRenewals({ currentUser }: ComplianceRenewalsProps) {
  const hrRoles: UserRole[] = ['System Admin', 'Human Resources Manager', 'HR Admin', 'HR'];
  const isHR = currentUser ? hrRoles.includes(currentUser.role) : false;
  
  // Filter compliance items based on user role
  const renewals = mockComplianceItems
    .filter(item => {
      if (isHR) {
        // HR can see all compliance items
        return true;
      } else {
        // Regular staff can only see their own compliance
        return item.staffId === currentUser?.id;
      }
    })
    .sort((a, b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime())
    .slice(0, 5);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Overdue':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'Expiring Soon':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'Compliant':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Expiring Soon':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Compliant':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      {renewals.length > 0 ? (
        <>
          {renewals.map((item) => (
            <div key={item.id} className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900">
                    {getStatusIcon(item.status)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Due: {new Date(item.renewalDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Badge className={`text-xs font-medium ${getStatusColor(item.status)}`}>
                  {item.status}
                </Badge>
              </div>
            </div>
          ))}
          
          {/* View All Compliance Link */}
          <div className="pt-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              View all compliance
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <div className="p-4 rounded-full bg-green-100 dark:bg-green-900 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            {isHR ? 'No compliance items found' : 'All your compliance items are up to date'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            {isHR ? 'No compliance records in the system' : 'No renewals needed'}
          </p>
        </div>
      )}
    </div>
  );
}
