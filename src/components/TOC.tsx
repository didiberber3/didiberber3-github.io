'use client';

import { useEffect, useState } from 'react';

type TOCItem = {
  id: string;
  title: string;
  level: number;
};

export default function TOC() {
  const [toc, setToc] = useState<TOCItem[]>([]);

  useEffect(() => {
    const updateTOC = () => {
      const article = document.querySelector('article');
      if (article) {
        // Capture h1, h2, h3 headings
        const headings = Array.from(article.querySelectorAll('h1, h2, h3, h4, h5, h6'));
        const tocItems = headings.map(h => ({
          id: h.id,
          title: h.textContent || '',
          level: parseInt(h.tagName.charAt(1)) // Extract number from h1, h2, h3, etc.
        }));
        setToc(tocItems);
      }
    };

    // Initial update
    updateTOC();

    // Update after content loads
    const timeoutId = setTimeout(updateTOC, 100);

    // Observe DOM changes
    const observer = new MutationObserver(updateTOC);
    const article = document.querySelector('article');
    if (article) {
      observer.observe(article, { childList: true, subtree: true });
    }

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  if (!toc.length) return null;

  return (
    <aside className="hidden xl:block w-full flex-shrink-0">
      {/* Key: sticky positioning + independent scrolling */}
      <div className="sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto pl-2 text-xs overflow-x-hidden">
        <h3 className="text-xs font-semibold mb-2 opacity-70">目录</h3>
        <ul className="space-y-1 text-xs">
          {toc.map(item => (
            <li 
              key={item.id} 
              className={`${item.level > 1 ? 'ml-' + ((item.level - 1) * 4) : ''}`}
              style={{ marginLeft: `${(item.level - 1) * 1}rem` }}
            >
              <a 
                href={`#${item.id}`} 
                className={`block py-0.5 leading-tight text-xs transition-all duration-200 hover:translate-x-1
                  ${item.level === 1 ? 'font-bold opacity-100 text-sm hover:text-[var(--article-accent)]' : ''}
                  ${item.level === 2 ? 'font-semibold opacity-90 hover:text-[var(--article-accent-hover)]' : ''}
                  ${item.level === 3 ? 'font-medium opacity-80 hover:text-[var(--article-accent)]' : ''}
                  ${item.level === 4 ? 'font-normal opacity-70 hover:text-[var(--article-accent-hover)]' : ''}
                  ${item.level >= 5 ? 'font-normal opacity-60 text-[11px] hover:text-[var(--article-accent)]' : ''}
                `}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
