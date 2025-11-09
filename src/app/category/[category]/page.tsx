import { getPosts } from '@/lib/posts';
import Link from 'next/link';
import { blogConfig } from '@/lib/config';

import type { Post } from '@/lib/posts';

interface CategoryDetailPageProps {
  params: Promise<{ category: string }> | { category: string };
}

export default async function CategoryDetailPage({ params }: CategoryDetailPageProps) {
  const resolvedParams = await Promise.resolve(params);
  const category = decodeURIComponent(resolvedParams.category);
  
  const posts = await getPosts();
  const categoryPosts = posts.filter(p => p.category === category);

  return (
    <main className="max-w-[60%] mx-auto px-4 py-8">
      <div className="mb-6 flex gap-4">
        <Link href="/" className="text-sm text-[var(--text-light)] dark:text-[var(--text-dark)] hover:underline opacity-60">
          {blogConfig.navigationText.backToHome}
        </Link>
        <Link href="/archive" className="text-sm text-[var(--text-light)] dark:text-[var(--text-dark)] hover:underline opacity-60">
          {blogConfig.navigationText.backToArchive}
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-6 w-full">分类: {category}</h1>
      
      {categoryPosts.length === 0 ? (
        <p className="text-[var(--text-light)] dark:text-[var(--text-dark)] opacity-60">
          该分类下暂无文章
        </p>
      ) : (
        <ul className="space-y-4">
          {categoryPosts.map(p => (
            <li key={p.slug}>
              <Link href={`/posts/${encodeURIComponent(p.slug)}`} className="block hover:opacity-70 transition-opacity">
                <div className="flex justify-between items-center p-4 border-b border-[var(--line-light)] dark:border-[var(--line-dark)]">
                  <div className="flex-1">
                    <span className="text-lg font-semibold">{p.title}</span>
                    {(p.archive || p.category) && (
                      <div className="flex gap-2 mt-1">
                        {p.archive && (
                          <span className="text-xs bg-[var(--line-light)] dark:bg-[var(--line-dark)] px-2 py-0.5">
                            {p.archive}
                          </span>
                        )}
                        {p.category && (
                          <span className="text-xs bg-[var(--line-light)] dark:bg-[var(--line-dark)] px-2 py-0.5">
                            {p.category}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <span className="text-sm text-[var(--text-light)] dark:text-[var(--text-dark)] ml-4 opacity-60">
                    {new Date(p.date).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

// 为静态导出生成所有可能的 category 参数
export async function generateStaticParams() {
  const { getPosts } = await import('@/lib/posts');
  const posts = await getPosts();
  const categories = [...new Set(posts.map(post => post.category).filter(Boolean))];
  
  return categories.map(category => ({
    category: category,
  }));
}

export const dynamicParams = false;
