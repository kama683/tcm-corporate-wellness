import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // 3D грузится отдельным ленивым чанком (three + drei, ~247 КБ gzip)
    // и только когда сцену показываем, поэтому порог поднят осознанно.
    chunkSizeWarningLimit: 1000,
  },
})
