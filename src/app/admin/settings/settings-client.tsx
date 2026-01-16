'use client';

import { useState, useRef } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Upload, X, Check } from 'lucide-react';

export function SettingsClient() {
  const [lightLogoFile, setLightLogoFile] = useState<File | null>(null);
  const [darkLogoFile, setDarkLogoFile] = useState<File | null>(null);
  const [lightLogoPreview, setLightLogoPreview] = useState<string | null>(null);
  const [darkLogoPreview, setDarkLogoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState<'light' | 'dark' | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<'light' | 'dark' | null>(null);

  const lightInputRef = useRef<HTMLInputElement>(null);
  const darkInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.settings.generateUploadUrl);
  const saveLogo = useMutation(api.settings.saveLogo);
  const lightLogoUrl = useQuery(api.settings.getLogoUrl, { mode: 'light' });
  const darkLogoUrl = useQuery(api.settings.getLogoUrl, { mode: 'dark' });

  const handleFileSelect = (mode: 'light' | 'dark', file: File | null) => {
    if (!file) return;

    // Validate file type
    const validTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload an SVG, PNG, or JPG file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }

    if (mode === 'light') {
      setLightLogoFile(file);
      setLightLogoPreview(URL.createObjectURL(file));
    } else {
      setDarkLogoFile(file);
      setDarkLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (mode: 'light' | 'dark') => {
    const file = mode === 'light' ? lightLogoFile : darkLogoFile;
    if (!file) return;

    setUploading(mode);
    setUploadSuccess(null);

    try {
      // Get upload URL
      const uploadUrl = await generateUploadUrl();

      // Upload file
      const result = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!result.ok) {
        throw new Error('Upload failed');
      }

      const { storageId } = await result.json();

      // Save logo reference
      await saveLogo({
        storageId,
        mode,
      });

      // Clear the file and preview
      if (mode === 'light') {
        setLightLogoFile(null);
        setLightLogoPreview(null);
      } else {
        setDarkLogoFile(null);
        setDarkLogoPreview(null);
      }

      setUploadSuccess(mode);
      setTimeout(() => setUploadSuccess(null), 3000);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload logo. Please try again.');
    } finally {
      setUploading(null);
    }
  };

  const handleRemove = (mode: 'light' | 'dark') => {
    if (mode === 'light') {
      setLightLogoFile(null);
      setLightLogoPreview(null);
      if (lightInputRef.current) lightInputRef.current.value = '';
    } else {
      setDarkLogoFile(null);
      setDarkLogoPreview(null);
      if (darkInputRef.current) darkInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-black dark:text-white mb-2">Settings</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-8">
          Manage your site settings and branding
        </p>

        <div className="space-y-8">
          {/* Light Mode Logo */}
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
              Light Mode Logo
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Upload a logo for light mode (SVG, PNG, or JPG)
            </p>

            {/* Current Logo */}
            {lightLogoUrl && !lightLogoPreview && (
              <div className="mb-4 p-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-md">
                <p className="text-xs text-neutral-500 dark:text-neutral-500 mb-2">Current Logo:</p>
                <img
                  src={lightLogoUrl}
                  alt="Light mode logo"
                  className="max-h-16 object-contain"
                />
              </div>
            )}

            {/* Preview */}
            {lightLogoPreview && (
              <div className="mb-4 p-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-md relative">
                <button
                  onClick={() => handleRemove('light')}
                  className="absolute top-2 right-2 p-1 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded hover:bg-neutral-100 dark:hover:bg-neutral-900"
                >
                  <X className="w-4 h-4" />
                </button>
                <p className="text-xs text-neutral-500 dark:text-neutral-500 mb-2">Preview:</p>
                <img
                  src={lightLogoPreview}
                  alt="Preview"
                  className="max-h-16 object-contain"
                />
              </div>
            )}

            <div className="flex gap-2">
              <input
                ref={lightInputRef}
                type="file"
                accept="image/svg+xml,image/png,image/jpeg,image/jpg"
                onChange={(e) => handleFileSelect('light', e.target.files?.[0] || null)}
                className="hidden"
                id="light-logo-input"
              />
              <label htmlFor="light-logo-input">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => lightInputRef.current?.click()}
                  asChild
                >
                  <span className="cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                  </span>
                </Button>
              </label>

              {lightLogoFile && (
                <Button
                  onClick={() => handleUpload('light')}
                  disabled={uploading === 'light'}
                  className="bg-brand hover:bg-brand/90 text-black"
                >
                  {uploading === 'light' ? (
                    'Uploading...'
                  ) : uploadSuccess === 'light' ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Uploaded
                    </>
                  ) : (
                    'Upload'
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Dark Mode Logo */}
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
              Dark Mode Logo
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Upload a logo for dark mode (SVG, PNG, or JPG)
            </p>

            {/* Current Logo */}
            {darkLogoUrl && !darkLogoPreview && (
              <div className="mb-4 p-4 bg-neutral-900 border border-neutral-800 rounded-md">
                <p className="text-xs text-neutral-500 mb-2">Current Logo:</p>
                <img
                  src={darkLogoUrl}
                  alt="Dark mode logo"
                  className="max-h-16 object-contain"
                />
              </div>
            )}

            {/* Preview */}
            {darkLogoPreview && (
              <div className="mb-4 p-4 bg-neutral-900 border border-neutral-800 rounded-md relative">
                <button
                  onClick={() => handleRemove('dark')}
                  className="absolute top-2 right-2 p-1 bg-black border border-neutral-800 rounded hover:bg-neutral-800"
                >
                  <X className="w-4 h-4" />
                </button>
                <p className="text-xs text-neutral-500 mb-2">Preview:</p>
                <img
                  src={darkLogoPreview}
                  alt="Preview"
                  className="max-h-16 object-contain"
                />
              </div>
            )}

            <div className="flex gap-2">
              <input
                ref={darkInputRef}
                type="file"
                accept="image/svg+xml,image/png,image/jpeg,image/jpg"
                onChange={(e) => handleFileSelect('dark', e.target.files?.[0] || null)}
                className="hidden"
                id="dark-logo-input"
              />
              <label htmlFor="dark-logo-input">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => darkInputRef.current?.click()}
                  asChild
                >
                  <span className="cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                  </span>
                </Button>
              </label>

              {darkLogoFile && (
                <Button
                  onClick={() => handleUpload('dark')}
                  disabled={uploading === 'dark'}
                  className="bg-brand hover:bg-brand/90 text-black"
                >
                  {uploading === 'dark' ? (
                    'Uploading...'
                  ) : uploadSuccess === 'dark' ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Uploaded
                    </>
                  ) : (
                    'Upload'
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
