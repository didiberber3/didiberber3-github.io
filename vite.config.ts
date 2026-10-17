import { defineConfig, type Plugin, type Connect } from 'vite'
import vue from '@vitejs/plugin-vue'
import { copyFileSync, cpSync, existsSync, readFileSync, statSync } from 'fs'
import { join, relative, resolve } from 'path'
import { contentIndexPlugin } from './src/utils/contentIndexPlugin'
import { rssPlugin } from './src/utils/rssPlugin'

/**
 * 文章正文静态中间件
 *
 * 把 /notes/:category/:slug.md 映射到 content/notes 下的原 .md 文件：
 * - dev / preview：HTTP 中间件直接读文件
 * - build：拷贝 content/notes 到 dist/notes（与 public 合并），随站点一起发布
 *
 * 作用：正文不再打包成 JS chunk，改为点击文章时 fetch 原样 .md 文件。
 */
function notesStaticPlugin(): Plugin {
  const contentDir = resolve(process.cwd(), 'content/notes')
  // 真实站点 base（/didiberber3-github.io/），由 configResolved 解析
  let base = '/'

  function matchNote(pathname: string): string | null {
    // /notes/<category>/<slug>.md
    const m = pathname.match(/^\/notes\/([^/]+)\/(.+)\.md$/)
    if (!m) return null
    const category = decodeURIComponent(m[1])
    const slug = decodeURIComponent(m[2])
    return join(contentDir, category, `${slug}.md`)
  }

  function serve(req: Connect.IncomingMessage, res: Connect.ServerResponse): boolean {
    const url = new URL(req.url || '/', 'http://localhost')
    // 剥掉站点 base 前缀后再匹配
    const stripped = url.pathname.startsWith(base)
      ? url.pathname.slice(base.length - 1)
      : url.pathname
    const file = matchNote(stripped)
    if (file && existsSync(file) && statSync(file).isFile()) {
      res.setHeader('Content-Type', 'text/markdown; charset=utf-8')
      res.end(readFileSync(file))
      return true
    }
    return false
  }

  return {
    name: 'notes-static',
    configResolved(config) {
      base = config.base || '/'
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!serve(req, res)) next()
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!serve(req, res)) next()
      })
    },
    closeBundle() {
      // 构建时把正文复制到 dist/notes（只复制分类子目录，跳过 .obsidian/.trash 和根目录日记）
      const out = resolve(process.cwd(), 'dist/notes')
      if (existsSync(contentDir)) {
        cpSync(contentDir, out, {
          recursive: true,
          force: true,
          filter: (src) => {
            const rel = relative(contentDir, src).replace(/\\/g, '/')
            if (!rel) return true
            const parts = rel.split('/')
            if (parts[0].startsWith('.')) return false
            // 根级文件（如 Obsidian 日记 2025-08-30.md）不发布
            if (parts.length === 1) return statSync(src).isDirectory()
            return true
          },
        })
        console.log('[notes-static] Copied content/notes → dist/notes')
      }
    },
  }
}

/**
 * GitHub Pages SPA 回退：把 index.html 复制为 404.html。
 * history 路由的深链接会由 Pages 返回 404.html，再由前端路由接管。
 * 放在构建阶段生成，保证手工上传 dist 时也有回退文件。
 */
function ghPages404Plugin(): Plugin {
  return {
    name: 'gh-pages-404',
    closeBundle() {
      const dist = resolve(process.cwd(), 'dist')
      const index = resolve(dist, 'index.html')
      if (!existsSync(index)) return
      copyFileSync(index, resolve(dist, '404.html'))
      console.log('[gh-pages-404] Generated dist/404.html')
    },
  }
}

export default defineConfig({
  plugins: [vue(), contentIndexPlugin(), rssPlugin(), notesStaticPlugin(), ghPages404Plugin()],
  base: '/didiberber3-github.io/',
  build: {
    outDir: 'dist',
  },
  server: {
    // 编辑器/工具写入目录时产生的临时文件会让 fs.watch 报 EBUSY 并打挂 dev server
    watch: {
      ignored: ['**/.ui-review/**', '**/.*.tmpdir/**', '**/*.tmp'],
    },
  },
})
