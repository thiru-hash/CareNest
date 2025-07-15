'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, FileText, Plus, CalendarDays, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, addDays, differenceInDays } from 'date-fns';

interface LeaveRequest {
  id: string;
  type: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
  comments?: string;
}

export default function LeaveRequestPage() {
  const { toast } = useToast();
  const [newRequest, setNewRequest] = useState({
    type: '',
    startDate: '',
    endDate: '',
    reason: '',
    comments: ''
  });

  const [showNewForm, setShowNewForm] = useState(false);

  // Mock leave requests
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: '1',
      type: 'Annual Leave',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-01-19'),
      reason: 'Family vacation',
      status: 'Approved',
      submittedAt: new Date('2024-01-01'),
      approvedBy: 'Sarah Manager',
      approvedAt: new Date('2024-01-02'),
      comments: 'Approved - Enjoy your vacation!'
    },
    {
      id: '2',
      type: 'Sick Leave',
      startDate: new Date('2024-01-22'),
      endDate: new Date('2024-01-23'),
      reason: 'Medical appointment',
      status: 'Pending',
      submittedAt: new Date('2024-01-20')
    },
    {
      id: '3',
      type: 'Personal Leave',
      startDate: new Date('2024-02-10'),
      endDate: new Date('2024-02-10'),
      reason: 'Personal matters',
      status: 'Rejected',
      submittedAt: new Date('2024-01-25'),
      approvedBy: 'Sarah Manager',
      approvedAt: new Date('2024-01-26'),
      comments: 'Rejected - Please provide more details about the personal matter.'
    }
  ]);

  const leaveTypes = [
    'Annual Leave',
    'Sick Leave',
    'Personal Leave',
    'Bereavement Leave',
    'Maternity/Paternity Leave',
    'Study Leave',
    'Other'
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'Rejected':
        return <XCircle className="h-4 w-4" />;
      case 'Pending':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleSubmitRequest = () => {
    if (!newRequest.type || !newRequest.startDate || !newRequest.endDate || !newRequest.reason) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const startDate = new Date(newRequest.startDate);
    const endDate = new Date(newRequest.endDate);

    if (startDate > endDate) {
      toast({
        title: "Invalid Dates",
        description: "End date must be after start date.",
        variant: "destructive"
      });
      return;
    }

    const newLeaveRequest: LeaveRequest = {
      id: Date.now().toString(),
      type: newRequest.type,
      startDate,
      endDate,
      reason: newRequest.reason,
      status: 'Pending',
      submittedAt: new Date(),
      comments: newRequest.comments
    };

    setLeaveRequests(prev => [newLeaveRequest, ...prev]);
    setNewRequest({ type: '', startDate: '', endDate: '', reason: '', comments: '' });
    setShowNewForm(false);

    toast({
      title: "Leave Request Submitted",
      description: "Your leave request has been submitted for approval.",
    });
  };

  const calculateDays = (startDate: Date, endDate: Date) => {
    return differenceInDays(endDate, startDate) + 1;
  };

  return (
    <div className="min-h-screen bg-muted">
      <div className="w-full h-full p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl lg:text-3xl font-bold text-left">Leave Request</h1>
          <p className="text-muted-foreground text-left">Submit and manage your leave requests</p>
        </div>

        {/* New Request Button */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">My Leave Requests</h2>
            <p className="text-sm text-muted-foreground">View and manage your leave requests</p>
          </div>
          <Button onClick={() => setShowNewForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Leave Request
          </Button>
        </div>

        {/* New Request Form */}
        {showNewForm && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                New Leave Request
              </CardTitle>
              <CardDescription>Submit a new leave request</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="leaveType">Leave Type *</Label>
                  <Select value={newRequest.type} onValueChange={(value) => setNewRequest(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      {leaveTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newRequest.startDate}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newRequest.endDate}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <div className="p-3 bg-muted rounded-lg">
                    {newRequest.startDate && newRequest.endDate ? (
                      <span className="text-sm font-medium">
                        {calculateDays(new Date(newRequest.startDate), new Date(newRequest.endDate))} day(s)
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">Select dates to see duration</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reason">Reason *</Label>
                <Textarea
                  id="reason"
                  placeholder="Please provide a detailed reason for your leave request..."
                  value={newRequest.reason}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, reason: e.target.value }))}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="comments">Additional Comments</Label>
                <Textarea
                  id="comments"
                  placeholder="Any additional information or special requirements..."
                  value={newRequest.comments}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, comments: e.target.value }))}
                  rows={2}
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleSubmitRequest} className="flex-1">
                  Submit Request
                </Button>
                <Button variant="outline" onClick={() => setShowNewForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Leave Requests List */}
        <div className="space-y-4">
          {leaveRequests.map((request) => (
            <Card key={request.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{request.type}</h3>
                      <Badge className={getStatusColor(request.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(request.status)}
                          {request.status}
                        </div>
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {format(request.startDate, 'MMM dd, yyyy')} - {format(request.endDate, 'MMM dd, yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {calculateDays(request.startDate, request.endDate)} day(s)
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm"><strong>Reason:</strong> {request.reason}</p>
                      {request.comments && (
                        <p className="text-sm"><strong>Comments:</strong> {request.comments}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Submitted on {format(request.submittedAt, 'MMM dd, yyyy')}
                      </p>
                    </div>
                    
                    {request.approvedBy && (
                      <div className="mt-3 p-3 bg-muted rounded-lg">
                        <p className="text-sm">
                          <strong>Processed by:</strong> {request.approvedBy} on {format(request.approvedAt!, 'MMM dd, yyyy')}
                        </p>
                        {request.comments && (
                          <p className="text-sm mt-1"><strong>Response:</strong> {request.comments}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {leaveRequests.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Leave Requests</h3>
                <p className="text-muted-foreground mb-4">You haven't submitted any leave requests yet.</p>
                <Button onClick={() => setShowNewForm(true)}>
                  Submit Your First Request
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 