<script setup lang="ts">
import PageHead from '../components/PageHead.vue'
import { usePageTitle } from '../utils/usePageTitle'

usePageTitle('关于')
</script>

<template>
  <div class="page-shell">
    <div class="page-content">
      <div class="animate-reveal">
        <div class="about-page">
          <PageHead title="关于" />

          <h2 class="about-title">SorryAsh</h2>

          <p class="about-text">
            这里是SorryAsh的小窝，由DeepSeek搭配Opencode、Zcode编写制作的博客。
          </p>
          <p class="about-text">
            博客部署在GitHubPages上，大部分内容抄写自互联网，只做学习用途，如有侵权请联系删除。
          </p>
          <p class="about-text">
            GitHub的贡献基本是更新笔记与更新博客，一些学习后的学习项目文件夹被我push到了GitHub上，本人没有能力参加开源项目，但愿有一天可以。
          </p>
          <p class="about-text">
            网站的设计部分AI参与甚少，基本只参与了编写和给一些参考，不要觉得此网站的水平就是DeepSeek的水平，DeepSeek审美没这么烂。
          </p>

          <section class="gh-section">
            <img
              class="gh-chart"
              src="https://ghchart.rshah.org/didiberber3"
              alt="GitHub 贡献图"
              loading="lazy"
            />
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-page {
  width: 100%;
  max-width: var(--reading);
  margin-inline: auto;
}

.about-title {
  margin-bottom: var(--space-4);
  font-size: var(--text-lg);
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--text-primary);
}

.about-text {
  margin-bottom: var(--space-4);
  font-size: var(--text-md);
  line-height: 1.85;
  color: var(--text-secondary);
}

/* GitHub 贡献图：1px 边框容器，无阴影；暗色下反色保证可读 */
.gh-section {
  margin-top: var(--space-6);
  padding: var(--space-3);
  border: 1px solid var(--border-primary);
}
.gh-chart {
  display: block;
  width: 100%;
  height: auto;
}
.dark .gh-chart {
  filter: invert(0.92) hue-rotate(180deg);
}

@media (max-width: 768px) {
  .about-text {
    font-size: var(--text-base);
    line-height: 1.8;
  }
  .gh-section {
    padding: var(--space-2);
  }
}
</style>
