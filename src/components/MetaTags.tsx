import Link from 'next/link';
import type { Post } from '@/lib/posts';

interface MetaTagsProps {
  post: Post;
  layout?: 'horizontal' | 'vertical';
  showArchive?: boolean;
  showCategory?: boolean;
  showTags?: boolean;
}

export default function MetaTags({ 
  post, 
  layout = 'horizontal',
  showArchive = true,
  showCategory = true,
  showTags = true
}: MetaTagsProps) {
  const containerClasses = layout === 'horizontal' 
    ? "flex gap-4 mt-1 flex-wrap items-center"
    : "flex gap-2 mt-1 flex-wrap";

  const hasContent = (showArchive && post.archive) || 
                    (showCategory && post.category) || 
                    (showTags && post.tags && post.tags.length > 0);

  if (!hasContent) return null;

  return (
    <div className={containerClasses}>
      {showArchive && post.archive && (
        <div className="flex gap-2">
          <span className="text-xs bg-[var(--line-light)] dark:bg-[var(--line-dark)] px-2 py-0.5">
            {post.archive}
          </span>
        </div>
      )}
      
      {showCategory && post.category && (
        <div className="flex gap-2">
          <Link
            href={`/category/${encodeURIComponent(post.category)}`}
            className="text-xs bg-[var(--category-bg)] text-[var(--category-text)] px-3 py-1.5 rounded-lg border border-[var(--line-light)] dark:border-[var(--line-dark)] hover:opacity-80 transition-opacity font-semibold"
          >
            {post.category}
          </Link>
        </div>
      )}
      
      {showTags && post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
        <div className="flex gap-2">
          {post.tags.map((tag, index) => (
            <Link
              key={index}
              href={`/tag/${encodeURIComponent(tag)}`}
              className="text-xs bg-[var(--tag-bg)] text-[var(--tag-text)] px-2 py-1 rounded-lg border border-[var(--line-light)] dark:border-[var(--line-dark)] hover:opacity-80 transition-opacity font-normal inline-flex items-center justify-center whitespace-nowrap"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
