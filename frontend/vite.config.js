import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// it is vite and we want to use tailwind css in vite for which we use @tailwindcss/vite

export default defineConfig({
  plugins: [react(),
    tailwindcss(),],
})



