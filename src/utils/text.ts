/**
 * 文本处理共享模块
 *
 * 统一 rssPlugin / markdown 的 Markdown 文本清洗逻辑，
 * 消除两份重复代码。
 */

/** 去除 Markdown 标记符号，保留纯文本（不含空白折叠） */
export function stripMarkdown(text: string): string {
  return text
    .replace(/^---[\s\S]*?---\r?\n?/m, '')  // remove frontmatter
    .replace(/```[\s\S]*?```/g, '')         // code fences
    .replace(/`[^`]+`/g, '')                // inline code
    .replace(/!\[.*?\]\(.*?\)/g, '')        // images
    .replace(/\[([^\]]*)\]\(.*?\)/g, '$1')  // links → text
    .replace(/[#*_~>|]/g, '')               // markdown markers
    .replace(/---|\+|==/g, '')              // horizontal rules
}
