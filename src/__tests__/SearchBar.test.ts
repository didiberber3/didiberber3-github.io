import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import SearchBar from '../components/SearchBar.vue'

describe('SearchBar', () => {
  it('renders with placeholder', () => {
    const wrapper = mount(SearchBar, {
      props: { placeholder: '搜索测试' },
    })
    expect(wrapper.find('input').attributes('placeholder')).toBe('搜索测试')
  })

  it('emits update:query on input', async () => {
    const wrapper = mount(SearchBar)
    const input = wrapper.find('input')
    await input.setValue('test')
    // Wait for 200ms debounce
    await new Promise((resolve) => setTimeout(resolve, 250))
    expect(wrapper.emitted('update:query')?.[0]).toEqual(['test'])
  })

  it('shows default placeholder when none provided', () => {
    const wrapper = mount(SearchBar)
    expect(wrapper.find('input').attributes('placeholder')).toBe('搜索...')
  })
})
