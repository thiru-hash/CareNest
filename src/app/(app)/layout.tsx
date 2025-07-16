import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import { Header } from '@/components/layout/Header';
import { DynamicSidebar } from '@/components/layout/DynamicSidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { mockStaff } from '@/lib/data';
import { useState, useEffect } from 'react';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'CareNest - Multi-Tenant Care Management Platform',
  description: 'A comprehensive B2B SaaS platform for care organizations',
};

const DEMO_TENANT_ID = 'tenant-1';
const DEMO_USER_ID = 'user-1';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = mockStaff.find(s => s.id === 'staff-admin');
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = typeof window !== 'undefined' && localStorage.getItem('sidebar-collapsed');
    setCollapsed(stored === 'true');
  }, []);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-collapsed', collapsed ? 'true' : 'false');
    }
  }, [collapsed]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar - Hidden on mobile */}
      <aside className="hidden lg:flex relative flex-col min-h-screen">
        <nav className="flex-1">
          <DynamicSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        </nav>
        <div className="p-4">
          <div className="text-xs text-gray-500">
            Multi-Tenant Demo
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={
        `flex-1 flex flex-col overflow-hidden transition-all duration-300 ${collapsed ? 'lg:ml-16' : 'lg:ml-56'}`
      }>
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
