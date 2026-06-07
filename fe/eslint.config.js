import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import prettierConfig from 'eslint-config-prettier'
import reactPlugin from 'eslint-plugin-react'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      prettierConfig,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      'keyword-spacing': ['error', { before: true, after: true }],
      'object-curly-spacing': ['error', 'always'],
      'space-before-blocks': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-trailing-spaces': 'error',
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
      'max-lines': ['error', { max: 300, skipBlankLines: true, skipComments: true }],
      'prefer-const': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: "JSXAttribute[name.name='sx'] Literal[value=/^#|rgb|rgba/]",
          message:
            "Không được hardcode mã màu (Hex/RGB) trong prop 'sx'. Hãy sử dụng các biến màu từ Theme (ví dụ: 'primary.main', 'background.paper', 'text.primary').",
        },
        {
          selector: "JSXAttribute[name.name='sx'] Literal[value=/px$/]",
          message:
            "Không được hardcode đơn vị pixel ('px') trong prop 'sx'. Hãy sử dụng giá trị số (number) để MUI tự động nhân với spacing của Theme (ví dụ: mt: 2 thay vì mt: '16px').",
        },
      ],
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['**/src/components/ui/icons.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@mui/icons-material',
              message:
                "Please import icons from '@/components/ui/icons' instead of importing directly from '@mui/icons-material'.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['**/src/components/ui/**', '**/src/main.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@mui/material',
              message:
                "Please use custom components from '@/components/ui' instead of importing directly from '@mui/material'.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react: reactPlugin,
    },
    rules: {
      'react/jsx-no-literals': [
        'error',
        {
          noStrings: true,
          ignoreProps: true,
        },
      ],
    },
  },
])
