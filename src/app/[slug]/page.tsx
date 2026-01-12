import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getAllSlugs, parseMarkdownFile, generateNavigation } from '@/lib/markdown';
import { GTMLayout } from '@/components/layout/gtm-layout';
import { MarkdownContent } from '@/components/markdown/markdown-content';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface GTMPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: GTMPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await parseMarkdownFile(slug);

  if (!page) {
    return {
      title: 'Not Found',
    };
  }

  return {
    title: `${page.title} | Tier 1 GTM Strategy`,
    description: `Tier 1 Go-To-Market Strategy: ${page.title}`,
  };
}

export default async function GTMPage({ params }: GTMPageProps) {
  const { slug } = await params;
  const navigation = await generateNavigation();

  // If this is the first item, redirect to root
  if (navigation.length > 0 && navigation[0].slug === slug) {
    redirect('/');
  }

  const page = await parseMarkdownFile(slug);

  if (!page) {
    notFound();
  }

  const currentIndex = navigation.findIndex((item) => item.slug === slug);
  const prevPage = currentIndex > 0 ? (currentIndex === 1 ? { ...navigation[0], href: '/' } : navigation[currentIndex - 1]) : null;
  const nextPage = currentIndex < navigation.length - 1 ? navigation[currentIndex + 1] : null;

  // Header content and graphics mapping
  const getHeaderContent = (slug: string) => {
    switch (slug) {
      case 'target-audience':
        return {
          label: 'Participant Segments',
          title: <>Target <br />Audience</>,
          accent: 'Bridging Institutions and Retail',
          graphic: (
            <>
              <div className="absolute inset-0 opacity-[0.05] [mask-image:radial-gradient(ellipse_80%_80%_at_100%_50%,#000_20%,transparent_100%)]">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-brand)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-brand)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
              </div>
              <div className="absolute right-0 top-0 w-full h-full">
                <div className="absolute right-0 top-[20%] w-[60%] h-[1px] bg-gradient-to-r from-transparent via-brand to-brand/20 -rotate-[15deg] opacity-20 animate-pulse"></div>
                <div className="absolute right-0 top-[40%] w-[70%] h-[1px] bg-gradient-to-r from-transparent via-brand to-brand/20 -rotate-[5deg] opacity-30 animate-pulse [animation-delay:0.5s]"></div>
                <div className="absolute right-0 top-[60%] w-[70%] h-[1px] bg-gradient-to-r from-transparent via-brand to-brand/20 rotate-[5deg] opacity-30 animate-pulse [animation-delay:1s]"></div>
                <div className="absolute right-0 top-[80%] w-[60%] h-[1px] bg-gradient-to-r from-transparent via-brand to-brand/20 rotate-[15deg] opacity-20 animate-pulse [animation-delay:1.5s]"></div>
              </div>
              <div className="absolute right-32 top-1/2 -translate-y-1/2">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <div className="absolute inset-0 border-[2px] border-brand/10 rounded-full animate-[ping_4s_linear_infinite]"></div>
                  <div className="absolute inset-4 border-[1px] border-brand/20 rounded-full animate-[ping_3s_linear_infinite_1s]"></div>
                  <div className="absolute inset-8 border-[1px] border-brand/30 rounded-full animate-[ping_2s_linear_infinite_2s]"></div>
                  <div className="w-3 h-3 bg-brand rounded-full shadow-[0_0_40px_var(--color-brand)] z-10"></div>
                  <div className="absolute w-6 h-6 bg-brand/30 rounded-full animate-pulse"></div>
                </div>
              </div>
            </>
          )
        };
      case 'value-proposition':
        return {
          label: 'Core Advantages',
          title: <>Value <br />Proposition</>,
          accent: 'The Execution-First Advantage',
          graphic: (
            <>
              <div className="absolute inset-0 opacity-[0.05]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20px_20px,var(--color-brand)_1px,transparent_0)] bg-[size:40px_40px]"></div>
              </div>
              <div className="absolute right-32 top-1/2 -translate-y-1/2">
                <div className="grid grid-cols-3 gap-2">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="w-8 h-8 border border-brand/20 rounded-sm relative overflow-hidden">
                      <div className={`absolute inset-0 bg-brand/20 animate-pulse`} style={{ animationDelay: `${i * 0.2}s` }}></div>
                      {i % 4 === 0 && <div className="absolute inset-0 bg-brand animate-[ping_2s_infinite]"></div>}
                    </div>
                  ))}
                </div>
                <div className="absolute -inset-8 border border-brand/10 rounded-sm animate-[spin_20s_linear_infinite]"></div>
              </div>
              <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-brand/50 to-transparent animate-[scan_4s_linear_infinite]"></div>
            </>
          )
        };
      case 'expanding-reach':
        return {
          label: 'Ecosystem Scaling',
          title: <>Expanding <br />Reach</>,
          accent: 'Compounding Network Distribution',
          graphic: (
            <>
              <div className="absolute right-40 top-1/2 -translate-y-1/2">
                <div className="relative w-32 h-32">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} 
                         className="absolute w-2 h-2 bg-brand rounded-full"
                         style={{
                           left: '50%',
                           top: '50%',
                           transform: `rotate(${i * 60}deg) translateY(-60px)`,
                           opacity: 0.4 + (i * 0.1),
                           animation: `pulse 2s infinite ${i * 0.3}s`
                         }}>
                      <div className="absolute inset-0 bg-brand/50 rounded-full animate-ping"></div>
                    </div>
                  ))}
                  <div className="absolute inset-0 border border-brand/20 rounded-full animate-spin-slow"></div>
                  <div className="absolute inset-4 border border-brand/10 rounded-full animate-reverse-spin"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-brand rounded-full shadow-[0_0_30px_var(--color-brand)]"></div>
                </div>
              </div>
            </>
          )
        };
      case 'partnerships':
        return {
          label: 'Growth Infrastructure',
          title: <>Key <br />Partnerships</>,
          accent: 'Integrating the Execution Layer',
          graphic: (
            <>
              <div className="absolute right-24 top-1/2 -translate-y-1/2 flex gap-8 items-center">
                <div className="w-16 h-16 border-2 border-brand/30 rounded-sm flex items-center justify-center relative">
                  <div className="w-8 h-[2px] bg-brand animate-pulse"></div>
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-brand"></div>
                </div>
                <div className="w-24 h-[1px] bg-gradient-to-r from-brand/50 to-brand/50 relative overflow-hidden">
                  <div className="absolute inset-0 bg-brand h-full w-1/3 animate-[scan_2s_linear_infinite]"></div>
                </div>
                <div className="w-16 h-16 border-2 border-brand/30 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 border border-brand/50 rounded-full animate-ping"></div>
                </div>
              </div>
            </>
          )
        };
      case 'token-incentives':
        return {
          label: 'Economic Alignment',
          title: <>Token <br />Incentives</>,
          accent: 'Rewarding Productive Participation',
          graphic: (
            <>
              <div className="absolute right-32 top-1/2 -translate-y-1/2">
                <div className="relative h-48 w-48 flex items-end justify-between gap-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} 
                         className="w-4 bg-brand/20 border-t-2 border-brand relative group"
                         style={{ 
                           height: `${20 + (i * 15)}%`,
                           animation: `pulse 3s infinite ${i * 0.5}s`
                         }}>
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-brand rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}></div>
                    </div>
                  ))}
                </div>
                <div className="absolute -bottom-4 left-0 w-full h-px bg-brand/30"></div>
              </div>
            </>
          )
        };
      case 'community-brand':
        return {
          label: 'Strategic Presence',
          title: <>Community <br />& Brand</>,
          accent: 'Performance-Driven Trust',
          graphic: (
            <>
              <div className="absolute right-32 top-1/2 -translate-y-1/2">
                <div className="relative w-48 h-48">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} 
                         className="absolute inset-0 border border-brand/20 rounded-full"
                         style={{ 
                           transform: `scale(${0.4 + (i * 0.2)})`,
                           opacity: 1 - (i * 0.2),
                           animation: `ping 4s infinite ${i * 0.5}s`
                         }}></div>
                  ))}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-brand/10 rounded-full border border-brand/30 flex items-center justify-center">
                      <div className="w-4 h-4 bg-brand rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )
        };
      case 'market-integrity':
        return {
          label: 'Institutional Standards',
          title: <>Market <br />Integrity</>,
          accent: 'Structural Execution Fairness',
          graphic: (
            <>
              <div className="absolute inset-0 opacity-10">
                 <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_20px,var(--color-brand)_21px)] opacity-5"></div>
              </div>
              <div className="absolute right-32 top-1/2 -translate-y-1/2">
                <div className="relative w-40 h-40">
                  <div className="absolute inset-0 border-2 border-brand/40 rounded-sm"></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-brand/5 to-transparent h-1/2 animate-[scan_3s_linear_infinite]"></div>
                  <div className="absolute top-1/2 left-0 w-full h-[1px] bg-brand/50"></div>
                  <div className="absolute left-1/2 top-0 h-full w-[1px] bg-brand/50"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-2 h-2 bg-brand shadow-[0_0_20px_var(--color-brand)]"></div>
                  </div>
                </div>
              </div>
            </>
          )
        };
      case 'cex-to-onchain':
        return {
          label: 'The Great Migration',
          title: <>CEX to <br />On-Chain</>,
          accent: 'The Bridge to Deterministic Markets',
          graphic: (
            <>
              <div className="absolute right-24 top-1/2 -translate-y-1/2 flex items-center gap-12">
                <div className="grid grid-cols-2 gap-1 opacity-40">
                  {[...Array(4)].map((_, i) => <div key={i} className="w-4 h-4 bg-neutral-800 border border-neutral-700"></div>)}
                </div>
                <div className="w-24 h-px bg-gradient-to-r from-neutral-800 via-brand to-brand relative">
                   <div className="absolute -top-1 left-0 w-2 h-2 bg-brand rounded-full animate-[move_2s_linear_infinite]" style={{ left: '0%', offsetPath: 'path("M 0 4 L 96 4")' }}></div>
                </div>
                <div className="w-12 h-12 bg-brand/10 border border-brand/50 rounded-sm rotate-45 flex items-center justify-center relative overflow-hidden">
                   <div className="absolute inset-0 bg-brand/20 animate-pulse"></div>
                   <div className="w-2 h-2 bg-brand rounded-full shadow-[0_0_15px_var(--color-brand)]"></div>
                </div>
              </div>
            </>
          )
        };
      case 'first-1000':
        return {
          label: 'The Foundation',
          title: <>First 1,000 <br />Participants</>,
          accent: 'Establishing Minimum Viable Market',
          graphic: (
            <>
              <div className="absolute right-40 top-1/2 -translate-y-1/2">
                <div className="relative w-32 h-32 flex flex-wrap gap-2 justify-center content-center">
                  {[...Array(16)].map((_, i) => (
                    <div key={i} 
                         className="w-2 h-2 bg-brand/30 rounded-full animate-pulse"
                         style={{ animationDelay: `${Math.random() * 2}s` }}></div>
                  ))}
                  <div className="absolute -inset-4 border border-brand/10 rounded-full animate-[ping_4s_infinite]"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 border-2 border-brand rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-brand rounded-full"></div>
                  </div>
                </div>
              </div>
            </>
          )
        };
      case 'network-effects':
        return {
          label: 'Compound Growth',
          title: <>Network <br />Effects</>,
          accent: 'Building the Durable Execution Moat',
          graphic: (
            <>
              <div className="absolute right-32 top-1/2 -translate-y-1/2">
                <div className="relative w-48 h-48">
                  <div className="absolute inset-0 border border-brand/10 rounded-full animate-[spin_30s_linear_infinite]"></div>
                  <div className="absolute inset-8 border border-brand/20 rounded-full animate-[spin_20s_linear_infinite_reverse]"></div>
                  <div className="absolute inset-16 border border-brand/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                    <path d="M 50 10 L 90 50 L 50 90 L 10 50 Z" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-brand/40" />
                    <circle cx="50" cy="50" r="2" fill="currentColor" className="text-brand shadow-[0_0_10px_var(--color-brand)]" />
                  </svg>
                </div>
              </div>
            </>
          )
        };
      default:
        return {
          label: `Stage 0${currentIndex + 1}`,
          title: page.title,
          accent: 'Tier 1 GTM Strategy',
          graphic: null
        };
    }
  };

  const header = getHeaderContent(slug);

  return (
    <GTMLayout navigation={navigation}>
      {header.graphic ? (
        <div className="mb-16 relative overflow-hidden rounded-sm bg-neutral-950 border border-neutral-900 p-8 md:p-16 min-h-[320px] flex flex-col justify-center">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {header.graphic}
            <div className="absolute -right-48 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,_var(--color-brand)_0%,_transparent_70%)] opacity-[0.05]"></div>
          </div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-8 h-[2px] bg-brand"></div>
              <h1 className="text-xs font-black text-brand uppercase tracking-[0.4em]">
                {header.label}
              </h1>
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9] mb-4 uppercase">
              {header.title}
            </h2>
            <p className="text-neutral-500 text-sm font-bold uppercase tracking-widest mt-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse"></span>
              {header.accent}
            </p>
          </div>
        </div>
      ) : (
        <div className="mb-8 pb-8 border-b border-neutral-900">
          <h1 className="text-sm font-bold text-brand uppercase tracking-[0.3em] mb-4">
            Tier 1 Go-To-Market Strategy
          </h1>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
            {page.title}
          </h2>
        </div>
      )}

      <article className="max-w-none">
        <MarkdownContent content={page.content} />
      </article>

      {/* Pagination Navigation */}
      <div className="mt-16 pt-8 border-t border-neutral-900 grid grid-cols-1 md:grid-cols-2 gap-4">
        {prevPage ? (
          <Link
            href={prevPage.href}
            className="group flex flex-col p-6 rounded-sm border border-neutral-900 hover:border-brand/30 transition-all text-left"
          >
            <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest mb-2 flex items-center gap-1 group-hover:text-brand/70 transition-colors">
              <ChevronLeft className="w-3 h-3" /> Previous
            </span>
            <span className="text-lg font-bold text-neutral-400 group-hover:text-white transition-colors">
              {prevPage.title}
            </span>
          </Link>
        ) : (
          <div />
        )}

        {nextPage ? (
          <Link
            href={nextPage.href}
            className="group flex flex-col p-6 rounded-sm border border-neutral-900 hover:border-brand/30 transition-all text-right"
          >
            <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest mb-2 flex items-center justify-end gap-1 group-hover:text-brand/70 transition-colors">
              Next <ChevronRight className="w-3 h-3" />
            </span>
            <span className="text-lg font-bold text-neutral-400 group-hover:text-white transition-colors">
              {nextPage.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </GTMLayout>
  );
}

