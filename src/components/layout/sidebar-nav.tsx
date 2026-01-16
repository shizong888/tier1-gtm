'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavItem } from '@/lib/markdown';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface SidebarNavProps {
  items: NavItem[];
}

export function SidebarNav({ items }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      <div className="mb-4">
        <h2 className="text-xs font-medium px-3 mb-2 text-neutral-500 dark:text-neutral-500 uppercase tracking-widest">GTM Strategy</h2>
      </div>
      {items.map((item, index) => {
        const isActive = pathname === item.href || (pathname === '/' && index === 0);

        // Show skeleton if title is empty (loading state)
        if (!item.title) {
          return (
            <div key={item.slug} className="px-3 py-2">
              <Skeleton className="h-5 w-full" />
            </div>
          );
        }

        return (
          <Link
            key={item.slug}
            href={index === 0 ? '/' : item.href}
            className={cn(
              'block px-3 py-2 rounded-sm text-sm transition-all',
              isActive
                ? 'bg-neutral-200 dark:bg-brand/10 text-black dark:text-brand font-bold border-l-2 border-black dark:border-brand'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-900 hover:text-black dark:hover:text-white'
            )}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
