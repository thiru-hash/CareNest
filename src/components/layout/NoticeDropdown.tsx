
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

const noticeConfig: Record<Notice['type'], { label: string, badge: any, color: string }> = {
    Urgent: { label: 'Urgent', badge: 'destructive', color: 'text-red-600' },
    Warning: { label: 'Warning', badge: 'secondary', color: 'text-orange-600' },
    Info: { label: 'Info', badge: 'default', color: 'text-blue-600' },
};

export function NoticeDropdown({ notices }: { notices: Notice[] }) {
    const unreadCount = notices.length;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full relative hover:bg-gray-100 dark:hover:bg-gray-800">
                    <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-sm">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                    <span className="sr-only">Toggle notifications</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 md:w-96 p-0 border-0 shadow-xl">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <DropdownMenuLabel className="text-base font-semibold text-gray-900 dark:text-white">
                        Notifications
                    </DropdownMenuLabel>
                    {unreadCount > 0 && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {unreadCount} new notification{unreadCount !== 1 ? 's' : ''}
                        </p>
                    )}
                </div>
                <ScrollArea className="h-[400px]">
                    <div className="p-2 space-y-1">
                        {notices.length > 0 ? (
                            notices.map((notice) => {
                                const config = noticeConfig[notice.type];
                                return (
                                    <div key={notice.id} className="p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 space-y-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                                                        {notice.title}
                                                    </p>
                                                    <Badge variant={config.badge} className="text-xs">
                                                        {config.label}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                                                    {notice.content}
                                                </p>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                                                {format(notice.createdAt, "MMM d")}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="p-8 text-center">
                                <Bell className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    No new notifications
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                    You're all caught up!
                                </p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
