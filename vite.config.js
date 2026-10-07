import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/專案名稱/',   // 必須與 GitHub repo 名稱相同,前後都要有斜線
})