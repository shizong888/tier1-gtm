import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getAllDocuments, getDocumentBySlug } from '@/lib/convex-server';
import { GTMLayout } from '@/components/layout/gtm-layout';
import { MarkdownContent } from '@/components/markdown/markdown-content';
import { AnimatedHeader } from '@/components/headers/animated-header';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface GTMPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: GTMPageProps): Promise<Metadata> {
  const { slug } = await params;
  const document = await getDocumentBySlug(slug);

  if (!document) {
    return {
      title: 'Not Found',
    };
  }

  return {
    title: `${document.title} | Tier 1 GTM Strategy`,
    description: `Tier 1 Go-To-Market Strategy: ${document.title}`,
  };
}

export default async function GTMPage({ params }: GTMPageProps) {
  const { slug } = await params;
  const allDocuments = await getAllDocuments();
  const document = await getDocumentBySlug(slug);

  if (!document) {
    notFound();
  }

  // Sort documents by order
  const navigation = allDocuments
    .sort((a, b) => a.order - b.order)
    .map(doc => ({
      title: doc.title,
      slug: doc.slug,
      order: doc.order,
      href: doc.order === 0 ? '/' : `/${doc.slug}`,
    }));

  // If this is the first item, redirect to root
  if (navigation.length > 0 && navigation[0].slug === slug && document.order === 0) {
    redirect('/');
  }

  const currentIndex = navigation.findIndex((item) => item.slug === slug);
  const prevPage = currentIndex > 0 ? (currentIndex === 1 ? { ...navigation[0], href: '/' } : navigation[currentIndex - 1]) : null;
  const nextPage = currentIndex < navigation.length - 1 ? navigation[currentIndex + 1] : null;

  return (
    <GTMLayout navigation={navigation}>
      {document.headerStyle && document.headerStyle !== 'none' ? (
        <AnimatedHeader
          style={document.headerStyle}
          label={document.headerLabel || ''}
          title={document.headerTitle || document.title}
          accent={document.headerAccent || ''}
        />
      ) : (
        <div className="mb-8 pb-8 border-b border-neutral-900">
          <h1 className="text-sm font-medium text-brand tracking-[0.3em] mb-4">
            Tier 1 Go-To-Market Strategy
          </h1>
          <h2 className="text-4xl md:text-5xl font-medium text-white tracking-tighter">
            {document.title}
          </h2>
        </div>
      )}

      <article className="max-w-none">
        <MarkdownContent content={document.content} />
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
