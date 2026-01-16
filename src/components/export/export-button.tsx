'use client';

import { useState } from 'react';
import { Download, FileText, Copy, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

  const handleExportPDF = () => {
    // Use browser's print functionality to generate PDF
    window.print();
  };

  // Don't show button if no content
  if (!documentContent) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white border-neutral-200 dark:border-neutral-800"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleCopyMarkdown} className="gap-2 cursor-pointer">
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy as Markdown
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportPDF} className="gap-2 cursor-pointer">
          <FileText className="w-4 h-4" />
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
