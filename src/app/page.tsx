import { Metadata } from 'next';
import { SinglePageClient } from '@/components/pages/single-page-client';

export const metadata: Metadata = {
  title: 'Tier 1 GTM Strategy',
  description: 'Tier 1 Go-To-Market Strategy - Execution Layer for Professional Trading',
};

export default function Home() {
  return <SinglePageClient />;
}
