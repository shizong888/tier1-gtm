import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getAllSlugs, parseMarkdownFile, generateNavigation } from '@/lib/markdown';
import { GTMLayout } from '@/components/layout/gtm-layout';
import { MarkdownContent } from '@/components/markdown/markdown-content';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface GTMPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: GTMPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await parseMarkdownFile(slug);

  if (!page) {
    return {
      title: 'Not Found',
    };
  }

  return {
    title: `${page.title} | Tier 1 GTM Strategy`,
    description: `Tier 1 Go-To-Market Strategy: ${page.title}`,
  };
}

export default async function GTMPage({ params }: GTMPageProps) {
  const { slug } = await params;
  const navigation = await generateNavigation();

  // If this is the first item, redirect to root
  if (navigation.length > 0 && navigation[0].slug === slug) {
    redirect('/');
  }

  const page = await parseMarkdownFile(slug);

  if (!page) {
    notFound();
  }

  const currentIndex = navigation.findIndex((item) => item.slug === slug);
  const prevPage = currentIndex > 0 ? (currentIndex === 1 ? { ...navigation[0], href: '/' } : navigation[currentIndex - 1]) : null;
  const nextPage = currentIndex < navigation.length - 1 ? navigation[currentIndex + 1] : null;

  return (
    <GTMLayout navigation={navigation}>
      <div className="mb-8 pb-8 border-b border-neutral-900">
        <h1 className="text-sm font-bold text-brand uppercase tracking-[0.3em] mb-4">
          Strategy / Stage 0{currentIndex + 1}
        </h1>
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
          {page.title}
        </h2>
      </div>

      <article className="max-w-none">
        <MarkdownContent content={page.content} />
      </article>

      {/* Pagination Navigation */}
      <div className="mt-16 pt-8 border-t border-neutral-900 grid grid-cols-1 md:grid-cols-2 gap-4">
        {prevPage ? (
          <Link
            href={prevPage.href}
            className="group flex flex-col p-6 rounded-sm border border-neutral-900 hover:border-brand/30 transition-all text-left"
          >
            <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest mb-2 flex items-center gap-1 group-hover:text-brand/70 transition-colors">
              <ChevronLeft className="w-3 h-3" /> Previous
            </span>
            <span className="text-lg font-bold text-neutral-400 group-hover:text-white transition-colors">
              {prevPage.title}
            </span>
          </Link>
        ) : (
          <div />
        )}

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

