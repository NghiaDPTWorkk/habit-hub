import { defineConfig } from 'vite'
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
