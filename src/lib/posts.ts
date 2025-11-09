import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { bundleMDX } from 'mdx-bundler';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import type { Root } from 'mdast';

const postsDir = path.join(process.cwd(), 'posts');

export type Post = {
  slug: string;
  title: string;
  date: string;
  archive?: string;
  category?: string;
  tags?: string[];
};

function getAllMarkdownFiles(dir: string): string[] {
  let files: string[] = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files = files.concat(getAllMarkdownFiles(fullPath));
    } else if (item.isFile() && (item.name.endsWith('.md') || item.name.endsWith('.mdx'))) {
      files.push(fullPath);
    }
  }
  
  return files;
}

export async function getPosts(): Promise<Post[]> {
  if (!fs.existsSync(postsDir)) {
    return [];
  }
  
  const files = getAllMarkdownFiles(postsDir);
  
    return files.map(file => {
        const src = fs.readFileSync(file, 'utf8');
        const { data } = matter(src);
        const relativePath = path.relative(postsDir, file);
        const slug = relativePath.replace(/\.(md|mdx)$/, '');
        const folderName = path.dirname(relativePath);
        
        return {
            slug: slug.replace(/\\/g, '/'), // 统一使用正斜杠，避免路径分隔符问题
            title: data.title || path.basename(file, path.extname(file)),
            date: data.date || '1970-01-01',
            archive: data.archive || undefined,
            category: data.category || undefined, // 移除动态文件夹检测，只使用frontmatter
            tags: data.tags ? (Array.isArray(data.tags) ? data.tags : [data.tags]) : undefined,
        };
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPost(slug: string) {
  slug = decodeURIComponent(slug);
  
  // 搜索所有子目录中的文件
  const files = getAllMarkdownFiles(postsDir);
  const file = files.find(f => {
    const relativePath = path.relative(postsDir, f);
    const fileSlug = relativePath.replace(/\.(md|mdx)$/, '').replace(/\\/g, '/');
    return fileSlug === slug;
  });
  
  if (!file) {
    throw new Error(`Post not found: ${slug}`);
  }
  
  const src = fs.readFileSync(file, 'utf8');
  
  try {
    const { code, frontmatter } = await bundleMDX({ 
      source: src,
      mdxOptions(options) {
        options.remarkPlugins = [
          ...(options.remarkPlugins ?? []),
          remarkGfm,
          // Add a custom plugin to disable MDX expressions
          function remarkDisableExpressions() {
            return function(tree: Root) {
              // @ts-ignore - These types are from mdast-util-mdx which we don't want to add as a dependency
              const visit = (node: any) => {
                // Convert MDX expression nodes to text nodes
                if (node.type === 'mdxJsxTextElement' || node.type === 'mdxTextExpression') {
                  node.type = 'text';
                  node.value = node.value || `{${node.data?.raw || ''}}`;
                }
                // Recursively process all children
                if (Array.isArray(node.children)) {
                  node.children.forEach(visit);
                }
              };
              visit(tree);
            };
          }
        ];
        options.rehypePlugins = [
          ...(options.rehypePlugins ?? []),
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap' }],
        ];
        return options;
      },
      // Disable JS expression evaluation globally
      esbuildOptions: (options) => {
        options.target = 'esnext';
        return options;
      }
    });
    
    if (!code) {
      throw new Error(`Failed to generate code for ${slug}`);
    }
    
    return { code, frontmatter };
  } catch (error) {
    console.error(`Error bundling MDX for ${slug}:`, error);
    throw error;
  }
}
