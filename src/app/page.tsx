import { getPosts } from '@/lib/posts';
import { blogConfig } from '@/lib/config';
import PostList from '@/components/PostList';

// Force static generation for GitHub Pages compatibility
export const dynamic = 'force-static';

export default async function Home() {
  const posts = await getPosts();
  
  return (
    <main className="max-w-[60%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8 w-full">
        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
        {blogConfig.blog.homeTitle}
      </h1>
      
      <PostList 
        posts={posts} 
        titleSize="2xl"
        emptyMessage={blogConfig.posts.noPostsMessage}
      />
    </main>
  );
}
