'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { Id } from '../../../../../convex/_generated/dataModel';
import { use, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Users, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { MarkdownContent } from '@/components/markdown/markdown-content';

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
  const [userId] = useState(() => `user-${Math.random().toString(36).substr(2, 9)}`);
  const [isSaving, setIsSaving] = useState(false);
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | undefined>(undefined);

  // Initialize content from document
  useEffect(() => {
    if (document) {
      setContent(document.content);
      setTitle(document.title);
    }
  }, [document]);

  // Auto-sync pending changes to Convex (debounced)
  useEffect(() => {
    if (!document) return;

    const hasChanges = content !== document.content;
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
  }, [content, document, documentId, userId, updatePending]);

  const handleSave = async () => {
    if (!document) return;

    setIsSaving(true);
    try {
      await saveDocument({
        id: documentId,
        title,
        content,
        userId,
      });
      setHasPendingChanges(false);
      router.push('/admin');
    } catch (error) {
      console.error('Failed to save:', error);
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
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-neutral-900 bg-black/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-transparent text-xl font-bold border-none outline-none focus:text-[#d9ff00] transition-colors"
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
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-2 gap-8">
          {/* Markdown Input */}
          <div>
            <label className="block text-sm font-bold text-neutral-400 mb-2">
              Markdown Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-[calc(100vh-300px)] bg-neutral-950 border border-neutral-900 rounded-lg p-4 text-neutral-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#d9ff00] focus:border-transparent resize-none"
              placeholder="Enter markdown content..."
            />
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm font-bold text-neutral-400 mb-2">
              Preview
            </label>
            <div className="h-[calc(100vh-300px)] bg-neutral-950 border border-neutral-900 rounded-lg p-8 overflow-auto">
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
