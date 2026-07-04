# 新增代码高亮语言支持 (INI / GDScript / MySQL)

## TL;DR
> **Summary**: 在 `highlight.ts` 中注册 INI、GDScript (Godot)、SQL (MySQL) 三种新语言高亮
> **Deliverables**: 修改后的 `src/utils/highlight.ts`
> **Effort**: Quick
> **Parallel**: N/A (单文件)
> **Critical Path**: N/A

## Context
用户要求为博客代码块增加 INI、Godot (GDScript)、MySQL 三种语言的高亮支持。
`@exercism/highlightjs-gdscript` 包已安装。

## Work Objectives
### Deliverables
- [ ] `src/utils/highlight.ts` 新增 4 个 import + 5 个 registerLanguage 调用

### Definition of Done
- `vue-tsc --noEmit` 通过
- `vite build` 通过
- `src/utils/highlight.ts` 中新增了 ini / sql / gdscript 三种语言的注册

## TODOs

- [ ] 1. 修改 `src/utils/highlight.ts`

  **What to do**: 在现有 import 和注册代码之后，追加新语言的导入和注册。

  追加的 import：
  ```typescript
  import ini from 'highlight.js/lib/languages/ini'
  import sql from 'highlight.js/lib/languages/sql'
  import gdscript from '@exercism/highlightjs-gdscript'
  ```

  追加的注册：
  ```typescript
  hljs.registerLanguage('ini', ini)
  hljs.registerLanguage('sql', sql)
  hljs.registerLanguage('mysql', sql)
  hljs.registerLanguage('gdscript', gdscript)
  hljs.registerLanguage('godot', gdscript)
  ```

  **Must NOT do**: 不要改动已有的 import 或注册行，不要改动 highlight.css 主题

  **Files**: `src/utils/highlight.ts`

  **Verification**:
  - [ ] `vue-tsc --noEmit` 无错误
  - [ ] `vite build` 无错误
  - [ ] 编译产物中应包含 ini/sql/gdscript 的 chunk

  **Commit**: YES | `feat(highlight): add ini, mysql, gdscript language support`
