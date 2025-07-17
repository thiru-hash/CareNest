"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  Clock, 
  FileText, 
  Download, 
  Plus,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

interface Task {
  id: number;
  title: string;
  dueDate: string;
  priority: string;
  completed: boolean;
}

interface Document {
  id: number;
  title: string;
  type: string;
  submittedDate: string;
  color: string;
}

interface Activity {
  id: number;
  action: string;
  time: string;
}

interface ClientOverviewProps {
  clientId: string;
  tasks: Task[];
  documents: Document[];
  activity: Activity[];
  mode: 'view' | 'edit';
}

export default function ClientOverview({ 
  clientId, 
  tasks, 
  documents, 
  activity, 
  mode 
}: ClientOverviewProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tasks Summary */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Recent Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Pending Tasks</span>
                <Badge variant="outline">{tasks.filter(t => !t.completed).length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Completed Today</span>
                <Badge variant="default" className="bg-green-500">
                  {tasks.filter(t => t.completed).length}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents Summary */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Documents</span>
                <Badge variant="outline">{documents.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Recent Uploads</span>
                <Badge variant="default" className="bg-green-500">
                  {documents.filter(d => new Date(d.submittedDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Summary */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Last Updated</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {activity.length > 0 ? activity[0].time : 'No activity'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Activities</span>
                <Badge variant="outline">{activity.length}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Tasks</span>
              {mode === 'edit' && (
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle 
                      className={`h-4 w-4 ${task.completed ? 'text-green-500' : 'text-gray-400'}`} 
                    />
                    <div>
                      <p className={`text-sm ${task.completed ? 'line-through text-gray-500' : ''}`}>
                        {task.title}
                      </p>
                      <p className="text-xs text-gray-500">{task.dueDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={task.priority === 'high' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {task.priority}
                    </Badge>
                    {mode === 'edit' && (
                      <Button size="sm" variant="ghost">
                        <Edit className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Documents List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Documents</span>
              {mode === 'edit' && (
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full bg-${doc.color}-500`}></div>
                    <div>
                      <p className="text-sm font-medium">{doc.title}</p>
                      <p className="text-xs text-gray-500">{doc.submittedDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Download className="h-3 w-3" />
                    </Button>
                    {mode === 'edit' && (
                      <Button size="sm" variant="ghost">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activity.map((item) => (
              <div key={item.id} className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm">{item.action}</p>
                  <p className="text-xs text-gray-500">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 