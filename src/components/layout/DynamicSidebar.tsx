"use client";

import { SidebarNav } from './SidebarNav';

interface DynamicSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  onSwitchUser?: () => void;
}

export function DynamicSidebar({ collapsed, setCollapsed, onSwitchUser }: DynamicSidebarProps) {
  return <SidebarNav collapsed={collapsed} setCollapsed={setCollapsed} onSwitchUser={onSwitchUser} />;
} 