import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

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
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <AdminHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
