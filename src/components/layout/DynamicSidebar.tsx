"use client";

import { SidebarNav } from './SidebarNav';

export function DynamicSidebar({ collapsed, setCollapsed }) {
  return <SidebarNav collapsed={collapsed} setCollapsed={setCollapsed} />;
} 