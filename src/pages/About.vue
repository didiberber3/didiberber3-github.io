<template>
  <div class="page-shell">
    <main class="page-content">
      <div class="animate-reveal">
        <div class="about-page">
          <PageHead title="关于" />
          <section class="gh-section">
            <img
            class="gh-chart"
            src="https://ghchart.rshah.org/didiberber3"
            alt="GitHub 贡献图"
            loading="lazy"
            />
          </section>
          <h1 class="about-title">SorryAsh</h1>
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


        </div> 
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import PageHead from '../components/PageHead.vue'
</script>

<style scoped>
.about-page {
  max-width: 48rem;
  margin: 0 auto;
  padding: 1.5rem 1rem 6rem;
}
.about-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.about-title::before {
  content: '';
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent);
  opacity: 0.8;
}
.about-text {
  font-size: 0.9375rem;
  line-height: 1.8;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

/* ── GitHub contributions ── */
.gh-section {
  margin: 2.5rem 0 0;
  padding: 1rem 1.25rem;
  background: var(--bg-glass);
  border: 1px solid var(--border-primary);
  border-radius: 2px;
  box-shadow: var(--shadow-glass);
}
.gh-chart {
  display: block;
  width: 100%;
  height: auto;
}
</style>
