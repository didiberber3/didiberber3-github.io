<template>
  <div class="page-shell">
    <main class="page-content">
      <div class="about-page" ref="pageRef">

        <!-- ═══ HERO ═══ -->
        <section class="hero" ref="heroRef">
          <!-- Decorative shapes -->
          <div class="hero-shapes" ref="shapesRef" @mousemove="onMouseMove">
            <div
              v-for="s in decorations"
              :key="s.id"
              class="deco-shape"
              :class="[s.type, `pos-${s.pos}`]"
              :style="{ '--dx': '0px', '--dy': '0px' }"
              :data-depth="s.depth"
            >
              <!-- circle -->
              <svg v-if="s.type === 'circle'" :width="s.size" :height="s.size" viewBox="0 0 100 100">
                <circle cx="50" cy="50" :r="s.r" fill="none" stroke="var(--accent)" :stroke-width="s.sw" :opacity="s.opacity" />
              </svg>
              <!-- cross -->
              <svg v-else-if="s.type === 'cross'" :width="s.size" :height="s.size" viewBox="0 0 100 100">
                <line x1="30" y1="30" x2="70" y2="70" stroke="var(--accent)" :stroke-width="s.sw" :opacity="s.opacity" />
                <line x1="70" y1="30" x2="30" y2="70" stroke="var(--accent)" :stroke-width="s.sw" :opacity="s.opacity" />
              </svg>
              <!-- dot-grid -->
              <svg v-else-if="s.type === 'dot-grid'" :width="s.size" :height="s.size" viewBox="0 0 100 100">
                <circle v-for="n in 16" :key="n" :cx="(n % 4) * 33 + 16" :cy="Math.floor(n / 4) * 33 + 16" r="2.5" fill="var(--accent)" :opacity="s.opacity * 0.6" />
              </svg>
              <!-- diamond -->
              <svg v-else-if="s.type === 'diamond'" :width="s.size" :height="s.size" viewBox="0 0 100 100">
                <polygon points="50,10 90,50 50,90 10,50" fill="none" stroke="var(--accent)" :stroke-width="s.sw" :opacity="s.opacity" />
              </svg>
            </div>
          </div>

          <!-- Hero text -->
          <div class="hero-content">
            <h1 class="hero-title" ref="titleRef">关于</h1>
            <p class="hero-sub" ref="subRef">
              记录与分享 —— 技术笔记、项目经验、学习思考
            </p>
            <div class="hero-indicator" ref="indicatorRef">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 7L10 14L17 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </div>
          </div>
        </section>

        <!-- ═══ BIO ═══ -->
        <section class="section bio-section" ref="bioRef">
          <div class="section-content">
            <div class="bio-text">
              <p>这是一个基于 <strong>Vue 3 + Vite + TypeScript</strong> 构建的个人博客站点。</p>
              <p>用于记录学习笔记、分享技术文章和项目经验。</p>
            </div>
            <div class="bio-marquee" aria-hidden="true">
              <span v-for="n in 6" :key="n" class="marquee-item">{{ marqueeLine }}</span>
            </div>
          </div>
        </section>

        <!-- ═══ DIVIDER ═══ -->
        <div class="section-divider" ref="dividerRef">
          <svg width="60" height="12" viewBox="0 0 60 12" fill="none">
            <circle cx="6" cy="6" r="3" fill="var(--accent)" opacity="0.5" />
            <circle cx="30" cy="6" r="3" fill="var(--accent)" opacity="0.5" />
            <circle cx="54" cy="6" r="3" fill="var(--accent)" opacity="0.5" />
          </svg>
        </div>

        <!-- ═══ TECH STACK ═══ -->
        <section class="section tech-section" ref="techRef">
          <div class="section-header">
            <h2 class="section-title">技术栈</h2>
            <p class="section-desc">构建这个站点所使用的技术</p>
          </div>
          <div class="card-grid cols-3">
            <div
              v-for="tech in techStack"
              :key="tech.label"
              class="card tech-card"
              :style="{ '--i': techStack.indexOf(tech) }"
              @mousemove="onCardMove($event, techStack.indexOf(tech))"
              @mouseleave="onCardLeave(techStack.indexOf(tech))"
            >
              <div class="card-icon" v-html="tech.icon"></div>
              <span class="card-label">{{ tech.label }}</span>
              <div class="card-glow" :class="{ active: hoveredCard === techStack.indexOf(tech) }"></div>
            </div>
          </div>
        </section>

        <!-- ═══ DIVIDER ═══ -->
        <div class="section-divider" ref="dividerRef2">
          <svg width="60" height="12" viewBox="0 0 60 12" fill="none">
            <circle cx="6" cy="6" r="3" fill="var(--accent)" opacity="0.5" />
            <circle cx="30" cy="6" r="3" fill="var(--accent)" opacity="0.5" />
            <circle cx="54" cy="6" r="3" fill="var(--accent)" opacity="0.5" />
          </svg>
        </div>

        <!-- ═══ FEATURES ═══ -->
        <section class="section features-section" ref="featuresRef">
          <div class="section-header">
            <h2 class="section-title">功能特性</h2>
            <p class="section-desc">站点提供的能力</p>
          </div>
          <div class="card-grid cols-3">
            <div
              v-for="feat in features"
              :key="feat.label"
              class="card feat-card"
              :style="{ '--i': features.indexOf(feat) }"
            >
              <div class="card-icon" v-html="feat.icon"></div>
              <span class="card-label">{{ feat.label }}</span>
            </div>
          </div>
        </section>

        <!-- ═══ DECORATIVE FOOTER ═══ -->
        <section class="section end-section" ref="endRef">
          <div class="end-visual">
            <svg width="120" height="24" viewBox="0 0 120 24" fill="none">
              <path d="M2 12H118" stroke="var(--border-primary)" stroke-width="1" stroke-dasharray="4 4" opacity="0.5" />
              <circle cx="60" cy="12" r="4" fill="var(--accent)" />
              <path d="M0 12L8 8V16L0 12Z" fill="var(--accent)" opacity="0.6" />
              <path d="M120 12L112 8V16L120 12Z" fill="var(--accent)" opacity="0.6" />
            </svg>
          </div>
          <p class="end-text">{{ marqueeLine }}</p>
        </section>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive } from 'vue'

/* ── data ── */
const marqueeLine = 'BUILT WITH VUE 3 · VITE · TYPESCRIPT · HIGHLIGHT.JS · TAILWIND'

const decorations = reactive([
  { id: 1, type: 'circle',   size: 160, r: 40,  sw: 1, opacity: 0.25, pos: 'tl', depth: 0.6 },
  { id: 2, type: 'cross',    size: 80,           sw: 1.5, opacity: 0.2,  pos: 'tr', depth: 0.4 },
  { id: 3, type: 'dot-grid', size: 120,          sw: 0,  opacity: 0.25, pos: 'bl', depth: 0.3 },
  { id: 4, type: 'diamond',  size: 100,          sw: 1,  opacity: 0.18, pos: 'br', depth: 0.5 },
  { id: 5, type: 'circle',   size: 70,  r: 28,   sw: 1,  opacity: 0.2,  pos: 'tm', depth: 0.35 },
  { id: 6, type: 'cross',    size: 50,           sw: 1,  opacity: 0.3,  pos: 'bm', depth: 0.45 },
])

const techStack = [
  { label: 'Vue 3',       icon: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 2L2 21H8L12 13L16 21H22L12 2Z" fill="currentColor"/></svg>' },
  { label: 'Vite',        icon: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' },
  { label: 'TypeScript',  icon: '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="1" stroke="currentColor" stroke-width="2"/><path d="M9 12h6M12 9v6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' },
  { label: 'Tailwind',    icon: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 3C8 3 6 6 6 9C6 12 8 13 10 14C6 14 4 16 4 19C4 21 6 22 12 22C18 22 20 21 20 19C20 16 18 14 14 14C16 13 18 12 18 9C18 6 16 3 12 3Z" stroke="currentColor" stroke-width="2"/></svg>' },
  { label: 'highlight.js', icon: '<svg viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="1" stroke="currentColor" stroke-width="2"/><path d="M8 10l3 3-3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M16 10l-3 3 3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' },
  { label: 'Markdown',    icon: '<svg viewBox="0 0 24 24" fill="none"><path d="M3 5h18v14H3V5Z" stroke="currentColor" stroke-width="2"/><path d="M7 15V9l3 4 3-4v6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
]

const features = [
  { label: '亮色 / 暗色模式', icon: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.64 5.64l1.41 1.41M16.95 16.95l1.41 1.41M5.64 18.36l1.41-1.41M16.95 7.05l1.41-1.41" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>' },
  { label: '响应式布局',   icon: '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="12" rx="1" stroke="currentColor" stroke-width="2"/><path d="M9 18v2h6v-2" stroke="currentColor" stroke-width="2"/></svg>' },
  { label: '全文搜索',     icon: '<svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="2"/><path d="M20 20l-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' },
  { label: 'Markdown 渲染', icon: '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="1" stroke="currentColor" stroke-width="2"/><path d="M7 15V9l3 4 3-4v6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
  { label: '代码语法高亮', icon: '<svg viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="1" stroke="currentColor" stroke-width="2"/><path d="M8 9l3 3-3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M16 9l-3 3 3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' },
  { label: '目录导航',     icon: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="18" cy="18" r="2" stroke="currentColor" stroke-width="2"/></svg>' },
]

/* ── refs ── */
const pageRef = ref<HTMLElement | null>(null)
const heroRef = ref<HTMLElement | null>(null)
const shapesRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subRef = ref<HTMLElement | null>(null)
const indicatorRef = ref<HTMLElement | null>(null)
const bioRef = ref<HTMLElement | null>(null)
const dividerRef = ref<HTMLElement | null>(null)
const dividerRef2 = ref<HTMLElement | null>(null)
const techRef = ref<HTMLElement | null>(null)
const featuresRef = ref<HTMLElement | null>(null)
const endRef = ref<HTMLElement | null>(null)

const hoveredCard = ref(-1)

/* ── mouse parallax ── */
function onMouseMove(e: MouseEvent) {
  if (!shapesRef.value) return
  const rect = shapesRef.value.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  const px = (e.clientX - cx) / rect.width
  const py = (e.clientY - cy) / rect.height
  shapesRef.value.querySelectorAll<HTMLElement>('.deco-shape').forEach((el) => {
    const depth = parseFloat(el.dataset.depth || '0.3')
    el.style.setProperty('--dx', `${px * depth * 30}px`)
    el.style.setProperty('--dy', `${py * depth * 30}px`)
  })
}

/* ── card hover tilt ── */
const cardTilts = new Map<number, HTMLElement>()
function onCardMove(e: MouseEvent, i: number) {
  hoveredCard.value = i
  const card = (e.currentTarget as HTMLElement)
  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const rx = (x / rect.width - 0.5) * 12
  const ry = (y / rect.height - 0.5) * -12
  card.style.setProperty('--rx', `${rx}deg`)
  card.style.setProperty('--ry', `${ry}deg`)
  cardTilts.set(i, card)
}
function onCardLeave(i: number) {
  hoveredCard.value = -1
  const card = cardTilts.get(i)
  if (card) {
    card.style.setProperty('--rx', '0deg')
    card.style.setProperty('--ry', '0deg')
  }
}

/* ── IntersectionObserver for scroll reveals ── */
let observer: IntersectionObserver | null = null
let subTimer: ReturnType<typeof setTimeout>
let indTimer: ReturnType<typeof setTimeout>

onMounted(() => {
  // Hero entrance
  if (titleRef.value) titleRef.value.classList.add('in')
  subTimer = setTimeout(() => subRef.value?.classList.add('in'), 200)
  indTimer = setTimeout(() => indicatorRef.value?.classList.add('in'), 600)

  // Scroll sections
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in')
          observer?.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  )

  const targets = [bioRef.value, dividerRef.value, dividerRef2.value, techRef.value, featuresRef.value, endRef.value]
    .filter(Boolean) as HTMLElement[]

  targets.forEach((el) => observer?.observe(el))

  // Cards inside the component (use component root to respect scoped styles)
  requestAnimationFrame(() => {
    if (!pageRef.value) return
    pageRef.value.querySelectorAll<HTMLElement>('.tech-card, .feat-card').forEach((el) => {
      observer?.observe(el)
    })
  })
})

onUnmounted(() => {
  clearTimeout(subTimer)
  clearTimeout(indTimer)
  observer?.disconnect()
})
</script>

<style scoped>
/* ═══════════ LAYOUT ═══════════ */
.about-page {
  max-width: 780px;
  margin: 0 auto;
  padding: 0 1rem 6rem;
}

.section {
  padding: 4rem 0;
}
.section-content {
  max-width: 640px;
  margin: 0 auto;
}
.section-header {
  text-align: center;
  margin-bottom: 3rem;
}
.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}
.section-desc {
  font-size: 0.8125rem;
  color: var(--text-muted);
  margin-top: 0.5rem;
}

/* ═══════════ HERO ═══════════ */
.hero {
  position: relative;
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* ── shapes ── */
.hero-shapes {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.deco-shape {
  position: absolute;
  transition: transform 0.15s ease-out;
  transform: translate(var(--dx, 0), var(--dy, 0));
}
.deco-shape svg {
  display: block;
  width: 100%;
  height: 100%;
  animation: decoFloat 8s ease-in-out infinite;
}
.pos-tl  { top: 8%; left: 5%; }
.pos-tr  { top: 12%; right: 8%; }
.pos-bl  { bottom: 18%; left: 6%; }
.pos-br  { bottom: 12%; right: 10%; }
.pos-tm  { top: 28%; left: 50%; }
.pos-bm  { bottom: 20%; left: 35%; }

@keyframes decoFloat {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-12px); }
}

/* staggered float delays */
.pos-tl .deco-shape svg { animation-delay: 0s; }
.pos-tr .deco-shape svg { animation-delay: 1.5s; }
.pos-bl .deco-shape svg { animation-delay: 3s; }
.pos-br .deco-shape svg { animation-delay: 0.8s; }
.pos-tm .deco-shape svg { animation-delay: 2.2s; }
.pos-bm .deco-shape svg { animation-delay: 1s; }

/* ── hero text ── */
.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  pointer-events: none;
}
.hero-title {
  font-size: 4rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1;
  color: var(--text-primary);
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.hero-title.in {
  opacity: 1;
  transform: translateY(0);
}

.hero-sub {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-top: 1.25rem;
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.6s ease 0.2s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s;
}
.hero-sub.in {
  opacity: 1;
  transform: translateY(0);
}

.hero-indicator {
  margin-top: 4rem;
  color: var(--text-muted);
  opacity: 0;
  animation: bounceDown 2.2s ease-in-out infinite;
  transition: opacity 0.4s ease 0.6s;
  display: flex;
  justify-content: center;
}
.hero-indicator.in {
  opacity: 1;
}
@keyframes bounceDown {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(8px); }
}

/* ═══════════ BIO ═══════════ */
.bio-section {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
.bio-section.in {
  opacity: 1;
  transform: translateY(0);
}
.bio-text {
  font-size: 0.9375rem;
  line-height: 1.9;
  color: var(--text-secondary);
}
.bio-text strong {
  color: var(--accent);
  font-weight: 600;
}
.bio-text p + p {
  margin-top: 0.75rem;
}

.bio-marquee {
  margin-top: 3rem;
  display: flex;
  gap: 2rem;
  overflow: hidden;
  white-space: nowrap;
  mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
}
.marquee-item {
  font-size: 0.6875rem;
  letter-spacing: 0.15em;
  color: var(--text-muted);
  font-weight: 500;
  animation: marquee 20s linear infinite;
  flex-shrink: 0;
}
@keyframes marquee {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-100%); }
}

/* ═══════════ DIVIDER ═══════════ */
.section-divider {
  display: flex;
  justify-content: center;
  padding: 0.5rem 0;
  opacity: 0;
  transition: opacity 0.6s ease;
}
.section-divider.in {
  opacity: 1;
}
.section-divider svg circle {
  animation: dotPulse 2s ease-in-out infinite;
}
.section-divider svg circle:nth-child(2) { animation-delay: 0.3s; }
.section-divider svg circle:nth-child(3) { animation-delay: 0.6s; }
@keyframes dotPulse {
  0%, 100% { opacity: 0.3; }
  50%      { opacity: 0.9; }
}

/* ═══════════ CARDS ═══════════ */
.card-grid {
  display: grid;
  gap: 1px;
  background: var(--border-primary);
  box-shadow: var(--shadow-glass);
}
.card-grid.cols-3 {
  grid-template-columns: repeat(3, 1fr);
}

.card {
  position: relative;
  background: var(--bg-glass);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
  overflow: hidden;
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity 0.5s ease,
    transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
    background 0.25s,
    backdrop-filter 0.25s;
  transition-delay: calc(var(--i, 0) * 0.08s);
}
.card.in {
  opacity: 1;
  transform: translateY(0);
}

.card-icon {
  width: 2rem;
  height: 2rem;
  color: var(--accent);
  position: relative;
  z-index: 1;
}
.card-icon :deep(svg) {
  width: 100%;
  height: 100%;
  display: block;
}

.card-label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-primary);
  position: relative;
  z-index: 1;
}

/* ── tech-card tilt + glow ── */
.tech-card {
  cursor: default;
  transform-style: preserve-3d;
  perspective: 600px;
  transition:
    opacity 0.5s ease calc(var(--i, 0) * 0.08s),
    transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) calc(var(--i, 0) * 0.08s);
}
.tech-card:hover {
  background: var(--bg-secondary);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}
.tech-card .card-icon,
.tech-card .card-label {
  transition: transform 0.2s ease;
  transform: rotateX(var(--ry, 0deg)) rotateY(var(--rx, 0deg));
}

.card-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(ellipse at var(--mx, 50%) var(--my, 50%), var(--accent) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.3s ease;
}
.card-glow.active {
  opacity: 0.08;
}

/* ── feat-card hover ── */
.feat-card {
  transition:
    opacity 0.5s ease calc(var(--i, 0) * 0.08s),
    transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) calc(var(--i, 0) * 0.08s),
    background 0.25s,
    outline 0.25s;
  outline: 1px solid transparent;
}
.feat-card:hover {
  background: var(--bg-secondary);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  outline-color: var(--border-secondary);
}
.feat-card .card-icon {
  transition: transform 0.3s ease;
}
.feat-card:hover .card-icon {
  transform: scale(1.15);
}

/* ═══════════ END ═══════════ */
.end-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.end-section.in {
  opacity: 1;
  transform: translateY(0);
}
.end-visual {
  display: flex;
  justify-content: center;
}
.end-text {
  font-size: 0.6875rem;
  letter-spacing: 0.2em;
  color: var(--text-muted);
}

/* ═══════════ RESPONSIVE ═══════════ */
@media (max-width: 640px) {
  .hero-title { font-size: 2.5rem; }
  .hero { min-height: 60vh; }
  .card-grid.cols-3 { grid-template-columns: repeat(2, 1fr); }
  .section { padding: 3rem 0; }
  .deco-shape { opacity: 0.12; }
}
@media (max-width: 400px) {
  .card-grid.cols-3 { grid-template-columns: 1fr; }
}
</style>
