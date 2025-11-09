import Link from 'next/link';
import { format } from 'date-fns';
import { blogConfig } from '@/lib/config';
import type { Post } from '@/lib/posts';

interface PostCardProps {
  post: Post;
  showMeta?: boolean;
  titleSize?: 'lg' | 'xl' | '2xl';
}

export default function PostCard({ 
  post, 
  showMeta = true, 
  titleSize = '2xl' 
}: PostCardProps) {
  const titleClasses = {
    lg: 'text-lg',
    xl: 'text-xl', 
    '2xl': 'text-2xl'
  };

  return (
    <div className="flex justify-between items-center p-4 border-b border-[var(--line-light)] dark:border-[var(--line-dark)]">
      <div className="flex-1">
        <Link 
          href={`/posts/${encodeURIComponent(post.slug)}`} 
          className={`block ${titleClasses[titleSize]} font-semibold hover:opacity-70 transition-opacity`}
        >
          {post.title}
        </Link>
        
        {showMeta && (post.archive || post.category || post.tags) && (
          <div className="flex gap-4 mt-1 flex-wrap items-center">
            {post.archive && (
              <div className="flex gap-2">
                <span className="text-xs bg-[var(--line-light)] dark:bg-[var(--line-dark)] px-2 py-0.5">
                  {post.archive}
                </span>
              </div>
            )}
            {post.category && (
              <div className="flex gap-2">
                <Link
                  href={`/category/${encodeURIComponent(post.category)}`}
                  className="text-xs bg-[var(--category-bg)] text-[var(--category-text)] px-3 py-1.5 rounded-lg border border-[var(--line-light)] dark:border-[var(--line-dark)] hover:opacity-80 transition-opacity font-semibold"
                >
                  {post.category}
                </Link>
              </div>
            )}
            {post.tags && post.tags.length > 0 && (
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
        )}
      </div>
      
      <span className="text-sm text-[var(--text-light)] dark:text-[var(--text-dark)] ml-4 opacity-60">
        {format(new Date(post.date), blogConfig.posts.dateFormat)}
      </span>
    </div>
  );
}
