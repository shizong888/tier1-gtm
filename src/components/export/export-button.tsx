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
    // Add print-specific styles to ensure all content is visible
    const printStyles = document.createElement('style');
    printStyles.id = 'print-styles';
    printStyles.innerHTML = `
      @media print {
        /* Hide everything except main content */
        nav, header, footer, .sidebar, aside, [role="navigation"] {
          display: none !important;
        }

        /* Ensure main content takes full width and is visible */
        main, #main-scroll-container {
          display: block !important;
          height: auto !important;
          overflow: visible !important;
          max-height: none !important;
        }

        /* Remove sticky positioning that might hide content */
        * {
          position: static !important;
        }

        /* Ensure all content is visible */
        body {
          overflow: visible !important;
        }

        /* Expand all sections */
        article, section {
          page-break-inside: avoid;
        }

        /* Remove borders and backgrounds for cleaner print */
        .border-t, .border-b {
          border: none !important;
        }
      }
    `;

    // Add styles temporarily
    document.head.appendChild(printStyles);

    // Trigger print
    window.print();

    // Remove styles after printing
    setTimeout(() => {
      const styles = document.getElementById('print-styles');
      if (styles) styles.remove();
    }, 1000);
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
