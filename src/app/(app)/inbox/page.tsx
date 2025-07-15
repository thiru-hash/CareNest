'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Search, Star, Trash2, Archive, Reply, Forward, MoreHorizontal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Message {
  id: string;
  from: string;
  fromEmail: string;
  subject: string;
  content: string;
  receivedAt: Date;
  isRead: boolean;
  isStarred: boolean;
  isArchived: boolean;
  priority: 'High' | 'Normal' | 'Low';
  category: 'System' | 'Roster' | 'Timesheet' | 'General';
}

export default function InboxPage() {
  const { toast } = useToast();
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'starred' | 'archived'>('all');

  // Mock messages
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      from: 'Sarah Manager',
      fromEmail: 'sarah.manager@carenest.com',
      subject: 'Shift Schedule Update - Week of Jan 15',
      content: 'Hi team, I\'ve updated the shift schedule for next week. Please review your assigned shifts and let me know if you have any conflicts.',
      receivedAt: new Date('2024-01-10T09:30:00'),
      isRead: false,
      isStarred: true,
      isArchived: false,
      priority: 'High',
      category: 'Roster'
    },
    {
      id: '2',
      from: 'System Administrator',
      fromEmail: 'system@carenest.com',
      subject: 'Timesheet Approval Required',
      content: 'Your timesheet for the week ending January 7, 2024 is ready for approval. Please review and submit.',
      receivedAt: new Date('2024-01-09T14:15:00'),
      isRead: true,
      isStarred: false,
      isArchived: false,
      priority: 'Normal',
      category: 'Timesheet'
    },
    {
      id: '3',
      from: 'HR Department',
      fromEmail: 'hr@carenest.com',
      subject: 'Updated Company Policies',
      content: 'Please review the updated company policies that have been posted to the staff portal. All staff members are required to acknowledge these changes.',
      receivedAt: new Date('2024-01-08T11:00:00'),
      isRead: true,
      isStarred: false,
      isArchived: false,
      priority: 'Normal',
      category: 'General'
    },
    {
      id: '4',
      from: 'System Administrator',
      fromEmail: 'system@carenest.com',
      subject: 'Two-Factor Authentication Reminder',
      content: 'This is a friendly reminder to set up two-factor authentication for your account. This is required for all staff members.',
      receivedAt: new Date('2024-01-07T16:45:00'),
      isRead: false,
      isStarred: false,
      isArchived: false,
      priority: 'High',
      category: 'System'
    }
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Normal':
        return 'bg-blue-100 text-blue-800';
      case 'Low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'System':
        return 'bg-purple-100 text-purple-800';
      case 'Roster':
        return 'bg-green-100 text-green-800';
      case 'Timesheet':
        return 'bg-orange-100 text-orange-800';
      case 'General':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' ||
                         (filter === 'unread' && !message.isRead) ||
                         (filter === 'starred' && message.isStarred) ||
                         (filter === 'archived' && message.isArchived);

    return matchesSearch && matchesFilter;
  });

  const handleMarkAsRead = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isRead: true } : msg
    ));
    toast({
      title: "Message Marked as Read",
      description: "The message has been marked as read.",
    });
  };

  const handleToggleStar = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isStarred: !msg.isStarred } : msg
    ));
  };

  const handleArchive = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isArchived: true } : msg
    ));
    toast({
      title: "Message Archived",
      description: "The message has been moved to archive.",
    });
  };

  const handleDelete = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
    if (selectedMessage?.id === messageId) {
      setSelectedMessage(null);
    }
    toast({
      title: "Message Deleted",
      description: "The message has been deleted.",
    });
  };

  const unreadCount = messages.filter(msg => !msg.isRead).length;

  return (
    <div className="min-h-screen bg-muted">
      <div className="w-full h-full p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl lg:text-3xl font-bold text-left">Inbox</h1>
          <p className="text-muted-foreground text-left">Manage your messages and notifications</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Message List */}
          <div className="lg:col-span-1 space-y-4">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search messages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant={filter === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilter('all')}
                    >
                      All
                    </Button>
                    <Button
                      variant={filter === 'unread' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilter('unread')}
                    >
                      Unread ({unreadCount})
                    </Button>
                    <Button
                      variant={filter === 'starred' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilter('starred')}
                    >
                      Starred
                    </Button>
                    <Button
                      variant={filter === 'archived' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilter('archived')}
                    >
                      Archived
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Messages */}
            <div className="space-y-2">
              {filteredMessages.map((message) => (
                <Card 
                  key={message.id} 
                  className={`cursor-pointer transition-colors ${
                    selectedMessage?.id === message.id ? 'ring-2 ring-primary' : ''
                  } ${!message.isRead ? 'bg-blue-50' : ''}`}
                  onClick={() => {
                    setSelectedMessage(message);
                    if (!message.isRead) {
                      handleMarkAsRead(message.id);
                    }
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`/avatars/${message.from.toLowerCase().replace(' ', '-')}.jpg`} />
                        <AvatarFallback>{message.from.charAt(0)}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className={`font-medium text-sm ${!message.isRead ? 'font-semibold' : ''}`}>
                            {message.from}
                          </p>
                          <Badge className={getPriorityColor(message.priority)} variant="secondary">
                            {message.priority}
                          </Badge>
                          <Badge className={getCategoryColor(message.category)} variant="secondary">
                            {message.category}
                          </Badge>
                        </div>
                        
                        <p className={`text-sm mb-1 ${!message.isRead ? 'font-semibold' : ''}`}>
                          {message.subject}
                        </p>
                        
                        <p className="text-xs text-muted-foreground mb-2">
                          {format(message.receivedAt, 'MMM dd, yyyy HH:mm')}
                        </p>
                        
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {message.content}
                        </p>
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleStar(message.id);
                          }}
                        >
                          <Star className={`h-4 w-4 ${message.isStarred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredMessages.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Messages</h3>
                    <p className="text-muted-foreground">
                      {searchTerm ? 'No messages match your search.' : 'Your inbox is empty.'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={`/avatars/${selectedMessage.from.toLowerCase().replace(' ', '-')}.jpg`} />
                          <AvatarFallback>{selectedMessage.from.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{selectedMessage.from}</h3>
                          <p className="text-sm text-muted-foreground">{selectedMessage.fromEmail}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getPriorityColor(selectedMessage.priority)}>
                          {selectedMessage.priority}
                        </Badge>
                        <Badge className={getCategoryColor(selectedMessage.category)}>
                          {selectedMessage.category}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {format(selectedMessage.receivedAt, 'MMM dd, yyyy HH:mm')}
                        </span>
                      </div>
                      
                      <h2 className="text-xl font-semibold">{selectedMessage.subject}</h2>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Reply className="h-4 w-4 mr-2" />
                        Reply
                      </Button>
                      <Button variant="outline" size="sm">
                        <Forward className="h-4 w-4 mr-2" />
                        Forward
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleArchive(selectedMessage.id)}>
                        <Archive className="h-4 w-4 mr-2" />
                        Archive
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(selectedMessage.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap">{selectedMessage.content}</div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Select a Message</h3>
                  <p className="text-muted-foreground">
                    Choose a message from the list to view its details.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 