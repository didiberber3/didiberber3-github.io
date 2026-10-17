import { describe, expect, it, afterEach } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { usePageTitle } from '../utils/usePageTitle'

afterEach(() => {
  document.title = ''
})

describe('usePageTitle', () => {
  it('sets the browser tab title', () => {
    const Page = defineComponent({
      setup() {
        usePageTitle('归档')
        return () => null
      },
    })
    mount(Page)
    expect(document.title).toBe('小窝 · 归档')
  })

  it('updates when the getter changes', async () => {
    const title = ref('分类')
    const Page = defineComponent({
      setup() {
        usePageTitle(() => title.value)
        return () => null
      },
    })
    mount(Page)
    expect(document.title).toBe('小窝 · 分类')

    title.value = 'Java'
    await nextTick()
    expect(document.title).toBe('小窝 · Java')
  })

  it('falls back to the site name for an empty title', () => {
    const Page = defineComponent({
      setup() {
        usePageTitle('')
        return () => null
      },
    })
    mount(Page)
    expect(document.title).toBe('小窝')
  })
})
