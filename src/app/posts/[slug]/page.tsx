import { getPosts, getPost } from '@/lib/posts';
import TOC from '@/components/TOC';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import MDXContent from './MDXContent';
import { blogConfig } from '@/lib/config';
import 'prismjs/themes/prism-tomorrow.css'; // 添加语法高亮主题

// Allow dynamic params for new posts in development



export async function generateStaticParams() {
  try {
    const posts = await getPosts();
    return posts.map(p => ({ slug: p.slug }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}





export default async function Post({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  // Handle both Promise and direct params (Next.js 15+ compatibility)
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams.slug;

  let post;
  try {
    post = await getPost(slug);
  } catch (error) {
    console.error('Error loading post:', error);
    notFound();
  }

  if (!post || !post.code) {
    console.error('Post data is invalid:', post);
    notFound();
  }

  const { code, frontmatter } = post;

  return (
    <main className="min-h-[80vh]">
      <div className="w-full">
        {/* 第一层：divinfo包含info div - 在最上面 */}
        <div className="divinfo pl-[30px] pr-6">
          <div className="info mb-8 pl-[30px] pr-6 pt-[200px] pb-[150px]">
            <div className="mb-6">
              <Link href="/" className="text-sm text-[var(--text-light)] dark:text-[var(--text-dark)] hover:underline opacity-60">
                {blogConfig.navigationText.backToHome}
              </Link>
            </div>
            <h1 className="text-4xl font-bold mb-4">{frontmatter?.title || 'Untitled'}</h1>
            {frontmatter?.date && (
              <p className="text-sm text-[var(--text-light)] dark:text-[var(--text-dark)] mb-6 opacity-60">
                {new Date(frontmatter.date).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            )}
            {(frontmatter?.archive || frontmatter?.category || frontmatter?.tags) && (
              <div className="flex gap-2 mb-6 flex-wrap">
                {frontmatter.archive && (
                  <Link
                    href={`/archive/${encodeURIComponent(frontmatter.archive)}`}
                    className="text-xs bg-[var(--line-light)] dark:bg-[var(--line-dark)] px-2 py-1 hover:opacity-70"
                  >
                    {frontmatter.archive}
                  </Link>
                )}
                {frontmatter.category && (
                  <Link
                    href={`/category/${encodeURIComponent(frontmatter.category)}`}
                    className="text-sm bg-[var(--category-bg)] text-[var(--category-text)] px-3 py-1 rounded-md border border-[var(--line-light)] dark:border-[var(--line-dark)] hover:opacity-80 transition-opacity"
                  >
                    {frontmatter.category}
                  </Link>
                )}
                {frontmatter.tags && (Array.isArray(frontmatter.tags) ? frontmatter.tags : [frontmatter.tags]).map((tag: string, index: number) => (
                  <Link
                    key={index}
                    href={`/tag/${encodeURIComponent(tag)}`}
                    className="text-xs bg-[var(--tag-bg)] text-[var(--tag-text)] px-2 py-1 rounded-sm border border-[var(--line-light)] dark:border-[var(--line-dark)] hover:opacity-80 transition-opacity inline-flex items-center"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 第二层：包含article和aside的div，70%和30%宽度 */}
        <div className="flex gap-8 pl-[30px] pr-6">
          {/* Article: 70%宽度，正常向下扩展 */}
          <article className="w-[85%] min-w-0">
            <div className="px-6 py-2 prose prose-sm dark:prose-invert max-w-none prose-headings:scroll-mt-20">
              {/* Constrain only the readable content, not the headings */}
              <div className="px-4 max-w-3xl">
                {code && (
                  <MDXContent
                    code={code}
                    frontmatter={{
                      title: frontmatter?.title || 'Untitled',
                      date: frontmatter?.date || '',
                      archive: frontmatter?.archive,
                      category: frontmatter?.category
                    }}
                  />
                )}
                {!code && (
                  <div className="text-red-500">
                    Error: No content code generated
                  </div>
                )}
              </div>
            </div>
          </article>

          {/* Aside: 20%宽度，TOC悬浮跟随 */}
          <aside className="w-[20%] min-w-0">
            <div className="sticky top-6">
              <TOC />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export const dynamicParams = false;