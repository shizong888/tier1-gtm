'use client';

import { useEffect, useState } from 'react';
import { NavItem } from '@/lib/markdown';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface SidebarNavProps {
  items: NavItem[];
}

export function SidebarNav({ items }: SidebarNavProps) {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    // Find the scrollable container
    const scrollContainer = document.getElementById('main-scroll-container');
    if (!scrollContainer) return;

    // Set up intersection observer to track which section is visible
    const observer = new IntersectionObserver(
      (entries) => {
        // Filter for intersecting entries and sort by their position
        const intersectingEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        // Set the topmost visible section as active
        if (intersectingEntries.length > 0) {
          setActiveSection(intersectingEntries[0].target.id);
        }
      },
      {
        root: scrollContainer, // Use the scroll container as the root
        rootMargin: '-100px 0px -50% 0px', // Trigger when section is near top of viewport
        threshold: [0, 0.1, 0.5, 1],
      }
    );

    // Observe all sections
    items.forEach((item) => {
      const element = document.getElementById(item.slug);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [items]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    e.preventDefault();
    const element = document.getElementById(slug);
    if (element) {
      // Find the scrollable container (the main content area)
      const scrollContainer = document.getElementById('main-scroll-container');
      if (scrollContainer) {
        const headerOffset = 100; // Account for sticky header
        const elementPosition = element.getBoundingClientRect().top;
        const containerPosition = scrollContainer.getBoundingClientRect().top;
        const offsetPosition = elementPosition - containerPosition + scrollContainer.scrollTop - headerOffset;

        scrollContainer.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }
  };

  return (
    <nav className="space-y-1">
      <div className="mb-4">
        <h2 className="text-xs font-medium px-3 mb-2 text-neutral-500 dark:text-neutral-500 uppercase tracking-widest">GTM Strategy</h2>
      </div>
      {items.map((item, index) => {
        const isActive = activeSection === item.slug || (activeSection === '' && index === 0);

        // Show skeleton if title is empty (loading state)
        if (!item.title) {
          return (
            <div key={item.slug} className="px-3 py-2">
              <Skeleton className="h-5 w-full" />
            </div>
          );
        }

        return (
          <a
            key={item.slug}
            href={`#${item.slug}`}
            onClick={(e) => handleClick(e, item.slug)}
            className={cn(
              'block px-3 py-2 rounded-sm text-sm transition-all',
              isActive
                ? 'bg-neutral-200 dark:bg-brand/10 text-black dark:text-brand font-bold border-l-2 border-black dark:border-brand'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-900 hover:text-black dark:hover:text-white'
            )}
          >
            {item.title}
          </a>
        );
      })}
    </nav>
  );
}
