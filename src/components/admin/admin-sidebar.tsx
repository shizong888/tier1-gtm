'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, Plus, Trash2, Home, GripVertical, Workflow, Image, MoreVertical, Eye, EyeOff } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
    hidden?: boolean;
  };
  isActive: boolean;
  onDelete: (id: Id<'documents'>, title: string) => void;
  onToggleVisibility: (id: Id<'documents'>, currentHidden: boolean) => void;
  deletingId: Id<'documents'> | null;
}

function SortableDocumentItem({ doc, isActive, onDelete, onToggleVisibility, deletingId }: SortableDocumentItemProps) {
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
          <Link href={`/admin/edit/${doc._id}`} className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="truncate flex-1">{doc.title}</span>
            {doc.hidden && (
              <EyeOff className="w-3 h-3 text-neutral-400 dark:text-neutral-600 flex-shrink-0" />
            )}
          </Link>
        </SidebarMenuButton>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              disabled={deletingId === doc._id}
            >
              <MoreVertical className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => onToggleVisibility(doc._id, doc.hidden || false)}
            >
              {doc.hidden ? (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Show on site
                </>
              ) : (
                <>
                  <EyeOff className="w-4 h-4 mr-2" />
                  Hide from site
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(doc._id, doc.title)}
              className="text-red-500 focus:text-red-500"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </SidebarMenuItem>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const documents = useQuery(api.documents.list);
  const deleteDocument = useMutation(api.documents.remove);
  const updateDocument = useMutation(api.documents.update);
  const updateOrders = useMutation(api.documents.updateOrders);
  const [deletingId, setDeletingId] = useState<Id<'documents'> | null>(null);
  const [localDocs, setLocalDocs] = useState<typeof documents>([]);

  // Sync local docs with query results
  useEffect(() => {
    if (documents) {
      setLocalDocs(documents);
    }
  }, [documents]);

  // Separate visible and hidden documents
  const visibleDocs = localDocs?.filter(doc => !doc.hidden) || [];
  const hiddenDocs = localDocs?.filter(doc => doc.hidden) || [];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id || !localDocs) return;

    // Find which lists the items are in
    const activeDoc = localDocs.find((doc) => doc._id === active.id);
    const overDoc = localDocs.find((doc) => doc._id === over.id);

    if (!activeDoc || !overDoc) return;

    const activeIsHidden = activeDoc.hidden || false;
    const overIsHidden = overDoc.hidden || false;

    // If dragging between groups, toggle visibility
    if (activeIsHidden !== overIsHidden) {
      try {
        await updateDocument({
          id: activeDoc._id,
          hidden: !activeIsHidden,
        });
      } catch (error) {
        console.error('Failed to toggle visibility:', error);
      }
      return;
    }

    // If within the same group, reorder
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

  const handleToggleVisibility = async (id: Id<'documents'>, currentHidden: boolean) => {
    try {
      await updateDocument({
        id,
        hidden: !currentHidden,
      });
    } catch (error) {
      console.error('Failed to toggle visibility:', error);
      alert('Failed to update visibility');
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
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/admin/tools/flywheel'}>
                  <Link href="/admin/tools/flywheel">
                    <Workflow className="w-4 h-4" />
                    <span>Flywheel Generator</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/admin/media'}>
                  <Link href="/admin/media">
                    <Image className="w-4 h-4" />
                    <span>Media Library</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {documents === undefined ? (
          <SidebarGroup>
            <SidebarGroupLabel>Documents</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="px-2 py-4 text-xs text-neutral-500 dark:text-neutral-500">Loading...</div>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : documents.length === 0 ? (
          <SidebarGroup>
            <SidebarGroupLabel>Documents</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="px-2 py-4 text-xs text-neutral-500 dark:text-neutral-500">No documents</div>
            </SidebarGroupContent>
          </SidebarGroup>
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
              <SidebarGroup>
                <SidebarGroupLabel>
                  Visible Pages
                  <span className="text-xs text-neutral-500 dark:text-neutral-500 ml-2">(Drag to reorder)</span>
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  {visibleDocs.length === 0 ? (
                    <div className="px-2 py-4 text-xs text-neutral-500 dark:text-neutral-500">No visible pages</div>
                  ) : (
                    <SidebarMenu>
                      {visibleDocs.map((doc) => (
                        <SortableDocumentItem
                          key={doc._id}
                          doc={doc}
                          isActive={pathname === `/admin/edit/${doc._id}`}
                          onDelete={handleDelete}
                          onToggleVisibility={handleToggleVisibility}
                          deletingId={deletingId}
                        />
                      ))}
                    </SidebarMenu>
                  )}
                </SidebarGroupContent>
              </SidebarGroup>

              {hiddenDocs.length > 0 && (
                <SidebarGroup>
                  <SidebarGroupLabel>
                    Hidden Pages
                    <span className="text-xs text-neutral-500 dark:text-neutral-500 ml-2">(Drag to show)</span>
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {hiddenDocs.map((doc) => (
                        <SortableDocumentItem
                          key={doc._id}
                          doc={doc}
                          isActive={pathname === `/admin/edit/${doc._id}`}
                          onDelete={handleDelete}
                          onToggleVisibility={handleToggleVisibility}
                          deletingId={deletingId}
                        />
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              )}
            </SortableContext>
          </DndContext>
        )}
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
