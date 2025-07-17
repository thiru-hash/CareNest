"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Activity, FileText, MessageSquare, Calendar, User } from 'lucide-react';

interface AIOverviewPanelProps {
  clientId: string;
  clientName: string;
}

interface ActivityItem {
  id: string;
  type: 'note' | 'document' | 'form' | 'appointment' | 'contact' | 'goal';
  title: string;
  description: string;
  author: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
}

export function AIOverviewPanel({ clientId, clientName }: AIOverviewPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [aiSummary, setAiSummary] = useState<string>('');
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);

  // Mock AI summary generation
  const generateAISummary = (activities: ActivityItem[]): string => {
    if (activities.length === 0) {
      return `No recent activity found for ${clientName}. This profile is ready for new information to be added.`;
    }

    const recentCount = activities.filter(a => {
      const activityDate = new Date(a.timestamp);
      const daysDiff = (Date.now() - activityDate.getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    }).length;

    const documentCount = activities.filter(a => a.type === 'document').length;
    const noteCount = activities.filter(a => a.type === 'note').length;
    const formCount = activities.filter(a => a.type === 'form').length;

    let summary = `Over the past week, there has been ${recentCount} new activities for ${clientName}. `;

    if (documentCount > 0) {
      summary += `${documentCount} new document${documentCount > 1 ? 's were' : ' was'} uploaded. `;
    }

    if (noteCount > 0) {
      summary += `${noteCount} new note${noteCount > 1 ? 's were' : ' was'} added by staff members. `;
    }

    if (formCount > 0) {
      summary += `${formCount} form${formCount > 1 ? 's were' : ' was'} completed. `;
    }

    const latestActivity = activities[0];
    if (latestActivity) {
      const timeAgo = getTimeAgo(new Date(latestActivity.timestamp));
      summary += `The most recent activity was ${latestActivity.title} by ${latestActivity.author} ${timeAgo}.`;
    }

    return summary;
  };

  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      return 'just now';
    }
  };

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'note':
        return <MessageSquare className="h-4 w-4" />;
      case 'document':
        return <FileText className="h-4 w-4" />;
      case 'form':
        return <FileText className="h-4 w-4" />;
      case 'appointment':
        return <Calendar className="h-4 w-4" />;
      case 'contact':
        return <User className="h-4 w-4" />;
      case 'goal':
        return <Activity className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: ActivityItem['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // Mock data loading
  const loadActivities = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock activities data
    const mockActivities: ActivityItem[] = [
      {
        id: '1',
        type: 'document',
        title: 'Medical Assessment Report',
        description: 'Annual medical assessment completed and uploaded',
        author: 'Dr. Sarah Johnson',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'high'
      },
      {
        id: '2',
        type: 'note',
        title: 'Progress Note',
        description: 'Client showed significant improvement in daily activities',
        author: 'John Smith',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'medium'
      },
      {
        id: '3',
        type: 'form',
        title: 'NDIS Plan Review',
        description: 'Annual NDIS plan review form submitted',
        author: 'Care Coordinator',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'high'
      },
      {
        id: '4',
        type: 'appointment',
        title: 'Physiotherapy Session',
        description: 'Scheduled physiotherapy session for next week',
        author: 'Reception',
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'medium'
      },
      {
        id: '5',
        type: 'goal',
        title: 'New Goal Set',
        description: 'Client set new goal for independent living skills',
        author: 'Support Worker',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'low'
      }
    ];

    setRecentActivities(mockActivities);
    const summary = generateAISummary(mockActivities);
    setAiSummary(summary);
    setLastUpdated(new Date());
    setIsLoading(false);
  };

  useEffect(() => {
    loadActivities();
  }, [clientId]);

  const handleRefresh = () => {
    loadActivities();
  };

  return (
    <div className="space-y-6">
      {/* AI Summary Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              AI Overview
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {isLoading ? 'Generating AI summary...' : aiSummary}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    {getActivityIcon(activity.type)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.title}
                    </h4>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getPriorityColor(activity.priority)}`}
                    >
                      {activity.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {activity.description}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      By {activity.author}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {getTimeAgo(new Date(activity.timestamp))}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 