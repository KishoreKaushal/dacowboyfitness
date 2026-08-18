import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('media-')
        }
      }
    }),
    tailwindcss()
  ],
  optimizeDeps: {
    include: ['@traptitech/markdown-it-katex']
  },
  build: {
    chunkSizeWarningLimit: 550,
    rolldownOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/firebase') || id.includes('node_modules/@firebase')) {
            return 'firebase'
          }
        },
      },
    },
  },
})
