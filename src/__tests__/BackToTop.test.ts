import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import BackToTop from '../components/BackToTop.vue'

type ObserverCallback = (
  entries: Array<Pick<IntersectionObserverEntry, 'isIntersecting'>>,
  observer: IntersectionObserver,
) => void

let callback: ObserverCallback | null = null
const observers: MockIntersectionObserver[] = []
const mounted: Array<{ unmount: () => void }> = []

/**
 * IntersectionObserver mock：只保留组件实际用到的接口，
 * 测试里通过 notifyIntersecting 手动模拟哨兵进入/离开视口。
 */
class MockIntersectionObserver {
  readonly root: Element | Document | null = null
  readonly rootMargin = '0px'
  readonly thresholds: readonly number[] = [0]
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
  takeRecords = vi.fn(() => [] as IntersectionObserverEntry[])

  constructor(observerCallback: ObserverCallback) {
    callback = observerCallback
    observers.push(this)
  }
}

function mountBackToTop() {
  // 组件有 Teleport 根节点，直接查询 document 比 wrapper.find 更可靠
  const wrapper = mount(BackToTop, { attachTo: document.body })
  mounted.push(wrapper)
  return wrapper
}

function queryBackToTop(): HTMLButtonElement | null {
  return document.querySelector<HTMLButtonElement>('button[aria-label^="回到顶部"]')
}

function notifyIntersecting(isIntersecting: boolean) {
  callback?.([{ isIntersecting }], {} as IntersectionObserver)
}

/** 等待 Transition 的离场帧（无 CSS 过渡时也会在下一帧移除节点） */
function waitForTransition(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 80))
}

function stubReducedMotion(reduced: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: reduced && query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

describe('BackToTop', () => {
  beforeEach(() => {
    callback = null
    observers.length = 0
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
    stubReducedMotion(false)
    Object.defineProperty(window, 'scrollTo', {
      value: vi.fn(),
      writable: true,
      configurable: true,
    })
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true })
    Object.defineProperty(window, 'innerHeight', {
      value: 1000,
      writable: true,
      configurable: true,
    })
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 0,
      writable: true,
      configurable: true,
    })
  })

  afterEach(() => {
    while (mounted.length) mounted.pop()?.unmount()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('starts hidden and observes the top sentinel', () => {
    mountBackToTop()

    expect(queryBackToTop()).toBeNull()
    expect(observers).toHaveLength(1)
    expect(observers[0].observe).toHaveBeenCalledTimes(1)

    const [target] = observers[0].observe.mock.calls[0]
    expect(target).toBe(document.querySelector('.btt-sentinel'))
  })

  it('shows the button once the sentinel leaves the viewport', async () => {
    mountBackToTop()

    notifyIntersecting(false)
    await nextTick()

    const button = queryBackToTop()
    expect(button).not.toBeNull()
    expect(button?.classList.contains('interact-btn-icon')).toBe(true)
  })

  it('hides the button again when the sentinel re-enters the viewport', async () => {
    mountBackToTop()

    notifyIntersecting(false)
    await nextTick()
    expect(queryBackToTop()).not.toBeNull()

    notifyIntersecting(true)
    await nextTick()
    await waitForTransition()
    expect(queryBackToTop()).toBeNull()
  })

  it('scrolls to top smoothly when motion is allowed', async () => {
    mountBackToTop()

    notifyIntersecting(false)
    await nextTick()
    queryBackToTop()?.click()

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })

  it('uses instant scrolling when reduced motion is preferred', async () => {
    stubReducedMotion(true)
    mountBackToTop()

    notifyIntersecting(false)
    await nextTick()
    queryBackToTop()?.click()

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'auto' })
  })

  it('shows real-time reading progress and a progress bar', async () => {
    window.scrollY = 600
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 2000,
      writable: true,
      configurable: true,
    })
    mountBackToTop()

    notifyIntersecting(false)
    await nextTick()

    const value = document.querySelector('.btt-value')
    expect(value?.textContent?.replace(/\s/g, '')).toBe('60%')

    const bar = document.querySelector<HTMLElement>('.btt-bar')
    expect(bar?.style.transform).toContain('0.6')
  })

  it('disconnects observer and removes progress listeners on unmount', () => {
    const addEventListener = vi.spyOn(window, 'addEventListener')
    const removeEventListener = vi.spyOn(window, 'removeEventListener')
    const wrapper = mountBackToTop()
    const observer = observers[0]

    const scrollAdded = addEventListener.mock.calls.filter(([type]) => type === 'scroll')
    expect(scrollAdded).toHaveLength(1)

    wrapper.unmount()
    mounted.pop()

    expect(observer.disconnect).toHaveBeenCalledTimes(1)
    const scrollRemoved = removeEventListener.mock.calls.filter(([type]) => type === 'scroll')
    expect(scrollRemoved).toHaveLength(1)
  })
})
