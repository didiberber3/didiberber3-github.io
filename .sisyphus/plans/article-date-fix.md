# 文章排序修复计划

## TL;DR
> **Summary**: 给 `content/notes/` 下缺少 frontmatter `date` 的 .md 文件补上合理日期，确保按加入时间排序正常工作。
> **Deliverables**: 更新约 15 个 .md 文件的 frontmatter
> **Effort**: Quick
> **Critical Path**: 单一任务

## 问题分析
- `getNoteList()` 和 `getShareList()` 已按 `b.date.localeCompare(a.date)` 排序（最新在前）
- 现有约 15 个 Java 笔记文件缺少 frontmatter `date` 字段
- 代码的 fallback 使用文件 mtime，但从 git clone 后 mtime 不可靠
- Shares 全部是同一日期，但这是有意为之（一天内加的）

## 解决方案
按文件名中的日期信息 + 合理的推测给每个笔记添加 `date` 字段。

从文件名可以看出一些笔记有类似 `2026-5-11 常用类 6 220716.md` 的日期前缀，其他文件可以按其内容逻辑顺序（基础→高级）分配相邻日期。

## TODO

- [ ] 1. **为 content/notes/java/*.md 补充 date frontmatter**

  **What to do**:
  遍历 `content/notes/java/` 下所有 .md 文件，对每个缺少 `date:` frontmatter 的文件：

  （a）检查文件名是否包含日期前缀（如 `2026-5-11`），有则直接使用
  （b）如果没有，按内容逻辑顺序分配日期（从 2025-07-01 开始，每天一篇，按学习顺序）

  建议日期分配（按从基础到进阶的逻辑顺序）：
  | 文件 | 建议 date |
  |------|-----------|
  | 变量，数据类型与运算符.md | 2025-07-01 |
  | 控制结构.md | 2025-07-02 |
  | 类与对象.md | 2025-07-03 |
  | 包.md | 2025-07-04 |
  | 重载.md | 2025-07-05 |
  | 递归.md | 2025-07-06 |
  | 房屋出租系统.md | 2025-07-07 |
  | 异常.md | 2025-07-08 |
  | 枚举类.md | 2025-07-09 |
  | 类变量.md | 2025-07-10 |
  | 集合.md | 2025-07-14 |
  | 泛型.md | 2025-07-15 |
  | 多线程基础.md | 2025-07-16 |
  | 坦克大战.md | 2025-07-17 |
  | 坦克大战2.md | 2025-07-18 |
  | 2026-5-11 常用类 6 220716.md | 2026-05-11 (文件名已有) |
  | Java汇总.md (已有 date: 2025-08-29) | 不变 |
  | Test.md | 2026-05-15 |

  在文件第二行插入 `date: YYYY-MM-DD`，保留原有 frontmatter（如有 `title:` 则保留）。

  **Recommended Agent Profile**:
  - Category: `quick` - Reason: 批量文件编辑，模式化操作

  **Acceptance Criteria**:
  - [ ] 所有 content/notes/java/*.md 文件都有 `date:` frontmatter
  - [ ] `npm run build` 通过
  - [ ] Notes 页面按日期倒序显示

  **QA Scenarios**:
  ```
  Scenario: All files have date
    Tool: Bash
    Steps: 遍历 content/notes/java/*.md，grep ^date: 确认每个文件有此字段
    Expected: 每个文件至少匹配一行 ^date:
  ```
