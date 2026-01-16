'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Search, X } from 'lucide-react';
import Link from 'next/link';
import { useDebounce } from '@/hooks/use-debounce';

export function DocumentSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const searchResults = useQuery(
    api.documents.search,
    debouncedQuery.length > 0 ? { query: debouncedQuery } : 'skip'
  );

  // Handle click outside to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut: / to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleResultClick = () => {
    setQuery('');
    setIsOpen(false);
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;

    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-brand/30 dark:bg-brand/20 text-black dark:text-white font-semibold">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-600" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search documents... (Press / to focus)"
          className="w-full pl-9 pr-9 py-2 text-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md focus:outline-none focus:ring-2 focus:ring-brand/50 dark:focus:ring-brand/30 text-black dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-600 hover:text-black dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Results */}
      {isOpen && query && (
        <div
          ref={resultsRef}
          className="absolute top-full mt-2 w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md shadow-lg max-h-[400px] overflow-y-auto z-50"
        >
          {searchResults === undefined ? (
            <div className="p-4 text-sm text-neutral-500 dark:text-neutral-500">
              Searching...
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-4 text-sm text-neutral-500 dark:text-neutral-500">
              No results found for "{query}"
            </div>
          ) : (
            <>
              <div className="px-3 py-2 text-xs font-semibold text-neutral-500 dark:text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">
                {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}
              </div>
              <div className="py-1">
                {searchResults.map((result) => (
                  <Link
                    key={result._id}
                    href={result.order === 0 ? '/' : `/${result.slug}`}
                    onClick={handleResultClick}
                    className="block px-3 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <div className="font-medium text-sm text-black dark:text-white mb-1">
                      {result.titleMatch ? (
                        highlightMatch(result.title, query)
                      ) : (
                        result.title
                      )}
                    </div>
                    {result.matches.length > 0 && (
                      <div className="space-y-1">
                        {result.matches.map((match, i) => (
                          <div
                            key={i}
                            className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2"
                          >
                            {highlightMatch(match.text, query)}
                          </div>
                        ))}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
