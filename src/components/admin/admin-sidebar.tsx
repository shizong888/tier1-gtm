'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, Plus, Trash2, Home } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function AdminSidebar() {
  const pathname = usePathname();
  const documents = useQuery(api.documents.list);
  const deleteDocument = useMutation(api.documents.remove);
  const [deletingId, setDeletingId] = useState<Id<'documents'> | null>(null);

  const handleDelete = async (id: Id<'documents'>, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    setDeletingId(id);
    try {
      await deleteDocument({ id });
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('Failed to delete document');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-neutral-800 p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#d9ff00] rounded-sm flex items-center justify-center">
            <span className="text-black font-bold text-sm">T1</span>
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Admin Dashboard</h2>
            <p className="text-xs text-neutral-500">GTM Strategy</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/admin'}>
                  <Link href="/admin">
                    <Home className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/new">
                    <Plus className="w-4 h-4" />
                    <span>New Document</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Documents</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {documents === undefined ? (
                <div className="px-2 py-4 text-xs text-neutral-500">Loading...</div>
              ) : documents.length === 0 ? (
                <div className="px-2 py-4 text-xs text-neutral-500">No documents</div>
              ) : (
                documents.map((doc) => (
                  <SidebarMenuItem key={doc._id}>
                    <div className="flex items-center gap-1 w-full group">
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === `/admin/edit/${doc._id}`}
                        className="flex-1"
                      >
                        <Link href={`/admin/edit/${doc._id}`}>
                          <FileText className="w-4 h-4" />
                          <span className="truncate">{doc.title}</span>
                        </Link>
                      </SidebarMenuButton>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDelete(doc._id, doc.title)}
                        disabled={deletingId === doc._id}
                      >
                        <Trash2 className="w-3 h-3 text-red-500" />
                      </Button>
                    </div>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-neutral-800 p-4">
        <Link
          href="/"
          className="text-xs text-neutral-500 hover:text-[#d9ff00] transition-colors"
        >
          ← Back to site
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
