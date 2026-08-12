import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import { cpSync, existsSync, readFileSync, statSync } from 'fs'
import { join, resolve } from 'path'
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
  const base = process.env.BASE_URL || '/'

  function matchNote(pathname: string): string | null {
    // /notes/<category>/<slug>.md
    const m = pathname.match(/^\/notes\/([^/]+)\/(.+)\.md$/)
    if (!m) return null
    const category = decodeURIComponent(m[1])
    const slug = decodeURIComponent(m[2])
    return join(contentDir, category, `${slug}.md`)
  }

  return {
    name: 'notes-static',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = new URL(req.url || '/', 'http://localhost')
        const file = matchNote(url.pathname.replace(base, '/'))
        if (file && existsSync(file) && statSync(file).isFile()) {
          res.setHeader('Content-Type', 'text/markdown; charset=utf-8')
          res.end(readFileSync(file))
          return
        }
        next()
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = new URL(req.url || '/', 'http://localhost')
        const file = matchNote(url.pathname.replace(base, '/'))
        if (file && existsSync(file) && statSync(file).isFile()) {
          res.setHeader('Content-Type', 'text/markdown; charset=utf-8')
          res.end(readFileSync(file))
          return
        }
        next()
      })
    },
    closeBundle() {
      // 构建时把正文复制到 dist/notes
      const out = resolve(process.cwd(), 'dist/notes')
      if (existsSync(contentDir)) {
        cpSync(contentDir, out, { recursive: true, force: true })
        console.log('[notes-static] Copied content/notes → dist/notes')
      }
    },
  }
}

export default defineConfig({
  plugins: [vue(), contentIndexPlugin(), rssPlugin(), notesStaticPlugin()],
  base: '/didiberber3-github.io/',
  build: {
    outDir: 'dist',
  },
})
