import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getDocumentBySlug } from '@/lib/convex-server';

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
  // Redirect to home page with hash anchor
  redirect(`/#${slug}`);
}
