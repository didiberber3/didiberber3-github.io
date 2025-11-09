import { getPosts } from '@/lib/posts';
import Link from 'next/link';
import { blogConfig } from '@/lib/config';

export const dynamic = 'force-static';
import type { Post } from '@/lib/posts';

export default async function CategoryPage() {
  const posts = await getPosts();
  const map: Record<string, Post[]> = {};

  posts.forEach(p => {
    if (p.category) {
      if (!map[p.category]) map[p.category] = [];
      map[p.category].push(p);
    }
  });

  const categoryEntries = Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <main className="max-w-[60%] mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 w-full">{blogConfig.pages.category.title}</h1>
      {categoryEntries.length === 0 ? (
        <p className="text-[var(--text-light)] dark:text-[var(--text-dark)] opacity-60">
          {blogConfig.pages.category.description}
        </p>
      ) : (
        categoryEntries.map(([category, list]) => (
          <section key={category} id={category} className="mb-8 scroll-mt-20">
            <h2 className="text-2xl font-semibold mb-4">{category}</h2>
            <ul className="list-disc pl-6 space-y-2">
              {list.map(p => (
                <li key={p.slug}>
                  <Link
                    href={`/posts/${encodeURIComponent(p.slug)}`}
                    className="hover:underline"
                  >
                    {p.title}
                  </Link>
                  <span className="text-sm text-[var(--text-light)] dark:text-[var(--text-dark)] ml-2 opacity-60">
                    ({new Date(p.date).toLocaleDateString()})
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </main>
  );
}
