import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, TrendingDown, Activity } from 'lucide-react';

export function FinanceOverview() {
  const metrics = [
    {
      title: 'Total Revenue',
      value: '$124,500',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      title: 'Active Clients',
      value: '47',
      change: '+3.2%',
      trend: 'up',
      icon: Activity,
      color: 'text-blue-600',
    },
    {
      title: 'Monthly Expenses',
      value: '$89,200',
      change: '-2.1%',
      trend: 'down',
      icon: TrendingDown,
      color: 'text-orange-600',
    },
    {
      title: 'Profit Margin',
      value: '28.4%',
      change: '+1.8%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        const isPositive = metric.trend === 'up';
        
        return (
          <div key={metric.title} className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {metric.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metric.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg bg-gray-100 dark:bg-gray-800 ${metric.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                variant={isPositive ? 'default' : 'destructive'}
                className={`text-xs font-medium ${
                  isPositive 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}
              >
                {metric.change}
              </Badge>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                vs last month
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
