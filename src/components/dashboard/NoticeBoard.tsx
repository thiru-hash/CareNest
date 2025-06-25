import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { mockNotices, mockStaff, mockUsers } from "@/lib/data";
import { format } from "date-fns";
import { Megaphone, AlertTriangle, Info, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Notice } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const noticeConfig: Record<Notice['type'], { icon: React.ElementType, color: string }> = {
    Urgent: { icon: Megaphone, color: 'border-destructive' },
    Warning: { icon: AlertTriangle, color: 'border-yellow-500' },
    Info: { icon: Info, color: 'border-primary' },
};

export function NoticeBoard() {
  const publishedNotices = mockNotices.filter(n => n.status === 'Published').sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime());
  const allStaff = [...mockStaff, ...Object.values(mockUsers)];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notice Board</CardTitle>
        <CardDescription>Important announcements and updates for all staff.</CardDescription>
      </CardHeader>
      <CardContent>
        {publishedNotices.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {publishedNotices.map((notice, index) => {
              const config = noticeConfig[notice.type];
              const Icon = config.icon;
              const author = allStaff.find(s => s.id === notice.authorId);

              return (
                <AccordionItem key={notice.id} value={notice.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-4 w-full">
                      <Icon className={cn("h-6 w-6", config.color.replace('border-', 'text-'))} />
                      <div className="flex-1 text-left">
                        <p className="font-semibold">{notice.title}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <Avatar className="h-5 w-5">
                             <AvatarImage src={author?.avatarUrl} alt={author?.name} />
                             <AvatarFallback className="text-xs">{author?.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{author?.name || 'System'}</span>
                          <span>&bull;</span>
                          <span>{format(notice.createdAt, "dd MMM yyyy")}</span>
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="prose prose-sm max-w-none text-muted-foreground pl-14">
                    {notice.content}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">No notices to display.</p>
        )}
      </CardContent>
    </Card>
  );
}
