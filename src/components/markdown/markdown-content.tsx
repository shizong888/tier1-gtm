import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import React from 'react';
import { ChevronRight, RefreshCw, ArrowRight } from 'lucide-react';
import { MermaidDiagram } from './mermaid-diagram';

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  // Pre-process content to identify growth sequence pattern and wrap it
  const processedContent = content
          // Find Growth Sequence section and wrap the following 10 paragraphs
          .replace(/(##\s+Growth Sequence\s*\n\n)((?:\*\*[^*]+\*\*\s*\n[^\n]+\n\n){5})/gi, (match, header, paragraphs) => {
            return `${header}<div class="gtm-growth-sequence-wrapper">\n\n${paragraphs}</div>\n\n`;
          })
          // Wrap roadmap in a identifiable container
          .replace(/<section\s+class="gtm-roadmap">([\s\S]*?)<\/section>/gi, (match, inner) => {
      return `\n\n<div class="gtm-roadmap-type-container">\n\n${inner}\n\n</div>\n\n`;
    });

  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          div: ({ children, className, ...props }) => {
            const divClass = className || (props as any).class || (props as any).className;

            // Handle growth sequence cards
            if (divClass === 'gtm-growth-sequence-wrapper') {
              const childrenArray = React.Children.toArray(children);
              const items: { title: string; description: string }[] = [];

              // Extract items from paragraphs (each para has both title and description)
              childrenArray.forEach((child: any) => {
                // Check if it's a paragraph element
                const isParagraph = child.type?.toString().includes('p') ||
                                  child.props?.node?.tagName === 'p' ||
                                  typeof child.type === 'function';

                if (isParagraph && child.props) {
                  const childNodes = React.Children.toArray(child.props.children);

                  // Find the strong element (title)
                  let title = '';
                  let description = '';

                  childNodes.forEach((c: any) => {
                    if (c.type?.toString().includes('strong') || c.type === 'strong') {
                      title = c.props.children;
                    } else if (typeof c === 'string' && c.trim()) {
                      description += c;
                    }
                  });

                  if (title && description) {
                    items.push({
                      title: title.trim(),
                      description: description.trim()
                    });
                  }
                }
              });

              return (
                <div className="my-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((item, i) => (
                    <div
                      key={i}
                      className="bg-neutral-950 border border-neutral-800 p-10 rounded-sm flex flex-col min-h-[280px] group hover:border-brand/40 hover:bg-neutral-900 transition-all duration-500 hover:-translate-y-2 shadow-2xl"
                    >
                      <div className="text-3xl font-bold text-white mb-12">
                        0{i + 1}
                      </div>
                      <div className="flex-1 flex flex-col justify-end">
                        {item.title && (
                          <h4 className="text-xs font-black text-white/40 uppercase tracking-[0.2em] mb-3 group-hover:text-brand transition-colors">
                            {item.title}
                          </h4>
                        )}
                        <p className="text-sm font-medium text-white leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              );
            }

            // Handle the 4-card grid
            if (divClass === 'gtm-cards-grid' || divClass === 'gtm-cards-grid-container') {
              const childrenArray = React.Children.toArray(children);
              const cards: { title: any; content: any[] }[] = [];
              let currentCard: { title: any; content: any[] } | null = null;

              childrenArray.forEach((child: any) => {
                // Determine if this child is a header (card title)
                const isHeader = child.type === 'h2' || child.type === 'h3' || child.type === 'h4' || 
                               (child.props && child.props.node && ['h2', 'h3', 'h4'].includes(child.props.node.tagName));
                
                if (isHeader) {
                  if (currentCard) cards.push(currentCard);
                  currentCard = { title: child.props.children, content: [] };
                } else if (currentCard) {
                  // Add outcome styling if it's an "Outcome:" paragraph
                  const childNodes = React.Children.toArray(child.props?.children || []);
                  const firstChild = childNodes[0];
                  
                  const isOutcome = (typeof firstChild === 'string' && firstChild.trim().startsWith('Outcome:')) ||
                                  (React.isValidElement(firstChild) && 
                                   String((firstChild.props as any)?.children || '').trim().startsWith('Outcome:'));

                  if (isOutcome) {
                    const fullText = childNodes.map(c => {
                      if (typeof c === 'string') return c;
                      if (React.isValidElement(c)) return (c.props as any).children;
                      return '';
                    }).join('');

                    currentCard.content.push(
                      <div key={currentCard.content.length} className="mt-auto pt-8 w-full">
                        <div className="bg-brand/5 border border-brand/20 p-6 rounded-sm relative overflow-hidden group/outcome transition-all hover:bg-brand/10 hover:border-brand/40 w-full">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 blur-2xl rounded-full -mr-12 -mt-12 group-hover/outcome:bg-brand/10 transition-all"></div>
                          <span className="text-[10px] font-black text-brand uppercase tracking-[0.3em] block mb-3 text-left relative z-10">Outcome</span>
                          <p className="text-[13px] text-neutral-200 font-bold leading-relaxed text-left relative z-10">
                            {fullText.replace(/Outcome:\s*/i, '').trim()}
                          </p>
                        </div>
                      </div>
                    );
                    return;
                  }
                  currentCard.content.push(child);
                }
              });
              if (currentCard) cards.push(currentCard);

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
                  {cards.map((card, i) => (
                    <div key={i} className="bg-neutral-950 border border-neutral-800 p-10 rounded-sm flex flex-col min-h-[280px] group hover:border-brand/40 hover:bg-neutral-900 transition-all duration-500 hover:-translate-y-2 shadow-2xl">
                      <div className="flex-1 flex flex-col justify-end">
                        <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.2em] mb-3 group-hover:text-brand transition-colors">
                          {card.title}
                        </h3>
                        <div className="flex-1 flex flex-col text-[13px] text-neutral-400 leading-relaxed text-left">
                          <div className="space-y-4 mb-6">
                            {card.content.filter(c => !React.isValidElement(c) || (c as any).type !== 'div')}
                          </div>
                          {card.content.find(c => React.isValidElement(c) && (c as any).type === 'div')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            }

                    // Handle the growth sequence cards (screenshot style)
                    if (divClass === 'gtm-growth-sequence-container') {
                      const childrenArray = React.Children.toArray(children);
                      const findList = (nodes: any[]): any => {
                        for (const node of nodes) {
                          if (node.type === 'ul' || (node.props && node.props.node && node.props.node.tagName === 'ul')) return node;
                          if (node.props?.children) {
                            const found = findList(React.Children.toArray(node.props.children));
                            if (found) return found;
                          }
                        }
                        return null;
                      };

                      const list = findList(childrenArray);
                      if (list) {
                        const listChildren = React.Children.toArray(list.props.children);
                        const items = listChildren
                          .filter((li: any) => li.type === 'li' || (li.props && li.props.node && li.props.node.tagName === 'li'))
                          .map((li: any) => {
                            const liChildren = React.Children.toArray(li.props.children);
                            const strong = liChildren.find((c: any) => c.type === 'strong');
                            
                            let title = '';
                            if (strong) {
                              title = (strong as any).props.children;
                            } else {
                              // Fallback for when strong is not directly a child
                              const findStrong = (nodes: any[]): any => {
                                for (const node of nodes) {
                                  if (node.type === 'strong') return node;
                                  if (node.props?.children) {
                                    const found = findStrong(React.Children.toArray(node.props.children));
                                    if (found) return found;
                                  }
                                }
                                return null;
                              };
                              const nestedStrong = findStrong(liChildren);
                              if (nestedStrong) title = nestedStrong.props.children;
                            }

                            const description = liChildren
                              .filter((c: any) => c !== strong)
                              .map((c: any) => typeof c === 'string' ? c : (c.props?.children || ''))
                              .join('')
                              .replace(/^[:\s-]+/, '')
                              .trim();
                            
                            return { title, description };
                          });

                        return (
                          <div className="my-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                            {items.map((item, i) => (
                              <div
                                key={i}
                                className="bg-neutral-950 border border-neutral-800 p-8 rounded-sm flex flex-col min-h-[360px] group hover:border-brand/40 hover:bg-neutral-900 transition-all duration-500 hover:-translate-y-2 shadow-2xl"
                              >
                                <div className="text-3xl font-bold text-white mb-12">
                                  0{i + 1}
                                </div>
                                <div className="flex-1 flex flex-col justify-end">
                                  {item.title && (
                                    <h4 className="text-xs font-black text-white/40 uppercase tracking-[0.2em] mb-3 group-hover:text-brand transition-colors">
                                      {item.title}
                                    </h4>
                                  )}
                                  <p className="text-sm font-medium text-white leading-relaxed">
                                    {item.description}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      }
                    }

                    // Handle the horizontal roadmap
            if (divClass === 'gtm-roadmap-container' || divClass === 'gtm-roadmap-type-container') {
              const childrenArray = React.Children.toArray(children);
              const findList = (nodes: any[]): any => {
                for (const node of nodes) {
                  if (node.type === 'ul') return node;
                  if (node.props?.children) {
                    const found = findList(React.Children.toArray(node.props.children));
                    if (found) return found;
                  }
                }
                return null;
              };

              const list = findList(childrenArray);
              if (list) {
                const items = React.Children.toArray((list as any).props.children)
                  .filter((li: any) => li.type === 'li')
                  .map((li: any) => {
                    const liChildren = React.Children.toArray((li as any).props.children);
                    const strong = liChildren.find((c: any) => c.type === 'strong');
                    
                    let title = 'Step';
                    if (strong) {
                      title = (strong as any).props.children;
                    } else if (typeof liChildren[0] === 'string') {
                      const split = liChildren[0].split(':');
                      if (split.length > 1) title = split[0];
                    }

                    const description = liChildren
                      .filter((c: any) => c !== strong)
                      .map((c: any) => typeof c === 'string' ? c : (c.props?.children || ''))
                      .join('')
                      .replace(/^[:\s-]+/, '')
                      .trim();
                    
                    return { title, description };
                  });

                return (
                  <div className="my-16 w-full overflow-x-auto pb-8 scrollbar-hide">
                    <div className="flex items-start gap-0 min-w-[900px] lg:min-w-full">
                      {items.map((item, i) => (
                        <React.Fragment key={i}>
                          <div className="flex-1 flex flex-col">
                            <div className="w-full bg-neutral-800 border border-neutral-700/30 py-6 px-4 rounded-xl mb-6 text-center group hover:border-brand/40 hover:bg-neutral-700/50 transition-all shadow-xl flex items-center justify-center min-h-[80px]">
                              <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em] leading-tight">
                                {item.title}
                              </h4>
                            </div>
                            <p className="text-[11px] font-bold text-neutral-500 text-center leading-relaxed px-2">
                              {item.description}
                            </p>
                          </div>
                          {i < items.length - 1 && (
                            <div className="flex items-center justify-center h-[80px] w-12 shrink-0">
                              <div className="w-full h-px bg-neutral-800 relative">
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 border-t border-r border-neutral-600 rotate-45"></div>
                              </div>
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                );
              }
            }

            if (divClass === 'gtm-positive-loop') {
              return (
                <div className="my-10 group">
                  <div className="relative bg-neutral-900 border border-neutral-800 p-8 rounded-sm overflow-hidden transition-all hover:border-brand/30">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-brand/10 transition-all"></div>
                    <div className="relative z-10">
                      <div className="text-[10px] font-black text-brand uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                        <RefreshCw className="w-3 h-3 animate-spin-slow" /> Positive Loop
                      </div>
                      <div className="text-base font-bold text-neutral-200 leading-relaxed italic">
                        {children}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return <div className={divClass} {...props}>{children}</div>;
          },
                  h1: ({ children }) => (
                    <h1 className="text-4xl md:text-5xl font-medium mb-8 mt-12 first:mt-0 text-white tracking-tighter">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-medium mb-4 mt-12 pb-2 border-b border-neutral-900 text-white">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-medium mb-3 mt-8 text-neutral-100">{children}</h3>
                  ),
                  h4: ({ children }) => (
                    <h4 className="text-lg font-medium mb-2 mt-6 text-neutral-200">{children}</h4>
                  ),
          p: ({ children }) => {
            const childrenArray = React.Children.toArray(children);
            const textContent = childrenArray.map(c => typeof c === 'string' ? c : (c as any).props?.children?.toString() || '').join('');
            
            // Heuristic for Roadmap/Flow diagrams from screenshots
            if (textContent.includes(' → ') && !textContent.trim().endsWith('→')) {
              const steps = textContent.split(' → ');
              return (
                <div className="flex flex-wrap items-center gap-3 mb-10 bg-neutral-900/30 p-6 rounded-sm border border-neutral-800/50">
                  {steps.map((step, i) => (
                    <React.Fragment key={i}>
                      <div className="bg-neutral-800/50 border border-neutral-800 px-5 py-3 rounded-sm text-sm font-bold text-neutral-300 shadow-sm">
                        {step.trim()}
                      </div>
                      {i < steps.length - 1 && (
                        <ChevronRight className="w-4 h-4 text-brand opacity-50" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              );
            }

            // ONLY hide if it's explicitly a step indicator ending in arrow, 
            // which is usually captured by our flywheel/loop logic
            if (textContent.trim().endsWith('→') && textContent.length < 100) return null;

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
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';

            if (language === 'mermaid') {
              return <MermaidDiagram chart={String(children)} />;
            }

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
          ),
          img: ({ src, alt }) => (
            <div className="my-12 flex justify-center">
              <img
                src={src}
                alt={alt || ''}
                className="max-w-full h-auto"
              />
            </div>
          )
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}
