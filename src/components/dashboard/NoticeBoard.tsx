import { Badge } from '@/components/ui/badge';
import { Bell, AlertCircle, Info, CheckCircle, Megaphone } from 'lucide-react';
import { mockNotices } from '@/lib/data';

export function NoticeBoard() {
  const recentNotices = mockNotices
    .filter(notice => notice.status === 'Published')
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'High':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'Medium':
        return <Info className="h-4 w-4 text-yellow-500" />;
      case 'Low':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      {recentNotices.length > 0 ? (
        recentNotices.map((notice) => (
          <div key={notice.id} className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                  {getPriorityIcon(notice.priority)}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                    {notice.title}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed mb-2">
                    {notice.content}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {new Date(notice.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Badge className={`text-xs font-medium ${getPriorityColor(notice.priority)}`}>
                {notice.priority}
              </Badge>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8">
          <div className="p-4 rounded-full bg-purple-100 dark:bg-purple-900 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Megaphone className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            No recent announcements
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            All caught up with updates
          </p>
        </div>
      )}
    </div>
  );
}
