import { ConvexClientProvider } from '@/components/providers/convex-client-provider';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Admin Dashboard | Tier 1 GTM',
  description: 'Manage GTM strategy documents',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConvexClientProvider>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center gap-2 border-b border-neutral-800 bg-black/50 backdrop-blur px-4">
            <SidebarTrigger />
          </header>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </ConvexClientProvider>
  );
}
