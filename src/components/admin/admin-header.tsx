'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export function AdminHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-black/50 backdrop-blur px-4">
      <SidebarTrigger />
      <ThemeToggle />
    </header>
  );
}
