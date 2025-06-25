
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle, Megaphone, AlertTriangle, Info } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockNotices, mockStaff, mockUsers } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Notice } from "@/lib/types";
import { CreateEditNoticeDialog } from "./CreateEditNoticeDialog";
import { format } from "date-fns";

const noticeTypeIcons: Record<Notice['type'], React.ElementType> = {
    Urgent: Megaphone,
    Warning: AlertTriangle,
    Info: Info,
};

export function NoticeManagement() {
    const [notices, setNotices] = useState<Notice[]>(mockNotices);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentNotice, setCurrentNotice] = useState<Notice | null>(null);
    const allStaff = [...mockStaff, ...Object.values(mockUsers)];

    const handleCreateNotice = () => {
        setCurrentNotice(null);
        setIsDialogOpen(true);
    };

    const handleEditNotice = (notice: Notice) => {
        setCurrentNotice(notice);
        setIsDialogOpen(true);
    };

    const handleDeleteNotice = (noticeId: string) => {
        setNotices(prev => prev.filter(notice => notice.id !== noticeId));
    };

    const handleSaveNotice = (savedNotice: Partial<Notice>) => {
        if (savedNotice.id && notices.some(n => n.id === savedNotice.id)) {
            // Update existing
            setNotices(prev => prev.map(n => n.id === savedNotice.id ? {...n, ...savedNotice} : n));
        } else {
            // Create new
            const newNotice: Notice = {
                id: `notice-${Date.now()}`,
                title: savedNotice.title!,
                content: savedNotice.content!,
                type: savedNotice.type!,
                status: savedNotice.status!,
                authorId: 'user-1', // In a real app, this would be the current user's ID
                createdAt: new Date(),
            };
            setNotices(prev => [...prev, newNotice]);
        }
    };
    
    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle>Notice Management</CardTitle>
                            <CardDescription>Create, edit, and manage announcements for the dashboard notice board.</CardDescription>
                        </div>
                        <Button onClick={handleCreateNotice}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Create Notice
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Author</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {notices.map((notice) => {
                                const author = allStaff.find(s => s.id === notice.authorId);
                                const statusVariant = notice.status === 'Published' ? 'default' : 'secondary';
                                const statusClass = notice.status === 'Published'
                                    ? "bg-green-500/20 text-green-700 border-green-500/30 hover:bg-green-500/30"
                                    : "bg-gray-500/20 text-gray-700 border-gray-500/30 hover:bg-gray-500/30";
                                const Icon = noticeTypeIcons[notice.type];

                                return (
                                    <TableRow key={notice.id}>
                                        <TableCell className="font-medium">{notice.title}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Icon className="h-4 w-4 text-muted-foreground" />
                                                {notice.type}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={statusVariant} className={cn(statusClass)}>{notice.status}</Badge>
                                        </TableCell>
                                        <TableCell>{author?.name || 'N/A'}</TableCell>
                                        <TableCell>{format(notice.createdAt, "dd MMM yyyy")}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleEditNotice(notice)}>Edit</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteNotice(notice.id)}>Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <CreateEditNoticeDialog
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
                notice={currentNotice}
                onSave={handleSaveNotice}
            />
        </>
    );
}
