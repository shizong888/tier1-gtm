import { ConvexClientProvider } from '@/components/providers/convex-client-provider';

export const metadata = {
  title: 'Admin Dashboard | Tier 1 GTM',
  description: 'Manage GTM strategy documents',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ConvexClientProvider>{children}</ConvexClientProvider>;
}
