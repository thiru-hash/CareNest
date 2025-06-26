import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SidebarNav } from "@/components/layout/SidebarNav";
import { Header } from "@/components/layout/Header";
import { getCurrentUser } from "@/lib/auth";
import { mockNotices } from "@/lib/data";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const currentUser = await getCurrentUser();
  const publishedNotices = mockNotices.filter(n => n.status === 'Published').sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <SidebarProvider>
      <SidebarNav user={currentUser} />
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <Header user={currentUser} notices={publishedNotices} />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
