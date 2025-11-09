import PostCard from './PostCard';
import type { Post } from '@/lib/posts';

interface PostListProps {
  posts: Post[];
  titleSize?: 'lg' | 'xl' | '2xl';
  showMeta?: boolean;
  emptyMessage?: string;
}

export default function PostList({ 
  posts, 
  titleSize = '2xl',
  showMeta = true,
  emptyMessage = '暂无文章'
}: PostListProps) {
  if (posts.length === 0) {
    return (
      <p className="text-[var(--text-light)] dark:text-[var(--text-dark)] opacity-60">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {posts.map(post => (
        <li key={post.slug}>
          <PostCard 
            post={post} 
            titleSize={titleSize}
            showMeta={showMeta}
          />
        </li>
      ))}
    </ul>
  );
}
