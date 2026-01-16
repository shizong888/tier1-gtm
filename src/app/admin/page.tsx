'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import Link from 'next/link';
import { FileText, Plus } from 'lucide-react';

export default function AdminDashboard() {
  const documents = useQuery(api.documents.list);

  if (documents === undefined) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-neutral-400">Loading documents...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-neutral-400">
                Manage your GTM strategy documents
              </p>
            </div>
            <Link
              href="/admin/new"
              className="flex items-center gap-2 px-4 py-2 bg-[#d9ff00] text-black font-semibold rounded-lg hover:bg-[#c5e600] transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Document
            </Link>
          </div>
        </div>

        {/* Documents List */}
        <div className="grid gap-4">
          {documents.length === 0 ? (
            <div className="text-center py-16 border border-neutral-900 rounded-lg">
              <FileText className="w-12 h-12 mx-auto mb-4 text-neutral-600" />
              <p className="text-neutral-400 mb-4">No documents yet</p>
              <Link
                href="/admin/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create your first document
              </Link>
            </div>
          ) : (
            documents.map((doc) => (
              <Link
                key={doc._id}
                href={`/admin/edit/${doc._id}`}
                className="group block p-6 border border-neutral-900 rounded-lg hover:border-[#d9ff00]/30 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="w-5 h-5 text-[#d9ff00]" />
                      <h3 className="text-xl font-bold group-hover:text-[#d9ff00] transition-colors">
                        {doc.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-neutral-500">
                      <span>/{doc.slug}</span>
                      <span>•</span>
                      <span>Order: {doc.order}</span>
                      <span>•</span>
                      <span>
                        Updated{' '}
                        {new Date(doc.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-neutral-600 group-hover:text-[#d9ff00] transition-colors">
                    →
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
