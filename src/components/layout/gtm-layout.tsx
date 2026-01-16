'use client';

import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from '@/components/ui/sidebar';
import { SidebarNav } from './sidebar-nav';
import { NavItem } from '@/lib/markdown';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

interface GTMLayoutProps {
  children: React.ReactNode;
  navigation: NavItem[];
}

export function GTMLayout({ children, navigation }: GTMLayoutProps) {
  const router = useRouter();
  const lightLogoUrl = useQuery(api.settings.getLogoUrl, { mode: 'light' });
  const darkLogoUrl = useQuery(api.settings.getLogoUrl, { mode: 'dark' });

  const handleLogout = () => {
    // Clear the auth cookie
    document.cookie = 'tier1-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    // Redirect to login page
    router.push('/login');
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-white dark:bg-black text-black dark:text-white">
        <Sidebar collapsible="offcanvas" className="border-r border-neutral-200 dark:border-neutral-900 bg-neutral-50 dark:bg-neutral-950">
          <SidebarContent className="p-4 bg-neutral-50 dark:bg-neutral-950">
            <div className="mb-8 mt-4 px-3 flex items-center justify-between">
              <Link href="/" className="flex items-center">
                {lightLogoUrl || darkLogoUrl ? (
                  <>
                    {lightLogoUrl && (
                      <img
                        src={lightLogoUrl}
                        alt="Logo"
                        className="h-6 w-auto object-contain dark:hidden"
                      />
                    )}
                    {darkLogoUrl && (
                      <img
                        src={darkLogoUrl}
                        alt="Logo"
                        className="h-6 w-auto object-contain hidden dark:block"
                      />
                    )}
                    {!darkLogoUrl && lightLogoUrl && (
                      <img
                        src={lightLogoUrl}
                        alt="Logo"
                        className="h-6 w-auto object-contain hidden dark:block"
                      />
                    )}
                    {!lightLogoUrl && darkLogoUrl && (
                      <img
                        src={darkLogoUrl}
                        alt="Logo"
                        className="h-6 w-auto object-contain dark:hidden"
                      />
                    )}
                  </>
                ) : (
                  <span className="text-2xl font-black tracking-tighter text-black dark:text-white">
                    tier_1
                  </span>
                )}
              </Link>
              <ThemeToggle />
            </div>
            <SidebarNav items={navigation} />
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 flex flex-col min-w-0 relative h-screen">
          <div className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-900 px-4 py-3 flex items-center justify-between">
            <SidebarTrigger className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white" />
            <div className="flex items-center gap-3">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
              <div className="md:hidden">
                <ThemeToggle />
              </div>
            </div>
          </div>
          <div id="main-scroll-container" className="flex-1 overflow-y-auto overflow-x-hidden min-w-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-300 [&::-webkit-scrollbar-thumb]:rounded-full dark:[&::-webkit-scrollbar-thumb]:bg-neutral-700">
            <div className="w-full mx-auto px-8 py-8 max-w-[1400px]">
              {children}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
