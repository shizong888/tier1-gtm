'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExportButtonProps {
  documentTitle?: string;
  documentContent?: string;
}

export function ExportButton({ documentTitle, documentContent }: ExportButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyMarkdown = async () => {
    if (!documentContent) return;

    const markdown = `# ${documentTitle || 'Document'}\n\n${documentContent}`;

    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  // Don't show button if no content
  if (!documentContent) return null;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopyMarkdown}
      className="gap-2 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white border-neutral-200 dark:border-neutral-800"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4" />
          <span className="hidden sm:inline">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          <span className="hidden sm:inline">Copy as Markdown</span>
        </>
      )}
    </Button>
  );
}
