'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Skeleton } from '@/components/ui/skeleton';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const lightLogoUrl = useQuery(api.settings.getLogoUrl, { mode: 'light' });
  const darkLogoUrl = useQuery(api.settings.getLogoUrl, { mode: 'dark' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        router.push('/');
        router.refresh();
      } else {
        setError('Invalid password');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0a] relative">
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md px-8">
        <div className="text-center mb-8">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            {lightLogoUrl === undefined && darkLogoUrl === undefined ? (
              <Skeleton className="h-12 w-32 rounded-sm" />
            ) : lightLogoUrl || darkLogoUrl ? (
              <>
                {lightLogoUrl && (
                  <img
                    src={lightLogoUrl}
                    alt="Logo"
                    className="h-12 w-auto object-contain dark:hidden"
                  />
                )}
                {darkLogoUrl && (
                  <img
                    src={darkLogoUrl}
                    alt="Logo"
                    className="h-12 w-auto object-contain hidden dark:block"
                  />
                )}
                {!darkLogoUrl && lightLogoUrl && (
                  <img
                    src={lightLogoUrl}
                    alt="Logo"
                    className="h-12 w-auto object-contain hidden dark:block"
                  />
                )}
                {!lightLogoUrl && darkLogoUrl && (
                  <img
                    src={darkLogoUrl}
                    alt="Logo"
                    className="h-12 w-auto object-contain dark:hidden"
                  />
                )}
              </>
            ) : (
              <h1 className="text-4xl font-bold text-black dark:text-white">Tier 1</h1>
            )}
          </div>
          <p className="text-neutral-600 dark:text-neutral-400">Enter password to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-lg text-black dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#d9ff00] focus:border-transparent"
              autoFocus
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-3 bg-[#d9ff00] text-black font-semibold rounded-lg hover:bg-[#c5e600] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Verifying...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
