
"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import type { Notice } from "@/lib/types";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const noticeConfig: Record<Notice['type'], { label: string, badge: any }> = {
    Urgent: { label: 'Urgent', badge: 'destructive' },
    Warning: { label: 'Warning', badge: 'secondary' },
    Info: { label: 'Info', badge: 'default' },
};

export function NoticeDropdown({ notices }: { notices: Notice[] }) {
    const unreadCount = notices.length;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
                            {unreadCount}
                        </span>
                    )}
                    <span className="sr-only">Toggle notifications</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 md:w-96 p-0">
                <div className="p-2">
                    <DropdownMenuLabel>What's New</DropdownMenuLabel>
                </div>
                <DropdownMenuSeparator className="m-0" />
                <ScrollArea className="h-[400px]">
                    <div className="p-2 space-y-2">
                        {notices.length > 0 ? (
                            notices.map((notice) => {
                                const config = noticeConfig[notice.type];
                                return (
                                    <div key={notice.id} className="p-3 rounded-lg hover:bg-muted/50 space-y-1.5 border-b last:border-b-0">
                                        <div className="flex items-baseline justify-between">
                                            <p className="font-semibold">{notice.title}</p>
                                            <p className="text-xs text-muted-foreground whitespace-nowrap">
                                                {format(notice.createdAt, "dd MMM")}
                                            </p>
                                        </div>
                                        <p className="text-sm text-muted-foreground w-full line-clamp-3">
                                            {notice.content}
                                        </p>
                                        <Badge variant={config.badge}>{config.label}</Badge>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="p-4 text-sm text-center text-muted-foreground">
                                No new announcements.
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
