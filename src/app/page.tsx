import { Metadata } from 'next';
import { HomePageClient } from '@/components/pages/home-page-client';

export const metadata: Metadata = {
  title: 'Home | Tier 1 GTM Strategy',
  description: 'Tier 1 Go-To-Market Strategy',
};

export default function Home() {
  return <HomePageClient />;
}
