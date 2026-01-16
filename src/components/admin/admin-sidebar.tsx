'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, Plus, Trash2, Home, GripVertical } from 'lucide-react';
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
import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableDocumentItemProps {
  doc: {
    _id: Id<'documents'>;
    title: string;
    slug: string;
    order: number;
  };
  isActive: boolean;
  onDelete: (id: Id<'documents'>, title: string) => void;
  deletingId: Id<'documents'> | null;
}

function SortableDocumentItem({ doc, isActive, onDelete, deletingId }: SortableDocumentItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: doc._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <SidebarMenuItem ref={setNodeRef} style={style}>
      <div className="flex items-center gap-1 w-full group">
        <button
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded opacity-0 group-hover:opacity-100 transition-opacity"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-4 h-4 text-neutral-500 dark:text-neutral-500" />
        </button>
        <SidebarMenuButton
          asChild
          isActive={isActive}
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
          onClick={() => onDelete(doc._id, doc.title)}
          disabled={deletingId === doc._id}
        >
          <Trash2 className="w-3 h-3 text-red-500" />
        </Button>
      </div>
    </SidebarMenuItem>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const documents = useQuery(api.documents.list);
  const deleteDocument = useMutation(api.documents.remove);
  const updateOrders = useMutation(api.documents.updateOrders);
  const [deletingId, setDeletingId] = useState<Id<'documents'> | null>(null);
  const [localDocs, setLocalDocs] = useState<typeof documents>([]);

  // Sync local docs with query results
  useEffect(() => {
    if (documents) {
      setLocalDocs(documents);
    }
  }, [documents]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id || !localDocs) return;

    const oldIndex = localDocs.findIndex((doc) => doc._id === active.id);
    const newIndex = localDocs.findIndex((doc) => doc._id === over.id);

    const newDocs = arrayMove(localDocs, oldIndex, newIndex);

    // Update local state immediately for smooth UX
    setLocalDocs(newDocs);

    // Update orders in database
    const updates = newDocs.map((doc, index) => ({
      id: doc._id,
      order: index + 1,
    }));

    try {
      await updateOrders({ updates });
    } catch (error) {
      console.error('Failed to update order:', error);
      // Revert on error
      setLocalDocs(localDocs);
    }
  };

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
      <SidebarHeader className="border-b border-neutral-200 dark:border-neutral-800 p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#d9ff00] rounded-sm flex items-center justify-center">
            <span className="text-black font-bold text-sm">T1</span>
          </div>
          <div>
            <h2 className="text-sm font-bold text-black dark:text-white">Admin Dashboard</h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-500">GTM Strategy</p>
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
          <SidebarGroupLabel>
            Documents
            <span className="text-xs text-neutral-500 dark:text-neutral-500 ml-2">(Drag to reorder)</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {documents === undefined ? (
              <div className="px-2 py-4 text-xs text-neutral-500 dark:text-neutral-500">Loading...</div>
            ) : documents.length === 0 ? (
              <div className="px-2 py-4 text-xs text-neutral-500 dark:text-neutral-500">No documents</div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={localDocs?.map(d => d._id) || []}
                  strategy={verticalListSortingStrategy}
                >
                  <SidebarMenu>
                    {localDocs?.map((doc) => (
                      <SortableDocumentItem
                        key={doc._id}
                        doc={doc}
                        isActive={pathname === `/admin/edit/${doc._id}`}
                        onDelete={handleDelete}
                        deletingId={deletingId}
                      />
                    ))}
                  </SidebarMenu>
                </SortableContext>
              </DndContext>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-neutral-200 dark:border-neutral-800 p-4">
        <Link
          href="/"
          className="text-xs text-neutral-500 dark:text-neutral-500 hover:text-[#d9ff00] transition-colors"
        >
          ← Back to site
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
