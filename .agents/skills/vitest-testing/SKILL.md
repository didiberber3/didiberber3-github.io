---
name: vitest-testing
description: Vitest testing patterns for Vue 3 components in the 记录与分享 blog. Covers @vue/test-utils usage, component rendering tests, and event emission verification.
---

# Vitest 测试策略

## 测试配置

测试配置文件 `vitest.config.ts` 使用 `jsdom` 环境 + `@vue/test-utils`。

## 模板：组件测试

测试文件放在 `src/__tests__/` 目录下，命名 `ComponentName.test.ts`：

```typescript
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import SearchBar from '../components/SearchBar.vue'

describe('SearchBar', () => {
  it('renders with placeholder', () => {
    const wrapper = mount(SearchBar, {
      props: { placeholder: '搜索测试' }
    })
    expect(wrapper.find('input').attributes('placeholder')).toBe('搜索测试')
  })

  it('emits update:query on input', async () => {
    const wrapper = mount(SearchBar)
    const input = wrapper.find('input')
    await input.setValue('test')
    expect(wrapper.emitted('update:query')?.[0]).toEqual(['test'])
  })
})
```

## 关键模式

### Props 渲染验证
```typescript
const wrapper = mount(Component, { props: { title: 'Hello' } })
expect(wrapper.text()).toContain('Hello')
```

### 事件测试
```typescript
await wrapper.find('button').trigger('click')
expect(wrapper.emitted('event-name')).toBeTruthy()
expect(wrapper.emitted('event-name')?.[0]).toEqual([expectedPayload])
```

### 条件渲染测试
```typescript
expect(wrapper.find('.loading').exists()).toBe(true)
```

## DO NOT
- 不要测第三方库（vue-router、marked、hljs）
- 不要写端到端测试（那是 Playwright 的事）
- 不要 mock 整个 Vue 组件 — 用真实 mount
- 不要测样式细节（颜色、间距）
