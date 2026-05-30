# 文章 Frontmatter 增强 + 排序修复

## TL;DR
> **Summary**: 类型层更新 + 18 篇笔记补充 frontmatter(date/tags/description) + 列表展示 tags
> **Deliverables**: 3 个代码文件 · 18 个 .md 文件 · 2 个页面模板
> **Effort**: Medium
> **Parallel**: YES - 3 waves

## 1. 类型层更新

### 1.1 `src/vite-env.d.ts`
`NoteEntry` 加两个字段：
```typescript
export interface NoteEntry {
  date: string
  title: string
  tags: string[]
  description: string
}
```

### 1.2 `vite.config.ts` (contentIndexPlugin)
在 `parseFrontmatter` 调用后添加 tags/description 解析：
```javascript
noteMeta[slug] = {
  date: fm.date || fallbackDate,
  title: fm.title || fallbackTitle,
  tags: Array.isArray(fm.tags) ? fm.tags : (typeof fm.tags === 'string' ? fm.tags.split(',').map(t => t.trim()) : []),
  description: fm.description || '',
}
```
ShareMeta 也加 `tags` 字段（可选，不需要 description）。

### 1.3 `src/utils/content.ts`
`NoteMeta` 和 `Note` 接口加 `tags: string[]` 和 `description: string`：
```typescript
export interface NoteMeta {
  slug: string
  title: string
  date: string
  category: string
  tags: string[]
  description: string
}
```

## 2. 笔记 Frontmatter（全部 18 个文件）

### 顺序：从基础到进阶，最后到 2026-05-30

| # | 文件 | date | tags | description |
|---|------|------|------|-------------|
| 1 | 变量，数据类型与运算符.md | 2025-07-01 | [Java基础, 变量, 运算符] | Java基本类型、变量声明、运算符优先级与进制转换 |
| 2 | 控制结构.md | 2025-07-02 | [Java基础, 控制流] | 分支控制if/switch、循环for/while、跳转break/continue/return |
| 3 | 类与对象.md | 2025-07-03 | [Java核心, 面向对象] | 类与对象、成员方法、构造器、this关键字、JVM内存分析 |
| 4 | 包.md | 2025-07-04 | [Java核心, 包管理] | package与import、访问修饰符、封装、继承、super关键字 |
| 5 | 重载.md | 2025-07-05 | [Java核心, 方法] | 方法重载OverLoad、可变参数、作用域 |
| 6 | 递归.md | 2025-07-06 | [Java核心, 递归] | 递归调用：阶乘、斐波那契、猴子吃桃、老鼠走迷宫 |
| 7 | 房屋出租系统.md | 2025-07-10 | [Java项目, 综合练习] | 房屋出租管理系统——综合运用类和对象的小项目 |
| 8 | 异常.md | 2025-07-11 | [Java核心, 异常处理] | 异常体系、try-catch-finally、自定义异常 |
| 9 | 枚举类.md | 2025-07-12 | [Java核心, 枚举] | enum枚举类型、注解Annotation的基本使用 |
| 10 | 类变量.md | 2025-07-13 | [Java核心, 静态] | 类变量static、类方法、代码块、单例设计模式 |
| 11 | 集合.md | 2025-07-16 | [Java集合, 数据结构] | ArrayList/LinkedList/HashSet/TreeSet/Map 集合框架详解 |
| 12 | 泛型.md | 2025-07-17 | [Java核心, 泛型] | 泛型类、泛型方法、通配符、类型擦除 |
| 13 | Java汇总.md | 2025-08-29 | [Java汇总] | Java 核心知识全汇总——变量到多态的完整知识图谱 |
| 14 | 2026-5-11 常用类 6 220716.md | 2026-05-11 | [Java核心, 常用类] | 包装类、String/StringBuilder、Math、Arrays、Date、System |
| 15 | 坦克大战.md | 2026-05-20 | [Java项目, 游戏] | 坦克大战游戏——事件监听、绘图、线程的入门实战 |
| 16 | 多线程基础.md | 2026-05-25 | [Java核心, 多线程] | 线程创建、线程状态、同步锁、线程通信 |
| 17 | 坦克大战2.md | 2026-05-30 | [Java项目, 游戏, 多线程] | 坦克大战升级版——多线程协调、碰撞检测、IO存档 |
| 18 | Test.md | 2026-05-31 | [测试] | 练习与测试文件 |

### 每个文件 frontmatter 模版
```yaml
---
title: 变量，数据类型与运算符
date: 2025-07-01
tags: [Java基础, 变量, 运算符]
description: Java基本类型、变量声明、运算符优先级与进制转换
---
```
保留文件中原有内容。如果已有 frontmatter（Java汇总.md），合并 date/tags/description 进去。

## 3. 展示层更新

### 3.1 `src/pages/Notes.vue`
列表卡片加 `<p class="text-xs txt-secondary mt-1">{{ note.description }}</p>` 和 tags 标签：
```html
<div v-if="note.tags?.length" class="flex gap-1 mt-1">
  <span v-for="tag in note.tags" class="tag text-xs">{{ tag }}</span>
</div>
```
注：`.tag` 样式在 style.css 中已有（Shares 页面在用）。

### 3.2 `src/pages/Home.vue`
首页最近笔记同样加 description 和 tags。

### 3.3 `src/pages/ArticleView.vue`
文章标题下方加 tags 行：
```html
<div v-if="note.tags?.length" class="flex gap-2 mb-4">
  <span v-for="tag in note.tags" class="tag">{{ tag }}</span>
</div>
```
放在 date 下面。

## 执行顺序
- Wave 1: 3 个代码文件（vite-env.d.ts → content.ts → vite.config.ts）
- Wave 2: 18 个 .md 的 frontmatter（可并行批量处理）
- Wave 3: 3 个页面模板（Notes.vue → Home.vue → ArticleView.vue）

## 验证
- `npm run build` 通过
- Notes 页面按日期从新到旧排列
- 每张卡片显示标题 + 日期 + description + tags 标签
- 文章详情页标题下方显示 tags
