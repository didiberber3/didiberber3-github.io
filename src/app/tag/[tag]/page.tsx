import { getPosts } from '@/lib/posts';
import { blogConfig } from '@/lib/config';
import Breadcrumb from '@/components/Breadcrumb';
import PostList from '@/components/PostList';

// 生成静态参数
export async function generateStaticParams() {
  try {
    const posts = await getPosts();
    const tags = [...new Set(posts.flatMap(post => post.tags || []))];
    return tags.map((tag) => ({
      tag: tag,
    }));
  } catch (error) {
    console.error('Error generating static params for tags:', error);
    return [];
  }
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> | { tag: string } }) {
  const resolvedParams = await Promise.resolve(params);
  const tag = decodeURIComponent(resolvedParams.tag);
  
  const posts = await getPosts();
  const taggedPosts = posts.filter(post => post.tags && post.tags.includes(tag));

  return (
    <main className="max-w-[60%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb 
        showHome={false}
        items={[{ label: '← 返回归档', href: '/archive' }]}
      />
      
      <h1 className="text-3xl font-bold mb-8">
        标签: {tag}
      </h1>
      
      <PostList 
        posts={taggedPosts} 
        titleSize="lg"
        emptyMessage={`没有找到包含标签 "${tag}" 的文章`}
      />
    </main>
  );
}
