import React, { useMemo } from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';
import rawItems from '../items.json';
import { normalizeItems } from './utils';
import { ChristmasItem, RawItem } from './types';

export const App: React.FC<{ itemsOverride?: RawItem[] }> = ({ itemsOverride }) => {
  const items: ChristmasItem[] = useMemo(() => {
    return normalizeItems(itemsOverride || (rawItems as RawItem[]));
  }, [itemsOverride]);

  return (
    <div className="min-h-screen bg-warm-50 text-warm-900 flex flex-col justify-between selection:bg-pine-100 selection:text-pine-900">
      <main className="w-full max-w-xl mx-auto px-4 py-10 sm:py-16">
        {/* Header */}
        <header className="mb-8 sm:mb-12 text-center">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-pine-100 text-pine-800 mb-3 shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-pine-900 tracking-tight font-normal">
            Christmas List
          </h1>
          <div className="mt-2 flex items-center justify-center gap-2 text-xs text-warm-800/70">
            <span>{items.length} {items.length === 1 ? 'item' : 'items'}</span>
          </div>
        </header>

        {/* Item List */}
        {items.length === 0 ? (
          <div className="text-center py-12 text-warm-800/60 text-sm">
            No items listed yet.
          </div>
        ) : (
          <ul className="space-y-4 sm:space-y-5" role="list">
            {items.map((item) => (
              <li
                key={item.id}
                className="bg-white/80 backdrop-blur-xs border border-warm-200/90 rounded-2xl p-5 shadow-[0_2px_8px_rgba(35,74,54,0.04)] hover:border-pine-200 transition-colors"
              >
                <div className="flex flex-col gap-2">
                  <h2 className="text-base sm:text-lg font-medium text-warm-900 leading-snug">
                    {item.title}
                  </h2>

                  {item.description && (
                    <p className="text-sm text-warm-800/80 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  )}

                  {item.links.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2 pt-1 border-t border-warm-100">
                      {item.links.map((link, idx) => (
                        <a
                          key={`${item.id}-link-${idx}`}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-pine-800 bg-pine-50 hover:bg-pine-100 active:scale-[0.98] border border-pine-200/60 transition-all touch-manipulation"
                          aria-label={`Open link for ${item.title}: ${link.label}`}
                        >
                          <span className="truncate max-w-[200px]">{link.label}</span>
                          <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-70" aria-hidden="true" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>

      {/* Discreet footer */}
      <footer className="w-full text-center py-6 text-xs text-warm-800/40 border-t border-warm-200/40">
        <span>✦</span>
      </footer>
    </div>
  );
};

export default App;
