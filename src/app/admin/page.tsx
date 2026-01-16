'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import Link from 'next/link';
import { FileText, Plus, Eye, EyeOff } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function AdminDashboard() {
  const documents = useQuery(api.documents.list);
  const updateDocument = useMutation(api.documents.update);

  const toggleVisibility = async (id: string, currentHidden: boolean) => {
    await updateDocument({
      id: id as any,
      hidden: !currentHidden,
    });
  };

  if (documents === undefined) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-neutral-600 dark:text-neutral-400">Loading documents...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white dark:bg-[#0a0a0a] text-black dark:text-white">
      <div className="px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Documents</h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Manage your GTM strategy documents
          </p>
        </div>

        {/* Documents List */}
        <div className="grid gap-4">
          {documents.length === 0 ? (
            <div className="text-center py-16 border border-neutral-200 dark:border-neutral-900 rounded-lg">
              <FileText className="w-12 h-12 mx-auto mb-4 text-neutral-400 dark:text-neutral-600" />
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">No documents yet</p>
              <Link
                href="/admin/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create your first document
              </Link>
            </div>
          ) : (
            documents.map((doc) => (
              <div
                key={doc._id}
                className="group p-6 border border-neutral-200 dark:border-neutral-900 rounded-lg hover:border-[#d9ff00]/30 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <Link href={`/admin/edit/${doc._id}`} className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="w-5 h-5 text-[#d9ff00]" />
                      <h3 className="text-xl font-bold group-hover:text-[#d9ff00] transition-colors">
                        {doc.title}
                      </h3>
                      {doc.hidden && (
                        <span className="px-2 py-1 text-xs bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 rounded">
                          Hidden
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-500">
                      <span>/{doc.slug}</span>
                      <span>•</span>
                      <span>Order: {doc.order}</span>
                      <span>•</span>
                      <span>
                        Updated{' '}
                        {new Date(doc.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleVisibility(doc._id, doc.hidden || false);
                      }}
                      className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg transition-colors"
                      title={doc.hidden ? 'Show on public site' : 'Hide from public site'}
                    >
                      {doc.hidden ? (
                        <EyeOff className="w-5 h-5 text-neutral-400 dark:text-neutral-600" />
                      ) : (
                        <Eye className="w-5 h-5 text-neutral-400 dark:text-neutral-600" />
                      )}
                    </button>
                    <Link
                      href={`/admin/edit/${doc._id}`}
                      className="text-neutral-600 dark:text-neutral-600 group-hover:text-[#d9ff00] transition-colors"
                    >
                      →
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
