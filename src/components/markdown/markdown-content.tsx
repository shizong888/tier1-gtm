import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import React from 'react';
import { ChevronRight, RefreshCw, ArrowRight } from 'lucide-react';

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-4xl md:text-5xl font-black mb-8 mt-12 first:mt-0 text-white tracking-tighter">{children}</h1>
          ),
          h2: ({ children }) => {
            const textContent = React.Children.toArray(children).join('');
            const isLoop = textContent.toLowerCase().includes('loop') || textContent.toLowerCase().includes('flywheel');
            
            return (
              <div className={isLoop ? "mt-16 mb-4" : ""}>
                <h2 className={isLoop 
                  ? "text-3xl font-black text-white mb-6 tracking-tight" 
                  : "text-2xl font-bold mb-4 mt-12 pb-2 border-b border-neutral-900 text-white"}>
                  {children}
                </h2>
                {isLoop && <div className="h-px bg-neutral-900 w-full mb-8"></div>}
              </div>
            );
          },
          h3: ({ children }) => (
            <h3 className="text-xl font-bold mb-3 mt-8 text-neutral-100">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg font-bold mb-2 mt-6 text-neutral-200">{children}</h4>
          ),
          p: ({ children }) => {
            const childrenArray = React.Children.toArray(children);
            const textContent = childrenArray.map(c => typeof c === 'string' ? c : (c as any).props?.children?.toString() || '').join('');
            
            // Check for "**Positive Loop**" or similar
            const isLoopLabel = textContent.includes('Loop') && childrenArray.some((c: any) => c.type === 'strong');
            
            if (isLoopLabel) {
              return (
                <div className="mt-12 mb-2">
                  <p className="text-sm font-black text-white uppercase tracking-[0.2em] mb-4">
                    {children}
                  </p>
                </div>
              );
            }

            // Heuristic for Roadmap/Flow diagrams from screenshots
            if (textContent.includes(' → ')) {
              const steps = textContent.split(' → ');
              const isLastStepArrow = textContent.trim().endsWith('→');
              
              if (isLastStepArrow) {
                return (
                  <div className="flex items-center gap-3 mb-4 group">
                    <div className="bg-neutral-900/50 border border-neutral-800 p-4 rounded-sm flex-1 group-hover:border-brand/30 transition-all">
                      <p className="text-sm font-bold text-neutral-400 group-hover:text-white transition-colors">
                        {textContent.replace(/ →$/, '').trim()}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-brand" />
                  </div>
                );
              }

              // Final step or multi-step flow
              return (
                <div className="mb-8">
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    {steps.map((step, i) => (
                      <React.Fragment key={i}>
                        <div className="bg-neutral-800/50 border border-neutral-800 px-5 py-3 rounded-sm text-sm font-bold text-neutral-300 shadow-sm">
                          {step.trim()}
                        </div>
                        {i < steps.length - 1 && (
                          <ChevronRight className="w-4 h-4 text-brand/50" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="h-px bg-neutral-900 w-full mt-8"></div>
                </div>
              );
            }

            return (
              <p className="text-base mb-6 leading-relaxed text-neutral-400">
                {children}
              </p>
            );
          },
          ul: ({ children }) => (
            <ul className="ml-6 mb-8 space-y-3 list-disc text-neutral-400">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="ml-6 mb-8 space-y-3 list-decimal text-neutral-400">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed mb-1">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-t-2 border-brand/20 bg-neutral-900/50 p-8 my-10 rounded-sm relative overflow-hidden group hover:border-brand/40 transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-brand/10 transition-all"></div>
              <div className="text-neutral-300 relative z-10 prose-p:mb-0">
                {children}
              </div>
            </blockquote>
          ),
          hr: () => <hr className="my-12 border-neutral-900" />,
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-brand hover:brightness-110 underline decoration-brand/30 underline-offset-4 transition-all"
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {children}
            </a>
          ),
          code: ({ children, className }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="bg-neutral-900 px-1.5 py-0.5 rounded-sm text-sm font-mono text-brand">
                  {children}
                </code>
              );
            }
            return (
              <code className="block bg-neutral-950 p-4 rounded-sm text-sm font-mono overflow-x-auto text-neutral-300 border border-neutral-900">
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="mb-6 overflow-x-auto">{children}</pre>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto mb-8 border border-neutral-900 rounded-sm">
              <table className="min-w-full divide-y divide-neutral-900">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-neutral-950">{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody className="bg-transparent divide-y divide-neutral-900">
              {children}
            </tbody>
          ),
          tr: ({ children }) => <tr>{children}</tr>,
          th: ({ children }) => (
            <th className="px-6 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-widest">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-6 py-4 text-sm text-neutral-400">
              {children}
            </td>
          ),
          strong: ({ children }) => (
             <strong className="font-bold text-white">{children}</strong>
          ),
          em: ({ children }) => (
             <em className="italic text-brand/90">{children}</em>
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
