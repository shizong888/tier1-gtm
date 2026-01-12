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
      <div className="flex min-h-screen w-full bg-black text-white">
        <Sidebar className="border-r border-neutral-900 bg-neutral-950 shrink-0">
          <SidebarContent className="p-4 bg-neutral-950">
            <div className="mb-8 mt-4 px-3">
              <Link href="/" className="text-2xl font-black tracking-tighter text-white">
                tier_1
              </Link>
            </div>
            <SidebarNav items={navigation} />
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 flex flex-col min-w-0 relative h-screen">
          <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-neutral-900 px-6 py-3 md:hidden">
            <SidebarTrigger className="text-brand" />
          </div>
          <div className="flex-1 overflow-y-auto overflow-x-hidden min-w-0">
            <div className="container max-w-5xl mx-auto px-6 py-12">
              {children}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
