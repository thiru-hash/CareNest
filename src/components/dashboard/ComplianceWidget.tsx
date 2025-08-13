'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, AlertTriangle, CheckCircle, Clock, FileText, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockComplianceItems } from '@/lib/data';
import type { Staff, ComplianceItem } from '@/lib/types';

interface ComplianceWidgetProps {
  currentUser: Staff;
}

export function ComplianceWidget({ currentUser }: ComplianceWidgetProps) {
  const { toast } = useToast();
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([]);
  const [overallCompliance, setOverallCompliance] = useState(0);

  // Check if user is a support facilitator
  const isSupportFacilitator = currentUser.role === 'Support Worker' || 
                               currentUser.role === 'Support Manager' ||
                               currentUser.role === 'Behavioural Support';

  useEffect(() => {
    if (isSupportFacilitator) {
      // Filter compliance items for current user
      const userComplianceItems = mockComplianceItems.filter(item => 
        item.staffId === currentUser.id
      );

      setComplianceItems(userComplianceItems);

      // Calculate overall compliance percentage
      const totalItems = userComplianceItems.length;
      const compliantItems = userComplianceItems.filter(item => 
        item.status === 'Compliant'
      ).length;
      
      const percentage = totalItems > 0 ? Math.round((compliantItems / totalItems) * 100) : 100;
      setOverallCompliance(percentage);
    }
  }, [currentUser, isSupportFacilitator]);

  const getComplianceStatus = (item: ComplianceItem) => {
    const now = new Date();
    const renewalDate = new Date(item.renewalDate);
    const daysUntilRenewal = Math.floor((renewalDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (item.status === 'Overdue') {
      return { 
        status: 'overdue', 
        label: 'Overdue', 
        color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        icon: AlertTriangle,
        days: Math.abs(daysUntilRenewal)
      };
    } else if (item.status === 'Expiring Soon') {
      return { 
        status: 'expiring', 
        label: 'Expiring Soon', 
        color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
        icon: Clock,
        days: daysUntilRenewal
      };
    } else {
      return { 
        status: 'compliant', 
        label: 'Compliant', 
        color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        icon: CheckCircle,
        days: daysUntilRenewal
      };
    }
  };

  const getComplianceIcon = (title: string) => {
    if (title.toLowerCase().includes('first aid')) return Shield;
    if (title.toLowerCase().includes('driver')) return Calendar;
    if (title.toLowerCase().includes('background')) return Shield;
    if (title.toLowerCase().includes('cpr')) return Shield;
    if (title.toLowerCase().includes('police')) return Shield;
    return FileText;
  };

  const handleRenewal = (item: ComplianceItem) => {
    toast({
      title: "Renewal Requested",
      description: `Renewal request sent for ${item.title}`,
    });
  };

  if (!isSupportFacilitator) {
    return null;
  }

  const overdueItems = complianceItems.filter(item => item.status === 'Overdue');
  const expiringItems = complianceItems.filter(item => item.status === 'Expiring Soon');
  const compliantItems = complianceItems.filter(item => item.status === 'Compliant');

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-700">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-amber-600" />
          <CardTitle className="text-lg">Compliance Status</CardTitle>
          <Badge variant="outline" className="ml-auto">
            {overallCompliance}% compliant
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Overall Compliance Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Overall Compliance
            </span>
            <span className="text-sm text-gray-500">
              {overallCompliance}%
            </span>
          </div>
          <Progress value={overallCompliance} className="h-2" />
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>{compliantItems.length} compliant</span>
            <span>{expiringItems.length} expiring soon</span>
            <span>{overdueItems.length} overdue</span>
          </div>
        </div>

        {/* Compliance Items */}
        {complianceItems.length === 0 ? (
          <div className="text-center py-6">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No compliance items found</p>
            <p className="text-sm text-gray-400 mt-1">All requirements are up to date</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Overdue Items */}
            {overdueItems.map((item) => {
              const status = getComplianceStatus(item);
              const Icon = getComplianceIcon(item.title);
              
              return (
                <div
                  key={item.id}
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Icon className="h-5 w-5 text-red-600 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`text-xs ${status.color}`}>
                            {status.label}
                          </Badge>
                          <span className="text-sm text-red-600 dark:text-red-400">
                            {status.days} days overdue
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Due: {new Date(item.renewalDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRenewal(item)}
                      className="border-red-300 text-red-700 hover:bg-red-100"
                    >
                      Renew Now
                    </Button>
                  </div>
                </div>
              );
            })}

            {/* Expiring Soon Items */}
            {expiringItems.map((item) => {
              const status = getComplianceStatus(item);
              const Icon = getComplianceIcon(item.title);
              
              return (
                <div
                  key={item.id}
                  className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg p-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Icon className="h-5 w-5 text-orange-600 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`text-xs ${status.color}`}>
                            {status.label}
                          </Badge>
                          <span className="text-sm text-orange-600 dark:text-orange-400">
                            {status.days} days left
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Due: {new Date(item.renewalDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRenewal(item)}
                      className="border-orange-300 text-orange-700 hover:bg-orange-100"
                    >
                      Renew
                    </Button>
                  </div>
                </div>
              );
            })}

            {/* Compliant Items */}
            {compliantItems.slice(0, 3).map((item) => {
              const status = getComplianceStatus(item);
              const Icon = getComplianceIcon(item.title);
              
              return (
                <div
                  key={item.id}
                  className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-3"
                >
                  <div className="flex items-start gap-3">
                    <Icon className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`text-xs ${status.color}`}>
                          {status.label}
                        </Badge>
                        <span className="text-sm text-green-600 dark:text-green-400">
                          {status.days} days remaining
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Renews: {new Date(item.renewalDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Show more compliant items if there are more */}
            {compliantItems.length > 3 && (
              <div className="text-center pt-2">
                <Button variant="ghost" size="sm" className="text-gray-500">
                  View {compliantItems.length - 3} more compliant items
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 