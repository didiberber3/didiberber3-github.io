import { getPosts } from '@/lib/posts';
import { blogConfig } from '@/lib/config';
import Breadcrumb from '@/components/Breadcrumb';
import PostList from '@/components/PostList';
import type { Post } from '@/lib/posts';

interface CategoryDetailPageProps {
  params: Promise<{ category: string }> | { category: string };
}

// 生成静态参数
export async function generateStaticParams() {
  try {
    const posts = await getPosts();
    const categories = [...new Set(posts.flatMap(post => post.category ? [post.category] : []))];
    return categories.map((category) => ({
      category: category,
    }));
  } catch (error) {
    console.error('Error generating static params for categories:', error);
    return [];
  }
}

export default async function CategoryDetailPage({ params }: CategoryDetailPageProps) {
  const resolvedParams = await Promise.resolve(params);
  const category = decodeURIComponent(resolvedParams.category);
  
  const posts = await getPosts();
  const categoryPosts = posts.filter(p => p.category === category);

  return (
    <main className="max-w-[60%] mx-auto px-4 py-8">
      <Breadcrumb showArchive={true} />
      
      <h1 className="text-3xl font-bold mb-6 w-full">分类: {category}</h1>
      
      <PostList 
        posts={categoryPosts} 
        titleSize="lg"
        emptyMessage="该分类下暂无文章"
      />
    </main>
  );
}
