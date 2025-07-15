import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import { Header } from '@/components/layout/Header';
import { DynamicSidebar } from '@/components/layout/DynamicSidebar';
import { getCurrentUser } from '@/lib/auth';
import { MobileNav } from '@/components/layout/MobileNav';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'CareNest - Multi-Tenant Care Management Platform',
  description: 'A comprehensive B2B SaaS platform for care organizations',
};

// Mock tenant and user IDs for demonstration
// In a real app, these would come from authentication/session
const DEMO_TENANT_ID = 'tenant-1';
const DEMO_USER_ID = 'user-1'; // Sarah Johnson - Tenant Admin

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar - Hidden on mobile */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">CareNest</h1>
        </div>
        
        <nav className="flex-1 p-4">
          <DynamicSidebar />
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            Multi-Tenant Demo
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header currentUser={currentUser} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav currentUser={currentUser} />
    </div>
  );
}
