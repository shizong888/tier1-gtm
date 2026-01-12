import Link from 'next/link';
import { generateNavigation } from '@/lib/markdown';
import { ArrowRight, Twitter, Send } from 'lucide-react';

export default async function Home() {
  const navigation = await generateNavigation();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Top Navigation */}
      <nav className="bg-brand px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-12">
          <Link href="/" className="text-black text-2xl font-black tracking-tighter">
            tier_1
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#" className="text-black/70 hover:text-black font-medium flex items-center gap-1">
              Trade <span className="text-[10px]">▼</span>
            </Link>
            <Link href="#" className="text-black/70 hover:text-black font-medium">
              Rewards
            </Link>
            <Link href="#" className="text-black/70 hover:text-black font-medium">
              Referrals
            </Link>
            <Link href="/gtm/executive-summary" className="text-black/70 hover:text-black font-medium">
              Docs
            </Link>
          </div>
        </div>
        <button className="bg-black text-brand px-6 py-2 rounded-sm font-bold text-sm hover:bg-black/90 transition-colors">
          Join Waitlist
        </button>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 relative overflow-hidden py-32">
        {/* Decorative Inspiration Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Large Circle Background from screenshots */}
          <div className="absolute -right-[10%] top-[20%] w-[600px] h-[600px] border-[60px] border-brand/5 rounded-full opacity-20"></div>
          <div className="absolute -right-[5%] top-[25%] w-[450px] h-[450px] border-[30px] border-brand/10 rounded-full opacity-10"></div>
          
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_50%,_var(--color-brand)_0%,_transparent_50%)] opacity-5"></div>
        </div>

        <div className="max-w-4xl w-full text-center relative z-10">
          <div className="inline-block mb-6 px-4 py-1.5 bg-brand/10 border border-brand/20 rounded-full">
            <span className="text-xs font-bold text-brand uppercase tracking-[0.2em]">The Institutional-Grade Exchange</span>
          </div>
          
          <h1 className="text-7xl md:text-9xl font-black mb-10 leading-[0.9] tracking-tighter">
            Powering the <br />
            <span className="text-brand">future of trading|</span>
          </h1>
          
          <p className="text-neutral-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Tier 1 Exchange: The ultra-low-latency crypto exchange built for deterministic perpetual and spot trading.
          </p>

          {/* Waitlist Form */}
          <div className="max-w-xl mx-auto mb-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-brand/20 blur-xl group-focus-within:bg-brand/30 transition-all duration-500"></div>
              <div className="relative flex items-center bg-neutral-900/80 border border-neutral-800 rounded-sm p-1 backdrop-blur-md">
                <span className="pl-4 text-neutral-500 font-mono">{">"}</span>
                <input 
                  type="email" 
                  placeholder="Enter your email to join the Waitlist" 
                  className="flex-1 bg-transparent border-none outline-none px-4 py-4 text-white placeholder:text-neutral-600 font-medium"
                />
                <div className="flex items-center gap-2 pr-2">
                  <div className="p-2 bg-neutral-800 rounded-sm">
                    <div className="w-4 h-4 bg-neutral-600 rounded-[1px]"></div>
                  </div>
                  <button className="bg-brand text-black px-6 py-3 rounded-sm font-black text-sm hover:brightness-110 transition-all">
                    Join Waitlist
                  </button>
                </div>
              </div>
            </div>
            <p className="mt-4 text-neutral-600 text-xs text-left px-2">
              By joining the waitlist, you agree to receive updates from Tier 1. Unsubscribe at any time.
            </p>
          </div>
        </div>

        {/* GTM Section Link (Optional, keeping it subtle) */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-6xl">
           {navigation.slice(0, 4).map((item) => (
             <Link
               key={item.slug}
               href={item.href}
               className="group p-4 bg-neutral-900/30 border border-neutral-800/50 rounded-sm hover:border-brand/30 transition-all text-left"
             >
               <div className="flex items-center justify-between mb-2">
                 <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">
                   {String(item.order).padStart(2, '0')} Strategy
                 </span>
                 <ArrowRight className="w-3 h-3 text-neutral-600 group-hover:text-brand transition-all" />
               </div>
               <h4 className="text-sm font-bold text-neutral-400 group-hover:text-white transition-all">
                 {item.title}
               </h4>
             </Link>
           ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-neutral-900 px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-white text-xl font-black tracking-tighter">
              tier_1
            </Link>
            <span className="text-neutral-600 text-sm">© 2026 Tier 1.</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-white tracking-tight">Trade like the 1%</span>
            <span className="text-2xl font-black text-brand tracking-tight">Be the <span className="underline decoration-brand/30">Tier 1</span></span>
          </div>
        </div>
        
        <div className="flex flex-col md:items-end gap-6">
          <div className="flex items-center gap-8">
            <Link href="#" className="text-neutral-500 hover:text-white text-sm font-medium transition-colors">Terms of Service</Link>
            <Link href="#" className="text-neutral-500 hover:text-white text-sm font-medium transition-colors">Privacy Policy</Link>
          </div>

          <div className="flex items-center gap-6">
            <Link href="#" className="text-neutral-500 hover:text-white transition-colors">
              <Twitter className="w-5 h-5 fill-current" />
            </Link>
            <Link href="#" className="text-neutral-500 hover:text-white transition-colors">
              <Send className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
