import { getPosts } from '@/lib/posts';
import { blogConfig } from '@/lib/config';
import Link from 'next/link';
import { format } from 'date-fns';



export default async function TagPage({ params }: { params: Promise<{ tag: string }> | { tag: string } }) {
  const resolvedParams = await Promise.resolve(params);
  const tag = decodeURIComponent(resolvedParams.tag);
  
  const posts = await getPosts();
  const taggedPosts = posts.filter(post => post.tags && post.tags.includes(tag));

  return (
    <main className="max-w-[60%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href="/archive" className="text-sm text-[var(--text-light)] dark:text-[var(--text-dark)] hover:underline opacity-60">
          ← 返回归档
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-8">
        标签: {tag}
      </h1>
      
      {taggedPosts.length === 0 ? (
        <p className="text-[var(--text-light)] dark:text-[var(--text-dark)] opacity-60">
          没有找到包含标签 "{tag}" 的文章
        </p>
      ) : (
        <ul className="space-y-4">
          {taggedPosts.map(p => (
            <li key={p.slug}>
              <Link href={`/posts/${encodeURIComponent(p.slug)}`} className="block hover:opacity-70 transition-opacity">
                <div className="flex justify-between items-center p-4 border-b border-[var(--line-light)] dark:border-[var(--line-dark)]">
                  <div className="flex-1">
                    <span className="text-lg font-semibold">{p.title}</span>
                    {(p.archive || p.category || p.tags) && (
                      <div className="flex gap-2 mt-1 flex-wrap">
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
                        {p.tags && p.tags.map((tag, index) => (
                          <span key={index} className="text-xs bg-[var(--line-light)] dark:bg-[var(--line-dark)] px-2 py-0.5">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-sm text-[var(--text-light)] dark:text-[var(--text-dark)] ml-4 opacity-60">
                    {format(new Date(p.date), blogConfig.posts.dateFormat)}
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

export async function generateStaticParams() {
  const posts = await getPosts();
  const tagSet = new Set<string>();
  
  posts.forEach(post => {
    if (post.tags) {
      post.tags.forEach(tag => tagSet.add(tag));
    }
  });
  
  return Array.from(tagSet).map(tag => ({
    tag: encodeURIComponent(tag)
  }));
}



export const dynamicParams = false;