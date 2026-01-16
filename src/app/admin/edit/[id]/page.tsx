'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { Id } from '../../../../../convex/_generated/dataModel';
import { use, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Users, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { MarkdownContent } from '@/components/markdown/markdown-content';
import { AnimatedHeader } from '@/components/headers/animated-header';
import { HEADER_STYLES } from '@/lib/header-styles';
import dynamic from 'next/dynamic';

const YooptaEditorWrapper = dynamic(
  () => import('@/components/editor/yoopta-editor').then((mod) => mod.YooptaEditorWrapper),
  { ssr: false }
);

export default function EditDocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const documentId = id as Id<'documents'>;

  // Queries and Mutations
  const document = useQuery(api.documents.getById, { id: documentId });
  const pendingChanges = useQuery(api.documents.getPendingChanges, {
    documentId,
  });
  const updatePending = useMutation(api.documents.updatePendingChanges);
  const saveDocument = useMutation(api.documents.update);

  // Local state
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [headerStyle, setHeaderStyle] = useState('');
  const [headerLabel, setHeaderLabel] = useState('');
  const [headerTitle, setHeaderTitle] = useState('');
  const [headerAccent, setHeaderAccent] = useState('');
  const [userId] = useState(() => `user-${Math.random().toString(36).substr(2, 9)}`);
  const [isSaving, setIsSaving] = useState(false);
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | undefined>(undefined);

  // Initialize content from document
  useEffect(() => {
    if (document) {
      setContent(document.content);
      setTitle(document.title);
      setHeaderStyle(document.headerStyle || '');
      setHeaderLabel(document.headerLabel || '');
      setHeaderTitle(document.headerTitle || '');
      setHeaderAccent(document.headerAccent || '');
    }
  }, [document]);

  // Auto-sync pending changes to Convex (debounced)
  useEffect(() => {
    if (!document) return;

    const hasChanges = content !== document.content || title !== document.title ||
      headerStyle !== (document.headerStyle || '') ||
      headerLabel !== (document.headerLabel || '') ||
      headerTitle !== (document.headerTitle || '') ||
      headerAccent !== (document.headerAccent || '');
    setHasPendingChanges(hasChanges);

    if (hasChanges) {
      // Clear existing timer
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      // Set new timer to sync after 500ms of no typing
      debounceTimer.current = setTimeout(() => {
        updatePending({
          documentId,
          userId,
          content,
        });
      }, 500);
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [content, title, headerStyle, headerLabel, headerTitle, headerAccent, document, documentId, userId, updatePending]);

  const handleSave = async () => {
    if (!document) return;

    setIsSaving(true);
    try {
      await saveDocument({
        id: documentId,
        title,
        content,
        headerStyle: headerStyle || undefined,
        headerLabel: headerLabel || undefined,
        headerTitle: headerTitle || undefined,
        headerAccent: headerAccent || undefined,
        userId,
      });
      setHasPendingChanges(false);
      // Stay on the same page after saving
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Failed to save document');
    } finally {
      setIsSaving(false);
    }
  };

  if (document === undefined) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-neutral-400">Loading document...</div>
      </div>
    );
  }

  if (document === null) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-400 mb-4">Document not found</p>
          <Link
            href="/admin"
            className="text-[#d9ff00] hover:underline"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  const otherUsers = (pendingChanges || []).filter((c) => c.userId !== userId);

  return (
    <div className="flex-1 bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-neutral-900 bg-black/50 backdrop-blur sticky top-14 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-transparent text-xl font-bold border-none outline-none focus:text-[#d9ff00] transition-colors w-full"
                placeholder="Document title"
              />
              <div className="flex items-center gap-2 text-sm text-neutral-500 mt-1">
                <span>/{document.slug}</span>
                {otherUsers.length > 0 && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{otherUsers.length} other{otherUsers.length === 1 ? '' : 's'} editing</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {hasPendingChanges && (
                <div className="flex items-center gap-2 text-sm text-yellow-500">
                  <AlertCircle className="w-4 h-4" />
                  <span>Unsaved changes</span>
                </div>
              )}
              <button
                onClick={handleSave}
                disabled={isSaving || !hasPendingChanges}
                className="flex items-center gap-2 px-4 py-2 bg-[#d9ff00] text-black font-semibold rounded-lg hover:bg-[#c5e600] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="px-8 py-8">
        {/* Header Configuration */}
        <div className="mb-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-neutral-400 mb-2">
              Header Animation Style
            </label>
            <select
              value={headerStyle}
              onChange={(e) => setHeaderStyle(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-900 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#d9ff00] focus:border-transparent"
            >
              <option value="">Select a header style...</option>
              {HEADER_STYLES.map((style) => (
                <option key={style.id} value={style.id}>
                  {style.name} - {style.description}
                </option>
              ))}
            </select>
          </div>

          {headerStyle && headerStyle !== 'none' && (
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-500 mb-2">
                  Header Label (top)
                </label>
                <input
                  type="text"
                  value={headerLabel}
                  onChange={(e) => setHeaderLabel(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-900 rounded-lg p-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#d9ff00] focus:border-transparent"
                  placeholder="e.g., Participant Segments"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-500 mb-2">
                  Header Title (main)
                </label>
                <input
                  type="text"
                  value={headerTitle}
                  onChange={(e) => setHeaderTitle(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-900 rounded-lg p-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#d9ff00] focus:border-transparent"
                  placeholder="e.g., Target Audience"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-500 mb-2">
                  Header Accent (bottom)
                </label>
                <input
                  type="text"
                  value={headerAccent}
                  onChange={(e) => setHeaderAccent(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-900 rounded-lg p-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#d9ff00] focus:border-transparent"
                  placeholder="e.g., Bridging Institutions and Retail"
                />
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Content Editor */}
          <div>
            <label className="block text-sm font-bold text-neutral-400 mb-2">
              Content Editor
            </label>
            <YooptaEditorWrapper
              value={content}
              onChange={(val) => setContent(val)}
            />
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm font-bold text-neutral-400 mb-2">
              Preview
            </label>
            <div className="h-[calc(100vh-280px)] bg-neutral-950 border border-neutral-900 rounded-lg p-8 overflow-auto">
              {headerStyle && (
                <AnimatedHeader
                  style={headerStyle}
                  label={headerLabel}
                  title={headerTitle}
                  accent={headerAccent}
                />
              )}
              <MarkdownContent content={content} />
            </div>
          </div>
        </div>

        {/* Active Users Indicator */}
        {otherUsers.length > 0 && (
          <div className="mt-4 p-4 bg-neutral-950 border border-neutral-900 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-neutral-400">
              <Users className="w-4 h-4" />
              <span>
                {otherUsers.length} {otherUsers.length === 1 ? 'person is' : 'people are'} currently editing this document
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
