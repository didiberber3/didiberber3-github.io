import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import ts from 'typescript-eslint'
import prettier from 'eslint-config-prettier'

export default [
  js.configs.recommended,
  ...ts.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['*.vue', '**/*.vue'],
    languageOptions: { parserOptions: { parser: ts.parser } },
  },
  prettier,
  {
    ignores: ['dist/', 'node_modules/', '*.config.*'],
  },
]
