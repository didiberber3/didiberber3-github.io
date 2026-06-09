import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import BackToTop from '../components/BackToTop.vue'

describe('BackToTop', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true })
    Object.defineProperty(window, 'scrollTo', { value: vi.fn(), writable: true, configurable: true })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders hidden when scrollY < 300', () => {
    window.scrollY = 0
    const wrapper = mount(BackToTop)
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('renders visible when scrollY > 300', async () => {
    window.scrollY = 301
    const wrapper = mount(BackToTop)
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('calls scrollTo on click', async () => {
    window.scrollY = 301
    const wrapper = mount(BackToTop)
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()
    await wrapper.find('button').trigger('click')
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })
})
