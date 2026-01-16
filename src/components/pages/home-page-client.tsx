'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { GTMLayout } from '@/components/layout/gtm-layout';
import { MarkdownContent } from '@/components/markdown/markdown-content';
import { AnimatedHeader } from '@/components/headers/animated-header';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function HomePageClient() {
  const allDocuments = useQuery(api.documents.list);

  // Create skeleton navigation items
  const skeletonNavigation = Array.from({ length: 6 }, (_, i) => ({
    title: '',
    slug: `skeleton-${i}`,
    order: i,
    href: '#',
  }));

  if (!allDocuments) {
    return (
      <GTMLayout navigation={skeletonNavigation}>
        <div className="mb-16">
          <Skeleton className="h-80 w-full rounded-sm" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
          <div className="pt-8">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-6 w-full mt-4" />
            <Skeleton className="h-6 w-full mt-2" />
          </div>
        </div>
      </GTMLayout>
    );
  }

  const sortedDocs = allDocuments.sort((a, b) => a.order - b.order);
  const firstDoc = sortedDocs[0];

  if (!firstDoc) {
    return <div>Strategy content not found.</div>;
  }

  const navigation = sortedDocs.map(doc => ({
    title: doc.title,
    slug: doc.slug,
    order: doc.order,
    href: doc.order === 0 ? '/' : `/${doc.slug}`,
  }));

  const nextPage = sortedDocs.length > 1 ? navigation[1] : null;

  return (
    <GTMLayout navigation={navigation}>
      {firstDoc.headerStyle && firstDoc.headerStyle !== 'none' ? (
        <AnimatedHeader
          style={firstDoc.headerStyle}
          label={firstDoc.headerLabel || ''}
          title={firstDoc.headerTitle || firstDoc.title}
          accent={firstDoc.headerAccent || ''}
        />
      ) : (
        <div className="mb-16 relative overflow-hidden rounded-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 p-8 md:p-16 min-h-[320px] flex flex-col justify-center">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 opacity-[0.1] [mask-image:radial-gradient(ellipse_80%_80%_at_100%_50%,#000_20%,transparent_100%)]">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-brand)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-brand)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            </div>
            <div className="absolute right-0 top-[30%] w-1/2 h-[1px] bg-gradient-to-r from-transparent via-brand to-transparent opacity-20 animate-pulse"></div>
            <div className="absolute right-0 top-[50%] w-2/3 h-[1px] bg-gradient-to-r from-transparent via-brand/50 to-transparent opacity-10 animate-pulse [animation-delay:1s]"></div>
            <div className="absolute right-0 top-[70%] w-1/3 h-[1px] bg-gradient-to-r from-transparent via-brand to-transparent opacity-20 animate-pulse [animation-delay:0.5s]"></div>
            <div className="absolute right-32 top-1/2 -translate-y-1/2 flex items-center justify-center">
               <div className="relative w-48 h-48 flex items-center justify-center">
                  <div className="absolute inset-0 border border-brand/10 rounded-sm rotate-45 animate-[spin_30s_linear_infinite]"></div>
                  <div className="absolute inset-4 border border-brand/20 rounded-sm rotate-45 animate-[spin_20s_linear_infinite_reverse]"></div>
                  <div className="absolute inset-8 border border-brand/30 rounded-sm rotate-45 animate-[spin_10s_linear_infinite]"></div>
                  <div className="w-2 h-2 bg-brand rounded-full shadow-[0_0_30px_var(--color-brand)]"></div>
                  <div className="absolute w-4 h-4 bg-brand/40 rounded-full animate-ping"></div>
               </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand/[0.03] to-transparent h-[100px] w-full -top-[100px] animate-[scan_4s_linear_infinite]"></div>
            <div className="absolute -right-48 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,_var(--color-brand)_0%,_transparent_70%)] opacity-[0.05]"></div>
          </div>

          <div className="relative z-10">
            <h2 className="text-5xl md:text-7xl font-medium text-black dark:text-white tracking-tighter leading-[0.9] mb-4">
              Tier 1 <br />Go-To Market Strategy
            </h2>
            <p className="text-neutral-600 dark:text-neutral-500 text-sm font-bold tracking-widest mt-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse"></span>
              Execution Layer for Professional Trading
            </p>
          </div>
        </div>
      )}

      <article className="max-w-none">
        <MarkdownContent content={firstDoc.content} />
      </article>

      <div className="mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-900 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div />
        {nextPage ? (
          <Link
            href={nextPage.href}
            className="group flex flex-col p-6 rounded-sm border border-neutral-200 dark:border-neutral-900 hover:border-neutral-400 dark:hover:border-brand/30 transition-all text-right"
          >
            <span className="text-[10px] font-bold text-neutral-500 dark:text-neutral-600 uppercase tracking-widest mb-2 flex items-center justify-end gap-1 group-hover:text-neutral-700 dark:group-hover:text-brand/70 transition-colors">
              Next <ChevronRight className="w-3 h-3" />
            </span>
            <span className="text-lg font-bold text-neutral-700 dark:text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors">
              {nextPage.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </GTMLayout>
  );
}
