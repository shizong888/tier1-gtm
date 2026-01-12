'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavItem } from '@/lib/markdown';
import { cn } from '@/lib/utils';

interface SidebarNavProps {
  items: NavItem[];
}

export function SidebarNav({ items }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      <div className="mb-4">
        <h2 className="text-xs font-bold px-3 mb-2 text-neutral-500 uppercase tracking-widest">GTM Strategy</h2>
      </div>
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.slug}
            href={item.href}
            className={cn(
              'block px-3 py-2 rounded-sm text-sm transition-all',
              isActive
                ? 'bg-brand/10 text-brand font-bold border-l-2 border-brand'
                : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
            )}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
