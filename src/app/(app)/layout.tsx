"use client";

import { Inter } from 'next/font/google';
import '../globals.css';
import { Header } from '@/components/layout/Header';
import { DynamicSidebar } from '@/components/layout/DynamicSidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { ImpersonationBanner } from '@/components/layout/ImpersonationBanner';
import { UserImpersonationDialog } from '@/components/layout/UserImpersonationDialog';
import { TabProvider } from '@/lib/tab-context';
import { mockStaff } from '@/lib/data';
import { useState, useEffect } from 'react';
import type { Staff } from '@/lib/types';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap'
});

const DEMO_TENANT_ID = 'tenant-1';
const DEMO_USER_ID = 'user-1';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = mockStaff.find(s => s.id === 'staff-admin');
  const [collapsed, setCollapsed] = useState(false);
  const [impersonatedUser, setImpersonatedUser] = useState<Staff | null>(null);
  const [impersonationDialogOpen, setImpersonationDialogOpen] = useState(false);

  useEffect(() => {
    const stored = typeof window !== 'undefined' && localStorage.getItem('sidebar-collapsed');
    setCollapsed(stored === 'true');
  }, []);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-collapsed', collapsed ? 'true' : 'false');
    }
  }, [collapsed]);

  const handleUserImpersonation = (user: Staff) => {
    setImpersonatedUser(user);
    // Store in localStorage for persistence across page refreshes
    if (typeof window !== 'undefined') {
      localStorage.setItem('impersonated-user', JSON.stringify(user));
    }
  };

  const handleStopImpersonating = () => {
    setImpersonatedUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('impersonated-user');
    }
  };

  // Load impersonated user from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('impersonated-user');
      if (stored) {
        try {
          setImpersonatedUser(JSON.parse(stored));
        } catch (error) {
          console.error('Error parsing impersonated user:', error);
        }
      }
    }
  }, []);

  // Determine which user to display (impersonated or current)
  const displayUser = impersonatedUser || currentUser;

  return (
    <TabProvider>
      <div className="flex h-screen bg-gray-50">
        {/* Impersonation Banner */}
        {impersonatedUser && (
          <div className="fixed top-0 left-0 right-0 z-50">
            <ImpersonationBanner
              impersonatedUser={{
                id: impersonatedUser.id,
                name: impersonatedUser.name,
                email: impersonatedUser.email,
                role: impersonatedUser.role,
              }}
              onStopImpersonating={handleStopImpersonating}
            />
          </div>
        )}

        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <DynamicSidebar 
            collapsed={collapsed} 
            setCollapsed={setCollapsed}
            onSwitchUser={() => setImpersonationDialogOpen(true)}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header currentUser={displayUser} />
          <main className={`flex-1 overflow-y-auto p-4 sm:p-6 ${impersonatedUser ? 'pt-20' : ''}`}>
            {children}
          </main>
        </div>

        {/* Mobile Navigation */}
        <MobileNav currentUser={displayUser} />

        {/* User Impersonation Dialog */}
        <UserImpersonationDialog
          open={impersonationDialogOpen}
          onOpenChange={setImpersonationDialogOpen}
          onUserSelect={handleUserImpersonation}
        />
      </div>
    </TabProvider>
  );
}
