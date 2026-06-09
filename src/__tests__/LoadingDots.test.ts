import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import LoadingDots from '../components/LoadingDots.vue'

describe('LoadingDots', () => {
  it('renders without text prop', () => {
    const wrapper = mount(LoadingDots)
    expect(wrapper.find('[role="status"]').exists()).toBe(true)
    expect(wrapper.find('.loading-text').exists()).toBe(false)
  })

  it('renders text when prop provided', () => {
    const wrapper = mount(LoadingDots, {
      props: { text: '加载中' },
    })
    expect(wrapper.find('.loading-text').text()).toBe('加载中')
  })
})
