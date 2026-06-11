import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: ['src/**/*.d.ts', 'src/main.tsx', 'src/vite-env.d.ts'],
    },
  },
  optimizeDeps: {
    include: [
      '@mui/material',
      '@mui/material/styles',
      '@mui/icons-material/Check',
      '@mui/icons-material/EmojiEvents',
      '@mui/icons-material/ExpandMore',
      '@mui/icons-material/TrendingUp',
      '@mui/icons-material/WarningAmber',
      '@mui/icons-material/Whatshot',
      '@mui/material/Checkbox',
      '@mui/material/Divider',
      '@mui/material/FormControlLabel',
      '@mui/material/FormGroup',
      '@mui/material/Grid',
    ],
  },
})
