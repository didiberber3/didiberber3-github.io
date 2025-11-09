import { getPosts, getPost } from '@/lib/posts';
import TOC from '@/components/TOC';
import MetaTags from '@/components/MetaTags';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import MDXContent from './MDXContent';
import { blogConfig } from '@/lib/config';
import 'prismjs/themes/prism-tomorrow.css'; // 添加语法高亮主题

// 生成静态参数
export async function generateStaticParams() {
  try {
    const posts = await getPosts();
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params for posts:', error);
    return [];
  }
}

export default async function Post({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  // Handle both Promise and direct params (Next.js 15+ compatibility)
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams.slug;
  
  console.log('Post page slug:', slug);
  console.log('Post page decoded slug:', decodeURIComponent(slug));

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
          <div className="info mb-8 pl-0 pr-6 pt-[200px] pb-[150px]">
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
            <MetaTags 
              post={{
                ...frontmatter,
                slug: slug,
                date: frontmatter?.date || ''
              } as any} 
            />
          </div>
        </div>

        {/* 第二层：包含article和aside的div，70%和30%宽度 */}
        <div className="flex gap-8 pl-[30px] pr-6">
          {/* Article: 75%宽度，正常向下扩展 */}
          <article className="w-[75%] min-w-0">
            <div className="px-6 py-2 prose prose-sm dark:prose-invert max-w-none prose-headings:scroll-mt-20">
              {/* Constrain only the readable content, not the headings */}
              <div className="pl-16 pr-8 max-w-2xl">
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

          {/* Aside: 25%宽度，TOC悬浮跟随 */}
          <aside className="w-[25%] min-w-0">
            <div className="sticky top-6">
              <TOC />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
