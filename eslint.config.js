import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import ts from 'typescript-eslint'
import prettier from 'eslint-config-prettier'
import globals from 'globals'

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '*.config.*',
      '.ui-review/**',
      '.frontmatter-backup/**',
      '.acl-recovery/**',
      'content/**',
    ],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: { parserOptions: { parser: ts.parser } },
  },
  {
    files: ['src/**/*.{ts,vue}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.es2021 },
    },
  },
  {
    files: ['scripts/**/*.ts'],
    languageOptions: {
      globals: { ...globals.node, ...globals.es2021 },
    },
  },
  {
    files: ['src/pages/*.vue'],
    rules: { 'vue/multi-word-component-names': 'off' },
  },
  {
    files: ['src/__tests__/**/*.ts'],
    rules: { 'vue/one-component-per-file': 'off' },
  },
  {
    rules: {
      // 允许校验 / 清洗控制字符
      'no-control-regex': 'off',
      // 文章正文来自本地 Markdown 渲染，非用户输入
      'vue/no-v-html': 'off',
    },
  },
  prettier,
]
