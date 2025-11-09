'use client';

import Link from 'next/link';

interface TagCloudProps {
  tags: Record<string, number>;
}

export default function TagCloud({ tags }: TagCloudProps) {
  const maxCount = Math.max(...Object.values(tags));
  const minCount = Math.min(...Object.values(tags));
  const range = maxCount - minCount || 1;

  const getTagSize = (count: number) => {
    const ratio = (count - minCount) / range;
    if (ratio > 0.8) return 'text-2xl';
    if (ratio > 0.6) return 'text-xl';
    if (ratio > 0.4) return 'text-lg';
    if (ratio > 0.2) return 'text-base';
    return 'text-sm';
  };

  const getTagOpacity = (count: number) => {
    const ratio = (count - minCount) / range;
    return 0.4 + ratio * 0.6;
  };

  return (
    <div className="flex flex-wrap gap-3 justify-center items-center p-6">
      {Object.entries(tags).map(([tag, count]) => (
        <Link
          key={tag}
          href={`/tag/${encodeURIComponent(tag)}`}
          className={`inline-flex items-center justify-center px-2 py-1 transition-all duration-200 hover:scale-105 text-xs bg-[var(--tag-bg)] text-[var(--tag-text)] hover:bg-[var(--category-bg)] hover:text-[var(--category-text)] rounded-lg border border-[var(--line-light)] dark:border-[var(--line-dark)] hover:shadow-sm font-normal whitespace-nowrap`}
          style={{ 
            opacity: getTagOpacity(count)
          }}
        >
          <span className="font-medium">{tag}</span>
          <span className="ml-2 text-xs bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded-full">
            {count}
          </span>
        </Link>
      ))}
    </div>
  );
}
