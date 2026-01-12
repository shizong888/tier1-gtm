import { Metadata } from 'next';
import { parseMarkdownFile, generateNavigation } from '@/lib/markdown';
import { GTMLayout } from '@/components/layout/gtm-layout';
import { MarkdownContent } from '@/components/markdown/markdown-content';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  const navigation = await generateNavigation();
  const firstItem = navigation[0];
  const page = await parseMarkdownFile(firstItem.slug);

  return {
    title: `${page?.title || 'Home'} | Tier 1 GTM Strategy`,
    description: page ? `Tier 1 Go-To-Market Strategy: ${page.title}` : 'Tier 1 Go-To-Market Strategy',
  };
}

export default async function Home() {
  const navigation = await generateNavigation();
  // Get the first item from navigation as the homepage content
  const firstItem = navigation[0];
  const page = await parseMarkdownFile(firstItem.slug);

  if (!page) {
    return <div>Strategy content not found.</div>;
  }

  const nextPage = navigation.length > 1 ? navigation[1] : null;

  return (
    <GTMLayout navigation={navigation}>
      <div className="mb-12 relative overflow-hidden rounded-sm bg-neutral-900/50 border border-neutral-800 p-8 md:p-12 max-w-full">
        {/* Decorative Circle from inspiration */}
        <div className="absolute -right-24 -bottom-24 w-64 h-64 border-[32px] border-brand/5 rounded-full pointer-events-none hidden md:block"></div>
        <div className="absolute -right-12 -bottom-12 w-48 h-48 border-[16px] border-brand/10 rounded-full pointer-events-none hidden md:block"></div>
        
        <div className="relative z-10">
          <h1 className="text-sm font-bold text-brand uppercase tracking-[0.3em] mb-4">
            Tier 1 Go-To-Market Strategy
          </h1>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
            {page.title}
          </h2>
        </div>
      </div>

      <article className="max-w-none">
        <MarkdownContent content={page.content} />
      </article>

      {/* Pagination Navigation */}
      <div className="mt-16 pt-8 border-t border-neutral-900 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div />
        {nextPage ? (
          <Link
            href={nextPage.href}
            className="group flex flex-col p-6 rounded-sm border border-neutral-900 hover:border-brand/30 transition-all text-right"
          >
            <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest mb-2 flex items-center justify-end gap-1 group-hover:text-brand/70 transition-colors">
              Next <ChevronRight className="w-3 h-3" />
            </span>
            <span className="text-lg font-bold text-neutral-400 group-hover:text-white transition-colors">
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
