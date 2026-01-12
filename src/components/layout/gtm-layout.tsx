'use client';

import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from '@/components/ui/sidebar';
import { SidebarNav } from './sidebar-nav';
import { NavItem } from '@/lib/markdown';
import Link from 'next/link';

interface GTMLayoutProps {
  children: React.ReactNode;
  navigation: NavItem[];
}

export function GTMLayout({ children, navigation }: GTMLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-black text-white overflow-x-hidden">
        <Sidebar className="border-r border-neutral-900 bg-neutral-950">
          <SidebarContent className="p-4 bg-neutral-950">
            <div className="mb-8 mt-4 px-3">
              <Link href="/" className="text-2xl font-black tracking-tighter text-white">
                tier_1
              </Link>
            </div>
            <SidebarNav items={navigation} />
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
          <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-neutral-900 px-6 py-3 md:hidden">
            <SidebarTrigger className="text-brand" />
          </div>
          <div className="container max-w-4xl mx-auto px-6 py-12 flex-1 w-full">
            {children}
          </div>
          
          <footer className="mt-auto px-8 py-8 border-t border-neutral-900/50 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-lg font-black text-white tracking-tight">Trade like the 1%</span>
              <span className="text-lg font-black text-brand tracking-tight">Be the <span className="underline decoration-brand/30">Tier 1</span></span>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold text-neutral-600 uppercase tracking-widest">
              <span>© 2026 Tier 1</span>
              <span className="w-1 h-1 bg-neutral-800 rounded-full"></span>
              <span>Go-To-Market Strategy</span>
            </div>
          </footer>
        </main>
      </div>
    </SidebarProvider>
  );
}
