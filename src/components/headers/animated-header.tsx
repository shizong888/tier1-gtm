import React from 'react';

interface AnimatedHeaderProps {
  style: string;
  label?: string;
  title?: string;
  accent?: string;
}

export function AnimatedHeader({ style, label, title, accent }: AnimatedHeaderProps) {
  const getHeaderGraphic = (styleId: string) => {
    switch (styleId) {
      case 'executive-summary':
        return (
          <>
            <div className="absolute inset-0 opacity-[0.1] [mask-image:radial-gradient(ellipse_80%_80%_at_100%_50%,#000_20%,transparent_100%)]">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-brand)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-brand)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            </div>
            <div className="absolute right-0 top-[30%] w-1/2 h-[1px] bg-gradient-to-r from-transparent via-brand to-transparent opacity-20 animate-pulse"></div>
            <div className="absolute right-0 top-[50%] w-2/3 h-[1px] bg-gradient-to-r from-transparent via-brand/50 to-transparent opacity-10 animate-pulse [animation-delay:1s]"></div>
            <div className="absolute right-0 top-[70%] w-1/3 h-[1px] bg-gradient-to-r from-transparent via-brand to-transparent opacity-20 animate-pulse [animation-delay:0.5s]"></div>
            <div className="absolute right-32 top-1/2 -translate-y-1/2 flex items-center justify-center">
              <div className="relative w-48 h-48 flex items-center justify-center">
                <div className="absolute inset-0 border border-brand/10 rounded-sm rotate-45 animate-[spin_30s_linear_infinite]"></div>
                <div className="absolute inset-4 border border-brand/20 rounded-sm rotate-45 animate-[spin_20s_linear_infinite_reverse]"></div>
                <div className="absolute inset-8 border border-brand/30 rounded-sm rotate-45 animate-[spin_10s_linear_infinite]"></div>
                <div className="w-2 h-2 bg-brand rounded-full shadow-[0_0_30px_var(--color-brand)]"></div>
                <div className="absolute w-4 h-4 bg-brand/40 rounded-full animate-ping"></div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand/[0.03] to-transparent h-[100px] w-full -top-[100px] animate-[scan_4s_linear_infinite]"></div>
          </>
        );

      case 'target-audience':
        return (
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
        );

      case 'value-proposition':
        return (
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
        );

      case 'expanding-reach':
        return (
          <>
            <div className="absolute right-32 top-1/2 -translate-y-1/2 w-64 h-64 pointer-events-none">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="absolute inset-0 border border-brand/20 rounded-full animate-grow"
                  style={{ animationDelay: `${i * 1.3}s` }}
                ></div>
              ))}
            </div>
            <div className="absolute right-40 top-1/2 -translate-y-1/2">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <div className="absolute inset-0 border border-brand/5 rounded-full animate-spin-slow"></div>
                <div className="absolute inset-8 border border-brand/10 rounded-full animate-reverse-spin"></div>
                {[...Array(6)].map((_, i) => (
                  <div key={i}
                       className="absolute"
                       style={{
                         transform: `rotate(${i * 60}deg)`,
                         height: '140%',
                         width: '2px',
                       }}>
                    <div className="absolute bottom-1/2 left-0 w-full bg-gradient-to-t from-transparent via-brand to-transparent h-16 animate-[node-scan_2s_linear_infinite]"
                         style={{ animationDelay: `${i * 0.3}s` }}></div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-brand rounded-sm rotate-45 shadow-[0_0_15px_var(--color-brand)] animate-pulse"
                         style={{ animationDelay: `${i * 0.2}s` }}>
                      <div className="absolute inset-0 bg-brand/50 rounded-sm animate-ping"></div>
                    </div>
                  </div>
                ))}
                <div className="relative w-10 h-10 bg-black border border-brand/40 rounded-sm rotate-45 flex items-center justify-center z-10 shadow-[0_0_30px_rgba(217,255,0,0.2)]">
                  <div className="w-2 h-2 bg-brand rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </>
        );

      case 'partnerships':
        return (
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
        );

      case 'token-incentives':
        return (
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
        );

      case 'community-brand':
        return (
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
        );

      case 'market-integrity':
        return (
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
        );

      case 'cex-to-onchain':
        return (
          <>
            <div className="absolute right-24 top-1/2 -translate-y-1/2 flex items-center gap-12">
              <div className="grid grid-cols-2 gap-1 opacity-40">
                {[...Array(4)].map((_, i) => <div key={i} className="w-4 h-4 bg-neutral-800 border border-neutral-700"></div>)}
              </div>
              <div className="w-24 h-px bg-gradient-to-r from-neutral-800 via-brand to-brand relative">
                 <div className="absolute -top-1 left-0 w-2 h-2 bg-brand rounded-full animate-[move_2s_linear_infinite]"></div>
              </div>
              <div className="w-12 h-12 bg-brand/10 border border-brand/50 rounded-sm rotate-45 flex items-center justify-center relative overflow-hidden">
                 <div className="absolute inset-0 bg-brand/20 animate-pulse"></div>
                 <div className="w-2 h-2 bg-brand rounded-full shadow-[0_0_15px_var(--color-brand)]"></div>
              </div>
            </div>
          </>
        );

      case 'first-1000':
        return (
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
        );

      case 'network-effects':
        return (
          <>
            <div className="absolute right-32 top-1/2 -translate-y-1/2">
              <div className="relative w-48 h-48 flex items-center justify-center">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute border border-brand/30 rounded-full animate-grow"
                    style={{
                      width: '100%',
                      height: '100%',
                      animationDelay: `${i * 1}s`,
                    }}
                  ></div>
                ))}
                <div className="absolute inset-0 animate-spin-slow">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2.5 h-2.5 bg-brand rounded-full"
                      style={{
                        top: '50%',
                        left: '50%',
                        transform: `rotate(${i * 45}deg) translateY(-96px)`,
                      }}
                    >
                      <div className="absolute inset-0 bg-brand/50 rounded-full animate-ping"></div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[1px] h-24 bg-gradient-to-t from-brand/40 to-transparent origin-bottom"></div>
                    </div>
                  ))}
                </div>
                <div className="absolute inset-0 animate-reverse-spin">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1.5 h-1.5 bg-brand/40 rounded-full"
                      style={{
                        top: '50%',
                        left: '50%',
                        transform: `rotate(${i * 30}deg) translateY(-60px)`,
                      }}
                    >
                      <div className="absolute inset-0 bg-brand/30 rounded-full animate-pulse"></div>
                    </div>
                  ))}
                </div>
                <div className="relative w-12 h-12 bg-black border-2 border-brand/50 rounded-full flex items-center justify-center z-10 shadow-[0_0_50px_rgba(217,255,0,0.2)]">
                  <div className="w-3 h-3 bg-brand rounded-full shadow-[0_0_20px_var(--color-brand)]"></div>
                  <div className="absolute inset-0 border border-brand/20 rounded-full animate-ping"></div>
                </div>
                <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100">
                  <path d="M 50 2 L 98 50 L 50 98 L 2 50 Z" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-brand" />
                  <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.25" className="text-brand" />
                </svg>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const graphic = getHeaderGraphic(style);

  if (!graphic) {
    // Simple header without animation
    return (
      <div className="mb-8 pb-8 border-b border-neutral-900">
        {label && (
          <h1 className="text-sm font-medium text-brand tracking-[0.3em] mb-4">
            {label}
          </h1>
        )}
        <h2 className="text-4xl md:text-5xl font-medium text-white tracking-tighter">
          {title || 'Document Title'}
        </h2>
      </div>
    );
  }

  return (
    <div className="mb-16 relative overflow-hidden rounded-sm bg-neutral-950 border border-neutral-900 p-8 md:p-16 min-h-[320px] flex flex-col justify-center">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {graphic}
        <div className="absolute -right-48 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,_var(--color-brand)_0%,_transparent_70%)] opacity-[0.05]"></div>
      </div>

      <div className="relative z-10">
        {label && (
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-8 h-[2px] bg-brand"></div>
            <h1 className="text-xs font-medium text-brand tracking-[0.4em]">
              {label}
            </h1>
          </div>
        )}
        <h2 className="text-5xl md:text-7xl font-medium text-white tracking-tighter leading-[0.9] mb-4">
          {title || 'Document Title'}
        </h2>
        {accent && (
          <p className="text-neutral-500 text-sm font-bold tracking-widest mt-6 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse"></span>
            {accent}
          </p>
        )}
      </div>
    </div>
  );
}
