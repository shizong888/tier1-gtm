'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';
import { useState, useRef } from 'react';
import { Upload, Trash2, Copy, Check } from 'lucide-react';

export default function MediaPage() {
  const media = useQuery(api.media.list);
  const generateUploadUrl = useMutation(api.media.generateUploadUrl);
  const saveMedia = useMutation(api.media.saveMedia);
  const deleteMedia = useMutation(api.media.remove);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<Id<'media'> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setIsUploading(true);
    try {
      // Get upload URL
      const uploadUrl = await generateUploadUrl();

      // Upload the file
      const result = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      const { storageId } = await result.json();

      // Save metadata
      await saveMedia({
        filename: file.name,
        storageId,
        contentType: file.type,
        size: file.size,
      });

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Failed to upload:', error);
      alert('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: Id<'media'>, filename: string) => {
    if (!confirm(`Are you sure you want to delete "${filename}"?`)) return;

    try {
      await deleteMedia({ id });
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('Failed to delete file');
    }
  };

  const copyMarkdown = (url: string, filename: string, id: Id<'media'>) => {
    const markdown = `![${filename}](${url})`;
    navigator.clipboard.writeText(markdown);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="flex-1 bg-white dark:bg-[#0a0a0a] text-black dark:text-white">
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-900 bg-white/50 dark:bg-black/50 backdrop-blur sticky top-14 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">Media Library</h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Manage your uploaded images and media files
              </p>
            </div>

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className={`flex items-center gap-2 px-4 py-2 bg-[#d9ff00] text-black font-semibold rounded-lg hover:bg-[#c5e600] transition-colors cursor-pointer ${
                  isUploading ? 'opacity-50 pointer-events-none' : ''
                }`}
              >
                <Upload className="w-4 h-4" />
                {isUploading ? 'Uploading...' : 'Upload Image'}
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-8">
        {media === undefined ? (
          <div className="text-center py-12 text-neutral-500 dark:text-neutral-500">
            Loading...
          </div>
        ) : media.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-neutral-100 dark:bg-neutral-900 rounded-full mb-4">
              <Upload className="w-8 h-8 text-neutral-400 dark:text-neutral-600" />
            </div>
            <h3 className="text-lg font-bold mb-2">No media files yet</h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Upload your first image to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {media.map((item) => (
              <div
                key={item._id}
                className="border border-neutral-200 dark:border-neutral-900 rounded-lg overflow-hidden bg-white dark:bg-neutral-950 hover:border-[#d9ff00]/30 transition-colors"
              >
                {/* Image Preview */}
                <div className="aspect-video bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
                  {item.url ? (
                    <img
                      src={item.url}
                      alt={item.filename}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-neutral-400 dark:text-neutral-600">
                      No preview
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-sm truncate mb-2">
                    {item.filename}
                  </h3>
                  <div className="text-xs text-neutral-500 dark:text-neutral-500 mb-3">
                    <div>{formatFileSize(item.size)}</div>
                    <div>{new Date(item.uploadedAt).toLocaleDateString()}</div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        item.url && copyMarkdown(item.url, item.filename, item._id)
                      }
                      disabled={!item.url}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg transition-colors text-sm disabled:opacity-50"
                    >
                      {copiedId === item._id ? (
                        <>
                          <Check className="w-3 h-3" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Copy MD
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(item._id, item.filename)}
                      className="px-3 py-2 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
