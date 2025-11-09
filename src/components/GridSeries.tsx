'use client';

import Link from 'next/link';
import { Post } from '@/lib/posts';

interface GridSeriesProps {
  archive: Record<string, Post[]>;
  title?: string;
}

export default function GridSeries({ archive, title }: GridSeriesProps) {
  const categoryEntries = Object.entries(archive).sort((a, b) => a[0].localeCompare(b[0]));

  if (categoryEntries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--text-light)] dark:text-[var(--text-dark)] opacity-60">
          暂无分类内容
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {title && (
        <h2 className="text-2xl font-semibold mb-4 text-[var(--text-light)] dark:text-[var(--text-dark)]">
          {title}
        </h2>
      )}
      
      {/* 紧凑的标签样式布局 */}
      <div className="flex flex-wrap gap-2">
        {categoryEntries.map(([categoryName, posts]) => (
          <Link
            key={categoryName}
            href={`/category/${encodeURIComponent(categoryName)}`}
            className="inline-flex items-center px-3 py-1.5 transition-all duration-200 hover:scale-105 text-sm bg-[var(--category-bg)] text-[var(--category-text)] hover:bg-[var(--tag-bg)] hover:text-[var(--tag-text)] rounded-lg border border-[var(--line-light)] dark:border-[var(--line-dark)] hover:shadow-md font-semibold"
          >
            <span className="font-medium">{categoryName}</span>
            <span className="ml-2 text-xs bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded-full">
              {posts.length}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
