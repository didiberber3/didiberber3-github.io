
import { getPosts } from '@/lib/posts';
import { blogConfig } from '@/lib/config';
import SeriesTree from '@/components/SeriesTree';
import GridSeries from '@/components/GridSeries';
import TagCloud from '@/components/TagCloud';

// Static export configuration
export const dynamic = 'force-static';
import type { Post } from '@/lib/posts';

export default async function ArchivePage() {
  const posts = await getPosts();
  const categoryMap: Record<string, Post[]> = {};
  const yearMap: Record<string, Post[]> = {};
  const tagMap: Record<string, number> = {};

  posts.forEach(p => {
    if (p.category) {
      if (!categoryMap[p.category]) categoryMap[p.category] = [];
      categoryMap[p.category].push(p);
    }

    if (p.date) {
      const year = new Date(p.date).getFullYear().toString();
      if (!yearMap[year]) yearMap[year] = [];
      yearMap[year].push(p);
    }

    if (p.tags) {
      p.tags.forEach(tag => {
        tagMap[tag] = (tagMap[tag] || 0) + 1;
      });
    }
  });

  return (
    <main className="max-w-[60%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8 w-full">
        {blogConfig.pages.archive.title || (
          <svg className="w-10 h-10 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}

      </h1>
      {Object.keys(categoryMap).length === 0 && Object.keys(yearMap).length === 0 && Object.keys(tagMap).length === 0 ? (
        <p className="text-[var(--text-light)] dark:text-[var(--text-dark)] opacity-60">
          {blogConfig.pages.archive.description}
        </p>
      ) : (
        <>
          {Object.keys(categoryMap).length > 0 && (
            <div className="mb-12">
              <h1 className="text-2xl font-semibold mb-6">文章分类</h1>
              <GridSeries archive={categoryMap} />
            </div>
          )}
          {Object.keys(tagMap).length > 0 && (
            <div className="mb-12">
              <h1 className="text-2xl font-semibold mb-6">标签云</h1>
              <TagCloud tags={tagMap} />
            </div>
          )}
          {Object.keys(yearMap).length > 0 && (
            <div>
              <h1 className="text-2xl font-semibold mb-6">时间轴</h1>
              <SeriesTree archive={yearMap} />
            </div>
          )}
        </>
      )}
    </main>
  );
}
