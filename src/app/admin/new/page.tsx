'use client';

import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function NewDocumentPage() {
  const router = useRouter();
  const documents = useQuery(api.documents.list);
  const createDocument = useMutation(api.documents.create);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('# New Document\n\nStart writing your content here...');
  const [isCreating, setIsCreating] = useState(false);

  // Auto-generate slug from title
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    // Only auto-generate slug if it hasn't been manually edited
    const autoSlug = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    setSlug(autoSlug);
  };

  const handleCreate = async () => {
    if (!title.trim() || !slug.trim()) {
      alert('Please enter a title and slug');
      return;
    }

    setIsCreating(true);
    try {
      // Calculate next order number
      const maxOrder = documents?.reduce((max, doc) => Math.max(max, doc.order), 0) || 0;

      const documentId = await createDocument({
        title: title.trim(),
        slug: slug.trim(),
        content: content.trim(),
        order: maxOrder + 1,
      });

      // Navigate to edit page for the new document
      router.push(`/admin/edit/${documentId}`);
    } catch (error) {
      console.error('Failed to create:', error);
      alert('Failed to create document. Make sure the slug is unique.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex-1 bg-white dark:bg-[#0a0a0a] text-black dark:text-white">
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-900 bg-white/50 dark:bg-black/50 backdrop-blur sticky top-14 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-xl font-bold">Create New Document</h1>
            </div>

            <button
              onClick={handleCreate}
              disabled={isCreating || !title.trim() || !slug.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-[#d9ff00] text-black font-semibold rounded-lg hover:bg-[#c5e600] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {isCreating ? 'Creating...' : 'Create'}
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="px-8 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-bold text-neutral-600 dark:text-neutral-400 mb-2">
              Document Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 rounded-lg p-4 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d9ff00] focus:border-transparent"
              placeholder="e.g., Executive Summary"
              autoFocus
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-bold text-neutral-600 dark:text-neutral-400 mb-2">
              URL Slug
            </label>
            <div className="flex items-center gap-2">
              <span className="text-neutral-500 dark:text-neutral-500">/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="flex-1 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 rounded-lg p-4 text-black dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#d9ff00] focus:border-transparent"
                placeholder="e.g., executive-summary"
              />
            </div>
            <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-500">
              This will be the URL path for your document. Use lowercase letters, numbers, and hyphens only.
            </p>
          </div>

          {/* Initial Content */}
          <div>
            <label className="block text-sm font-bold text-neutral-600 dark:text-neutral-400 mb-2">
              Initial Content (Optional)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-64 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 rounded-lg p-4 text-neutral-700 dark:text-neutral-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#d9ff00] focus:border-transparent resize-none"
              placeholder="# Document Title

Start writing your markdown content here..."
            />
            <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-500">
              You can edit this content after creating the document.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
