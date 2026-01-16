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
        /* Force light mode colors for printing */
        * {
          color-scheme: light !important;
        }

        html, body {
          background: white !important;
          color: black !important;
        }

        /* Hide all UI chrome - sidebar, nav, buttons, etc */
        aside, nav, header, footer,
        [role="navigation"],
        button:not(.print-keep),
        .sidebar,
        [data-sidebar],
        [class*="sidebar"],
        [class*="Sidebar"],
        [class*="trigger"],
        [class*="Trigger"] {
          display: none !important;
        }

        /* Ensure main content takes full width and is visible */
        main, #main-scroll-container {
          display: block !important;
          height: auto !important;
          overflow: visible !important;
          max-height: none !important;
          width: 100% !important;
          max-width: 100% !important;
          padding: 0 !important;
          margin: 0 !important;
        }

        /* Remove all positioning constraints */
        * {
          position: static !important;
        }

        /* Ensure all content is visible */
        body {
          overflow: visible !important;
          padding: 2rem !important;
        }

        /* Remove excessive spacing between sections */
        section {
          margin-top: 2rem !important;
          padding-top: 0 !important;
          page-break-inside: avoid;
        }

        section:first-child {
          margin-top: 0 !important;
        }

        /* Remove borders and backgrounds */
        .border-t, .border-b, .border {
          border: none !important;
        }

        /* Compact headings */
        h1, h2, h3 {
          margin-top: 1.5rem !important;
          margin-bottom: 0.5rem !important;
        }

        /* Remove animated headers backgrounds */
        [class*="animate"],
        [class*="bg-gradient"],
        .absolute {
          display: none !important;
        }

        /* Ensure text is readable */
        p, li, span, div {
          color: black !important;
          background: transparent !important;
        }

        /* Remove brand color backgrounds */
        [style*="background"] {
          background: transparent !important;
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
